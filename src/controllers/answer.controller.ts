import { Request, Response, NextFunction } from "express";
import { AnswerService } from "../services/answer.service";
import { CreateAnswerDto, UpdateAnswerDto } from "../DTOs/answer.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Message, Http, Length } from "../utils/enums";

export class AnswerController {
  static async getAnswersByQuestionId(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const questionId = parseInt(request.params.questionId);

      if (isNaN(questionId)) {
        throw ErrorUtils.badRequest(Message.Error.Question.INVALID_ID);
      }

      const answers = await AnswerService.getAnswersByQuestionId(questionId);
      response.json(answers);
    } catch (error) {
      next(error);
    }
  }

  static async getAnswerById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Answer.INVALID_ID);
      }

      const answer = await AnswerService.getAnswerById(id);
      response.json(answer);
    } catch (error) {
      next(error);
    }
  }

  static async createAnswer(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { question_id, answer_text, is_correct } =
        request.body as CreateAnswerDto;

      if (!question_id) {
        throw ErrorUtils.badRequest(Message.Error.Question.ID_REQUIRED);
      }

      if (!answer_text) {
        throw ErrorUtils.badRequest(Message.Error.Answer.TEXT_REQUIRED);
      }

      if (answer_text.length < Length.Min.ANSWER_TEXT) {
        throw ErrorUtils.badRequest(Message.Error.Answer.TEXT_TOO_SHORT);
      }

      if (answer_text.length > Length.Max.ANSWER_TEXT) {
        throw ErrorUtils.badRequest(Message.Error.Answer.TEXT_TOO_LONG);
      }

      if (is_correct === undefined) {
        throw ErrorUtils.badRequest(Message.Error.Answer.IS_CORRECT_REQUIRED);
      }

      const data: CreateAnswerDto = {
        question_id: parseInt(question_id.toString()),
        answer_text,
        is_correct: Boolean(is_correct),
      };

      if (isNaN(data.question_id)) {
        throw ErrorUtils.badRequest(Message.Error.Question.ID_NAN);
      }

      const answer = await AnswerService.createAnswer(data);
      response.status(Http.Status.CREATED).json(answer);
    } catch (error) {
      next(error);
    }
  }

  static async updateAnswer(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Answer.INVALID_ID);
      }

      const { answer_text, is_correct } = request.body as UpdateAnswerDto;

      if (answer_text === undefined && is_correct === undefined) {
        throw ErrorUtils.badRequest(
          Message.Error.Permission.NO_FIELD_TO_UPDATE
        );
      }

      if (answer_text !== undefined) {
        if (answer_text.length < Length.Min.ANSWER_TEXT) {
          throw ErrorUtils.badRequest(Message.Error.Answer.TEXT_TOO_SHORT);
        }

        if (answer_text.length > Length.Max.ANSWER_TEXT) {
          throw ErrorUtils.badRequest(Message.Error.Answer.TEXT_TOO_LONG);
        }
      }

      const data: UpdateAnswerDto = {};

      if (answer_text !== undefined) {
        data.answer_text = answer_text;
      }

      if (is_correct !== undefined) {
        data.is_correct = Boolean(is_correct);
      }

      const answer = await AnswerService.updateAnswer(id, data);
      response.json(answer);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAnswer(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Answer.INVALID_ID);
      }

      await AnswerService.deleteAnswer(id);
      response.json({ message: Message.Success.Answer.DELETE});
    } catch (error) {
      next(error);
    }
  }

  static async markAsCorrect(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Answer.INVALID_ID);
      }

      const answer = await AnswerService.markAsCorrect(id);
      response.json(answer);
    } catch (error) {
      next(error);
    }
  }
}
