import { UserResponseModel } from "../models/user-response.model";
import { QuizAttemptModel } from "../models/quiz-attempt.model";
import { QuestionModel } from "../models/question.model";
import { AnswerModel } from "../models/answer.model";
import { ErrorUtils } from "../utils/error.utils";
import { CreateUserResponseDto } from "../DTOs/user-response.dto";
import { Message } from "../utils/enums";
import { QuizAttemptService } from "./quiz-attempt.service";
import db from '../config/db';

export class UserResponseService {
  static async getAttemptResponses(attemptId: number): Promise<any[]> {
    const attempt = await QuizAttemptModel.findById(attemptId);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    const responses = await UserResponseModel.findByAttemptId(attemptId);

    const detailedResponses = await Promise.all(
      responses.map(async (response) => {
        const details = await UserResponseModel.getResponseDetails(
          response.response_id
        );
        return details;
      })
    );

    return detailedResponses;
  }

  static async submitResponse(
    data: CreateUserResponseDto
  ): Promise<any> {
    const attempt = await QuizAttemptModel.findById(data.attempt_id);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    if (attempt.end_time) {
      throw ErrorUtils.badRequest(Message.Error.Attempt.COMPLETED);
    }

    const question = await QuestionModel.findById(data.question_id);

    if (!question) {
      throw ErrorUtils.notFound(Message.Error.Question.NOT_FOUND);
    }

    if (question.quiz_id !== attempt.quiz_id) {
      throw ErrorUtils.badRequest(Message.Error.Quiz.QUESTION_NOT_BELONG);
    }

    const answer = await AnswerModel.findById(data.answer_id);

    if (!answer) {
      throw ErrorUtils.notFound(Message.Error.Answer.NOT_FOUND);
    }

    if (answer.question_id !== data.question_id) {
      throw ErrorUtils.badRequest(Message.Error.Answer.NOT_BELONG_TO_QUESTION);
    }

    const existingResponse = await UserResponseModel.findByQuestionAndAttempt(
      data.question_id,
      data.attempt_id
    );

    if (existingResponse) {
      const updatedResponse = await UserResponseModel.update(
        existingResponse.response_id,
        { answer_id: data.answer_id }
      );

      if (!updatedResponse) {
        throw ErrorUtils.internal(Message.Error.Response.UPDATE_FAILED);
      }

      const responseDetails = await UserResponseModel.getResponseDetails(
        updatedResponse.response_id
      );

      const shouldAutoComplete = await QuizAttemptService.checkAutoComplete(
        data.attempt_id
      );

      return {
        ...responseDetails,
        quiz_completed: shouldAutoComplete,
      };
    }

    const response = await UserResponseModel.create(data);
    const responseDetails = await UserResponseModel.getResponseDetails(
      response.response_id
    );

    const shouldAutoComplete = await QuizAttemptService.checkAutoComplete(
      data.attempt_id
    );

    return {
      ...responseDetails,
      quiz_completed: shouldAutoComplete,
    };
  }

  static async submitNoAnswerResponse(
    attemptId: number,
    questionId: number,
  ): Promise<any> {

    const attempt = await QuizAttemptModel.findById(attemptId);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    if (attempt.end_time) {
      throw ErrorUtils.badRequest(Message.Error.Attempt.COMPLETED);
    }

    const question = await QuestionModel.findById(questionId);

    if (!question) {
      throw ErrorUtils.notFound(Message.Error.Question.NOT_FOUND);
    }

    if (question.quiz_id !== attempt.quiz_id) {
      throw ErrorUtils.badRequest(Message.Error.Quiz.QUESTION_NOT_BELONG);
    }

    const existingResponse = await UserResponseModel.findByQuestionAndAttempt(
      questionId,
      attemptId
    );

    if (existingResponse) {
      return UserResponseModel.getResponseDetails(existingResponse.response_id);
    }

    const questionDetails = await QuestionModel.findByIdWithDifficulty(questionId);
    
    const response = await db.query(
      `INSERT INTO user_responses (attempt_id, question_id, chosen_answer, points_earned) 
      VALUES ($1, $2, NULL, $3) 
      RETURNING response_id`,
      [attemptId, questionId ,questionDetails.points_on_no_answer]
    );

    const responseId = response.rows[0].response_id;
    const responseDetails = await UserResponseModel.getResponseDetails(responseId);

    const shouldAutoComplete = await QuizAttemptService.checkAutoComplete(attemptId);

    return {
      ...responseDetails,
      quiz_completed: shouldAutoComplete,
    };
  }

  static async getResponseById(responseId: number): Promise<any> {
    const response = await UserResponseModel.getResponseDetails(responseId);

    if (!response) {
      throw ErrorUtils.notFound(Message.Error.Response.NOT_FOUND);
    }

    return response;
  }
}
