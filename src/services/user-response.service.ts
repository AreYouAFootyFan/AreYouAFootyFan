import { UserResponseModel } from "../models/user-response.model";
import { QuizAttemptModel } from "../models/quiz-attempt.model";
import { QuestionModel } from "../models/question.model";
import { AnswerModel } from "../models/answer.model";
import { ErrorUtils } from "../utils/error.utils";
import { CreateUserResponseDto } from "../DTOs/user-response.dto";
import { Message } from "../utils/enums";
import { QuizAttemptService } from "./quiz-attempt.service";
import db from '../config/db';
import { 
  UserResponse, 
  UserResponseDetails, 
  ResponseSubmissionResult,
} from "../types/user-response.types";
import { QueryResult } from "pg";

export class UserResponseService {
  
  static async getAttemptResponses(attemptId: number): Promise<UserResponseDetails[]> {
    const attempt = await QuizAttemptModel.findById(attemptId);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    const detailedResponses = await UserResponseModel.getDetailedResponsesByAttemptId(attemptId);
    
    return detailedResponses;
}

  static async submitResponse(
    data: CreateUserResponseDto
  ): Promise<ResponseSubmissionResult> {
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

    let userResponse: UserResponse;

    if (existingResponse) {
      const updatedResponse = await UserResponseModel.update(
        existingResponse.response_id,
        { answer_id: data.answer_id }
      );

      if (!updatedResponse) {
        throw ErrorUtils.internal(Message.Error.Response.UPDATE_FAILED);
      }

      userResponse = updatedResponse;
    } else {
      userResponse = await UserResponseModel.create(data);
    }

    const responseDetails = await UserResponseModel.getResponseDetails(
      userResponse.response_id
    );

    if (!responseDetails) {
      throw ErrorUtils.notFound(Message.Error.Response.NOT_FOUND);
    }

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
  ): Promise<ResponseSubmissionResult> {

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
      const details = await UserResponseModel.getResponseDetails(existingResponse.response_id);
      if (!details) {
        throw ErrorUtils.notFound(Message.Error.Response.NOT_FOUND);
      }
      
      const shouldAutoComplete = await QuizAttemptService.checkAutoComplete(attemptId);
      
      return {
        ...details,
        quiz_completed: shouldAutoComplete
      };
    }

    const questionDetails = await QuestionModel.findByIdWithDifficulty(questionId);
    
    if (!questionDetails) {
      throw ErrorUtils.notFound(Message.Error.Question.NOT_FOUND);
    }
    
    const result: QueryResult<{ response_id: number }> = await db.query(
      `INSERT INTO user_responses (attempt_id, question_id, chosen_answer, points_earned) 
      VALUES ($1, $2, NULL, $3) 
      RETURNING response_id`,
      [attemptId, questionId, questionDetails.points_on_no_answer]
    );

    const responseId = result.rows[0].response_id;
    const responseDetails = await UserResponseModel.getResponseDetails(responseId);

    if (!responseDetails) {
      throw ErrorUtils.notFound(Message.Error.Response.NOT_FOUND);
    }

    const shouldAutoComplete = await QuizAttemptService.checkAutoComplete(attemptId);

    return {
      ...responseDetails,
      quiz_completed: shouldAutoComplete,
    };
  }

  static async getResponseById(responseId: number): Promise<UserResponseDetails> {
    const response = await UserResponseModel.getResponseDetails(responseId);

    if (!response) {
      throw ErrorUtils.notFound(Message.Error.Response.NOT_FOUND);
    }

    return response;
  }
}