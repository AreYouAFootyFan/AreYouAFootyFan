import { UserResponseModel } from "../models/user-response.model";
import { QuizAttemptModel } from "../models/quiz-attempt.model";
import { QuestionModel } from "../models/question.model";
import { AnswerModel } from "../models/answer.model";
import { ErrorUtils } from "../utils/error.utils";
import { CreateUserResponseDto } from "../DTOs/user-response.dto";
import { User, Message } from "../utils/enums";
import { QuizAttemptService } from "./quiz-attempt.service";

export class UserResponseService {
  static async getAttemptResponses(attemptId: number): Promise<any[]> {
    const attempt = await QuizAttemptModel.findById(attemptId);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.AttemptError.NOT_FOUND);
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
    data: CreateUserResponseDto,
    userRole: string
  ): Promise<any> {
    const attempt = await QuizAttemptModel.findById(data.attempt_id);

    if (userRole !== User.Role.PLAYER) {
      throw ErrorUtils.forbidden(Message.Error.RoleError.FORBIDDEN_PLAYER);
    }

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.AttemptError.NOT_FOUND);
    }

    if (attempt.end_time) {
      throw ErrorUtils.badRequest(Message.Error.AttemptError.COMPLETED);
    }

    const question = await QuestionModel.findById(data.question_id);

    if (!question) {
      throw ErrorUtils.notFound(Message.Error.QuestionError.NOT_FOUND);
    }

    if (question.quiz_id !== attempt.quiz_id) {
      throw ErrorUtils.badRequest(
        Message.Error.QuizError.QUESTION_NOT_BELONG
      );
    }

    const answer = await AnswerModel.findById(data.answer_id);

    if (!answer) {
      throw ErrorUtils.notFound(Message.Error.AnswerError.NOT_FOUND);
    }

    if (answer.question_id !== data.question_id) {
      throw ErrorUtils.badRequest(Message.Error.AnswerError.NOT_BELONG_TO_QUESTION);
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
        throw ErrorUtils.internal(Message.Error.ResponseError.UPDATE_FAILED);
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

  static async getResponseById(responseId: number): Promise<any> {
    const response = await UserResponseModel.getResponseDetails(responseId);

    if (!response) {
      throw ErrorUtils.notFound(Message.Error.ResponseError.NOT_FOUND);
    }

    return response;
  }
}
