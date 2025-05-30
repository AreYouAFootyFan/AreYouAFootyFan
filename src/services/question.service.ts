import { QuestionModel } from "../models/question.model";
import { QuizModel } from "../models/quiz.model";
import { DifficultyLevelModel } from "../models/difficulty.model";
import { ErrorUtils } from "../utils/error.utils";
import { CreateQuestionDto, UpdateQuestionDto } from "../DTOs/question.dto";
import { Config, Message } from "../utils/enums";
import {
  Question,
  QuestionWithAnswerStats,
  QuestionValidationData,
} from "../types/question.types";

export class QuestionService {
  static async getQuestionsByQuizId(
    quizId: number
  ): Promise<QuestionWithAnswerStats[]> {
    const quiz = await QuizModel.findById(quizId);

    if (!quiz) {
      throw ErrorUtils.notFound(Message.Error.Quiz.NOT_FOUND);
    }

    return QuestionModel.findByQuizIdWithDetails(quizId);
  }

  static async getQuestionById(id: number): Promise<QuestionWithAnswerStats> {
    const question = await QuestionModel.findByIdWithDifficulty(id);

    if (!question) {
      throw ErrorUtils.notFound(Message.Error.Question.NOT_FOUND);
    }

    const answerCount = await QuestionModel.countAnswers(id);
    const correctAnswerCount = await QuestionModel.countCorrectAnswers(id);

    return {
      ...question,
      answer_count: answerCount,
      correct_answer_count: correctAnswerCount,
    };
  }

  static async createQuestion(data: CreateQuestionDto): Promise<Question> {
    const quiz = await QuizModel.findById(data.quiz_id);

    if (!quiz) {
      throw ErrorUtils.badRequest(Message.Error.Quiz.INVALID_ID);
    }

    const difficultyLevel = await DifficultyLevelModel.findById(
      data.difficulty_id
    );

    if (!difficultyLevel) {
      throw ErrorUtils.badRequest(Message.Error.Difficulty.INVALID_ID);
    }

    return QuestionModel.create(data);
  }

  static async updateQuestion(
    id: number,
    data: UpdateQuestionDto
  ): Promise<Question> {
    const existingQuestion = await QuestionModel.findById(id);

    if (!existingQuestion) {
      throw ErrorUtils.notFound(Message.Error.Question.NOT_FOUND);
    }

    if (data.difficulty_id !== undefined) {
      const difficultyLevel = await DifficultyLevelModel.findById(
        data.difficulty_id
      );

      if (!difficultyLevel) {
        throw ErrorUtils.badRequest(Message.Error.Difficulty.INVALID_ID);
      }
    }

    const updatedQuestion = await QuestionModel.update(id, data);

    if (!updatedQuestion) {
      throw ErrorUtils.internal(Message.Error.Question.UPDATE_FAILED);
    }

    return updatedQuestion;
  }

  static async deleteQuestion(id: number): Promise<void> {
    const existingQuestion = await QuestionModel.findById(id);

    if (!existingQuestion) {
      throw ErrorUtils.notFound(Message.Error.Question.NOT_FOUND);
    }

    const deleted = await QuestionModel.softDelete(id);

    if (!deleted) {
      throw ErrorUtils.internal(Message.Error.Question.DELETE_FAILED);
    }
  }

  static async validateQuestionAnswers(
    questionId: number
  ): Promise<{ isValid: boolean; message: string }> {
    const answerCount = await QuestionModel.countAnswers(questionId);
    const correctAnswerCount = await QuestionModel.countCorrectAnswers(
      questionId
    );

    if (answerCount < Config.Value.DEFAULT_ANSWERS_PER_QUESTION) {
      return {
        isValid: false,
        message: `Question requires 4 answer options, currently has ${answerCount}`,
      };
    }

    if (correctAnswerCount !== 1) {
      return {
        isValid: false,
        message: `Question requires exactly 1 correct answer, currently has ${correctAnswerCount}`,
      };
    }

    return {
      isValid: true,
      message: "Question has valid answers",
    };
  }

  static async validateQuestion(id: number): Promise<QuestionValidationData> {
    const question = await this.getQuestionById(id);

    if (!question) {
      throw ErrorUtils.notFound(Message.Error.Question.NOT_FOUND);
    }

    const validation = await this.validateQuestionAnswers(id);

    return {
      question,
      validation,
      message: Message.Success.Question.VALIDATE,
    };
  }
}
