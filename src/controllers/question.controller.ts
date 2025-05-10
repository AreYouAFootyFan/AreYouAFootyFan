import { Request, Response, NextFunction } from "express";
import { QuestionService } from "../services/question.service";
import { CreateQuestionDto, UpdateQuestionDto } from "../DTOs/question.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Message, Http, Length } from "../utils/enums";

export class QuestionController {
  static async getQuestionsByQuizId(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const quizId = parseInt(request.params.quizId);

      if (isNaN(quizId)) {
        throw ErrorUtils.badRequest(Message.Error.Quiz.INVALID_ID);
      }

      const questions = await QuestionService.getQuestionsByQuizId(quizId);
      response.json(questions);
    } catch (error) {
      next(error);
    }
  }

  static async getQuestionById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Question.INVALID_ID);
      }

      const question = await QuestionService.getQuestionById(id);
      response.json(question);
    } catch (error) {
      next(error);
    }
  }

  static async createQuestion(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { quiz_id, question_text, difficulty_id } =
        request.body as CreateQuestionDto;

      if (!quiz_id) {
        throw ErrorUtils.badRequest(Message.Error.Question.QUIZ_ID_REQUIRED);
      }

      if (!question_text) {
        throw ErrorUtils.badRequest(Message.Error.Question.TEXT_REQUIRED);
      }

      if (question_text.length < Length.Min.QUESTION_TEXT) {
        throw ErrorUtils.badRequest(Message.Error.Question.TEXT_TOO_SHORT);
      }

      if (question_text.length > Length.Max.QUESTION_TEXT) {
        throw ErrorUtils.badRequest(Message.Error.Question.TEXT_TOO_LONG);
      }

      if (!difficulty_id) {
        throw ErrorUtils.badRequest(
          Message.Error.Question.DIFFICULTY_ID_REQUIRED
        );
      }

      const data: CreateQuestionDto = {
        quiz_id: parseInt(quiz_id.toString()),
        question_text,
        difficulty_id: parseInt(difficulty_id.toString()),
      };

      if (isNaN(data.quiz_id)) {
        throw ErrorUtils.badRequest(Message.Error.Question.QUIZ_ID_NAN);
      }

      if (isNaN(data.difficulty_id)) {
        throw ErrorUtils.badRequest(Message.Error.Question.DIFFICULTY_ID_NAN);
      }

      const question = await QuestionService.createQuestion(data);
      response.status(Http.Status.CREATED).json(question);
    } catch (error) {
      next(error);
    }
  }

  static async updateQuestion(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Question.INVALID_ID);
      }

      const { question_text, difficulty_id } =
        request.body as UpdateQuestionDto;

      if (question_text === undefined && difficulty_id === undefined) {
        throw ErrorUtils.badRequest(
          Message.Error.Permission.NO_FIELD_TO_UPDATE
        );
      }

      if (question_text !== undefined) {
        if (question_text.length < Length.Min.QUESTION_TEXT) {
          throw ErrorUtils.badRequest(Message.Error.Question.TEXT_TOO_SHORT);
        }

        if (question_text.length > Length.Max.QUESTION_TEXT) {
          throw ErrorUtils.badRequest(Message.Error.Question.TEXT_TOO_LONG);
        }
      }

      const data: UpdateQuestionDto = {};

      if (question_text !== undefined) {
        data.question_text = question_text;
      }

      if (difficulty_id !== undefined) {
        const parsedDifficultyId = parseInt(difficulty_id.toString());
        if (isNaN(parsedDifficultyId)) {
          throw ErrorUtils.badRequest(Message.Error.Question.DIFFICULTY_ID_NAN);
        }
        data.difficulty_id = parsedDifficultyId;
      }

      const question = await QuestionService.updateQuestion(id, data);
      response.json(question);
    } catch (error) {
      next(error);
    }
  }

  static async deleteQuestion(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Question.INVALID_ID);
      }

      await QuestionService.deleteQuestion(id);
      response.json({ message: Message.Success.Question.DELETE });
    } catch (error) {
      next(error);
    }
  }

  static async validateQuestion(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Question.INVALID_ID);
      }

      const question = await QuestionService.getQuestionById(id);

      const validation = await QuestionService.validateQuestionAnswers(id);

      response.json({
        question,
        validation,
        message: Message.Success.Question.VALIDATE,
      });
    } catch (error) {
      next(error);
    }
  }
}
