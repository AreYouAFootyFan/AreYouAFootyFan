import { Request, Response, NextFunction } from "express";
import { UserResponseService } from "../services/user-response.service";
import { CreateUserResponseDto } from "../DTOs/user-response.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

export class UserResponseController {
  static async getAttemptResponses(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const attemptId = parseInt(request.params.attemptId);

      if (isNaN(attemptId)) {
        throw ErrorUtils.badRequest(Message.Error.Attempt.INVALID_ID);
      }

      const responses = await UserResponseService.getAttemptResponses(
        attemptId
      );
      response.json(responses);
    } catch (error) {
      next(error);
    }
  }

  static async submitResponse(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { attempt_id, question_id, answer_id } = request.body;

      if (!attempt_id) {
        throw ErrorUtils.badRequest(Message.Error.Attempt.ID_REQUIRED);
      }

      if (!question_id) {
        throw ErrorUtils.badRequest(Message.Error.Question.ID_REQUIRED);
      }

      if (!answer_id) {
        throw ErrorUtils.badRequest(Message.Error.Answer.ID_REQUIRED);
      }

      const parsedAttemptId = parseInt(attempt_id.toString());
      const parsedQuestionId = parseInt(question_id.toString());
      const parsedAnswerId = parseInt(answer_id.toString());

      if (isNaN(parsedAttemptId)) {
        throw ErrorUtils.badRequest(Message.Error.Attempt.INVALID_ID);
      }

      if (isNaN(parsedQuestionId)) {
        throw ErrorUtils.badRequest(Message.Error.Question.INVALID_ID);
      }

      if (isNaN(parsedAnswerId)) {
        throw ErrorUtils.badRequest(Message.Error.Answer.INVALID_ID);
      }

      const data: CreateUserResponseDto = {
        attempt_id: parsedAttemptId,
        question_id: parsedQuestionId,
        answer_id: parsedAnswerId,
      };

      const userResponse = await UserResponseService.submitResponse(data);

      response.json(userResponse);
    } catch (error) {
      next(error);
    }
  }

  static async getResponseById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Response.INVALID_ID);
      }

      const userResponse = await UserResponseService.getResponseById(id);
      response.json(userResponse);
    } catch (error) {
      next(error);
    }
  }

  static async submitNoAnswerResponse(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { attempt_id, question_id } = request.body;

      if (!attempt_id) {
        throw ErrorUtils.badRequest(Message.Error.Attempt.ID_REQUIRED);
      }

      if (!question_id) {
        throw ErrorUtils.badRequest(Message.Error.Question.ID_REQUIRED);
      }

      const parsedAttemptId = parseInt(attempt_id.toString());
      const parsedQuestionId = parseInt(question_id.toString());

      if (isNaN(parsedAttemptId)) {
        throw ErrorUtils.badRequest(Message.Error.Attempt.INVALID_ID);
      }

      if (isNaN(parsedQuestionId)) {
        throw ErrorUtils.badRequest(Message.Error.Question.INVALID_ID);
      }

      const userResponse = await UserResponseService.submitNoAnswerResponse(
        parsedAttemptId,
        parsedQuestionId
      );

      response.json(userResponse);
    } catch (error) {
      next(error);
    }
  }
}
