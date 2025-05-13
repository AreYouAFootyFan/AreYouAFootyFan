import { QuizAttemptModel } from "../models/quiz-attempt.model";
import { QuizModel } from "../models/quiz.model";
import { QuestionModel } from "../models/question.model";
import { ErrorUtils } from "../utils/error.utils";
import { CreateQuizAttemptDto } from "../DTOs/quiz-attempt.dto";
import { Config, Message } from "../utils/enums";
import {
  QuizAttempt,
  QuizAttemptWithQuizInfo,
  QuizAttemptWithQuestions,
  QuestionWithResponse,
  StartQuizResult,
  CompletedAttemptResult,
  AttemptSummary,
  ScoreByDifficulty,
} from "../types/quiz-attempt.types";

export class QuizAttemptService {
  static async getUserAttempts(
    userId: number
  ): Promise<QuizAttemptWithQuizInfo[]> {
    return QuizAttemptModel.findByUserId(userId);
  }

  static async getAttemptById(
    id: number,
    userId: number
  ): Promise<QuizAttemptWithQuestions> {
    const attempt = await QuizAttemptModel.findByIdWithDetails(id);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    if (attempt.user_id !== userId) {
      throw ErrorUtils.forbidden(Message.Error.Attempt.NO_ACCESS);
    }

    const questionsWithResponses =
      await QuizAttemptModel.getQuizQuestionsWithResponses(id);

    return {
      ...attempt,
      questions: questionsWithResponses,
    };
  }

  static async startQuiz(data: CreateQuizAttemptDto): Promise<StartQuizResult> {
    const quiz = await QuizModel.findById(data.quiz_id);

    if (!quiz) {
      throw ErrorUtils.notFound(Message.Error.Quiz.NOT_FOUND);
    }

    const existingAttempts = await QuizAttemptModel.findByUserIdAndQuizId(
      data.user_id,
      data.quiz_id
    );

    const incompleteAttempt = existingAttempts.find((a) => a.end_time === null);

    let attempt: QuizAttempt;

    if (incompleteAttempt) {
      attempt = incompleteAttempt;
    } else {
      const questionCount = await QuizModel.countQuestions(data.quiz_id);

      if (questionCount < Config.Value.MIN_QUESTIONS_PER_QUIZ) {
        throw ErrorUtils.badRequest(Message.Error.Quiz.INSUFFICIENT_QUESTIONS);
      }

      const questions = await QuestionModel.findByQuizIdWithDetails(
        data.quiz_id
      );

      const invalidQuestions = questions.filter(
        (q) => q.answer_count != Config.Value.DEFAULT_ANSWERS_PER_QUESTION || q.correct_answer_count != 1
      );

      if (invalidQuestions.length > 0) {
        throw ErrorUtils.badRequest(Message.Error.Quiz.INVALID_QUESTIONS);
      }

      attempt = await QuizAttemptModel.create(data);
    }

    const attemptWithDetails = await QuizAttemptModel.findByIdWithDetails(
      attempt.attempt_id
    );

    if (!attemptWithDetails) {
      throw ErrorUtils.internal("Failed to retrieve attempt details");
    }

    const questionsWithResponses =
      await QuizAttemptModel.getQuizQuestionsWithResponses(attempt.attempt_id);

    const unansweredQuestions = questionsWithResponses.filter(
      (question) => !question.response_id
    );

    return {
      ...attemptWithDetails,
      questions: unansweredQuestions,
    };
  }

  static async getNextQuestion(
    attemptId: number
  ): Promise<QuestionWithResponse | null> {
    const attempt = await QuizAttemptModel.findById(attemptId);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    if (attempt.end_time) {
      throw ErrorUtils.badRequest(Message.Error.Attempt.COMPLETED);
    }

    const questions = await QuizAttemptModel.getQuizQuestionsWithResponses(
      attemptId
    );

    const nextQuestion = questions.find((question) => !question.response_id);

    if (!nextQuestion) {
      return null;
    }

    return nextQuestion;
  }

  static async completeQuiz(
    attemptId: number
  ): Promise<CompletedAttemptResult> {
    const attempt = await QuizAttemptModel.findById(attemptId);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    if (attempt.end_time) {
      throw ErrorUtils.badRequest(Message.Error.Attempt.COMPLETED);
    }

    const completedAttempt = await QuizAttemptModel.complete(attemptId);

    if (!completedAttempt) {
      throw ErrorUtils.internal(Message.Error.Base.INTERNAL_SERVER_ERROR);
    }

    const score = await QuizAttemptModel.calculateScore(attemptId);
    const completedAttemptWithDetails =
      await QuizAttemptModel.findByIdWithDetails(attemptId);

    if (!completedAttemptWithDetails) {
      throw ErrorUtils.internal("Failed to retrieve attempt details");
    }

    return {
      ...completedAttemptWithDetails,
      final_score: score,
    };
  }

  static async checkAutoComplete(attemptId: number): Promise<boolean> {
    const questions = await QuizAttemptModel.getQuizQuestionsWithResponses(
      attemptId
    );

    const allAnswered = questions.every((question) => question.response_id);

    return allAnswered;
  }

  static async getAttemptSummary(attemptId: number): Promise<AttemptSummary> {
    const attempt = await QuizAttemptModel.findByIdWithDetails(attemptId);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    const stats = await QuizAttemptModel.getAttemptStats(attemptId);

    const questionsWithResponses =
      await QuizAttemptModel.getQuizQuestionsWithResponses(attemptId);

    const scoreByDifficulty: ScoreByDifficulty = {};

    questionsWithResponses.forEach((question) => {
      if (question.response_id) {
        if (!scoreByDifficulty[question.difficulty_level]) {
          scoreByDifficulty[question.difficulty_level] = {
            total: 0,
            correct: 0,
            incorrect: 0,
            points: 0,
          };
        }

        scoreByDifficulty[question.difficulty_level].total++;

        if (question.points_earned && question.points_earned > 0) {
          scoreByDifficulty[question.difficulty_level].correct++;
        } else {
          scoreByDifficulty[question.difficulty_level].incorrect++;
        }

        scoreByDifficulty[question.difficulty_level].points +=
          question.points_earned || 0;
      }
    });

    return {
      attempt_id: attempt.attempt_id,
      quiz_id: attempt.quiz_id,
      quiz_title: attempt.quiz_title,
      start_time: attempt.start_time,
      end_time: attempt.end_time,
      total_points: attempt.total_points,
      total_questions: stats.total_questions,
      answered_questions: stats.answered_questions,
      correct_answers: stats.correct_answers,
      incorrect_answers: stats.incorrect_answers,
      completion_percentage: Math.round(
        (stats.answered_questions / stats.total_questions) * 100
      ),
      accuracy_percentage:
        stats.answered_questions > 0
          ? Math.round((stats.correct_answers / stats.answered_questions) * 100)
          : 0,
      score_by_difficulty: scoreByDifficulty,
    };
  }
}
