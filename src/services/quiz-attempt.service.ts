import { QuizAttemptModel } from "../models/quiz-attempt.model";
import { UserResponseModel } from "../models/user-response.model";
import { QuizModel } from "../models/quiz.model";
import { QuestionModel } from "../models/question.model";
import { ErrorUtils } from "../utils/error.utils";
import { CreateQuizAttemptDto } from "../DTOs/quiz-attempt.dto";
import { User, Message } from "../utils/enums";

interface DifficultyScore {
  total: number;
  correct: number;
  incorrect: number;
  points: number;
}

interface ScoreByDifficulty {
  [difficultyLevel: string]: DifficultyScore;
}

export class QuizAttemptService {
  static async getUserAttempts(userId: number): Promise<any[]> {
    return QuizAttemptModel.findByUserId(userId);
  }

  static async getAttemptById(id: number, userId: number): Promise<any> {
    const attempt = await QuizAttemptModel.findByIdWithDetails(id);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    if (attempt.user_id !== userId) {
      throw ErrorUtils.forbidden(Message.Error.Attempt.NO_ACCESS);
    }
    const questionsWithResponses =
      await QuizAttemptModel.getQuizQuestionsWithResponses(id);
    attempt.questions = questionsWithResponses;

    return attempt;
  }

  static async startQuiz(
    data: CreateQuizAttemptDto,
    userRole: string
  ): Promise<any> {

    const quiz = await QuizModel.findById(data.quiz_id);

    if (!quiz) {
      throw ErrorUtils.notFound(Message.Error.Quiz.NOT_FOUND);
    }

    const existingAttempts = await QuizAttemptModel.findByUserIdAndQuizId(
      data.user_id,
      data.quiz_id
    );

    const incompleteAttempt = existingAttempts.find(a => a.end_time === null);
    
    let attempt;
    
    if (incompleteAttempt) {
      attempt = incompleteAttempt;
    } else {
      const questionCount = await QuizModel.countQuestions(data.quiz_id);

      if (questionCount < 5) {
        throw ErrorUtils.badRequest(Message.Error.Quiz.INSUFFICIENT_QUESTIONS);
      }

      const questions = await QuestionModel.findByQuizIdWithDetails(data.quiz_id);

      const invalidQuestions = questions.filter(
        (q) => q.answer_count != 4 || q.correct_answer_count != 1
      );

      if (invalidQuestions.length > 0) {
        throw ErrorUtils.badRequest(Message.Error.Quiz.INVALID_QUESTIONS);
      }

      attempt = await QuizAttemptModel.create(data);
    }

    const attemptWithDetails = await QuizAttemptModel.findByIdWithDetails(
      attempt.attempt_id
    );
    
    const questionsWithResponses =
      await QuizAttemptModel.getQuizQuestionsWithResponses(attempt.attempt_id);

    const unansweredQuestions = questionsWithResponses.filter(
      question => !question.response_id
    );
    
    return {
      ...attemptWithDetails,
      questions: unansweredQuestions,
    };
  }

  static async getNextQuestion(attemptId: number): Promise<any> {
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
      return null; // All questions answered
    }

    return nextQuestion;
  }

  static async completeQuiz(attemptId: number): Promise<any> {
    const attempt = await QuizAttemptModel.findById(attemptId);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    if (attempt.end_time) {
      throw ErrorUtils.badRequest(Message.Error.Attempt.COMPLETED);
    }

    const completedAttempt = await QuizAttemptModel.complete(attemptId);

    if (!completedAttempt) {
      // TODO: Add a more specific error message
      throw ErrorUtils.internal(Message.Error.Base.INTERNAL_SERVER_ERROR);
    }

    const score = await QuizAttemptModel.calculateScore(attemptId);
    const completedAttemptWithDetails =
      await QuizAttemptModel.findByIdWithDetails(attemptId);

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

  static async getAttemptSummary(attemptId: number): Promise<any> {
    const attempt = await QuizAttemptModel.findByIdWithDetails(attemptId);

    if (!attempt) {
      throw ErrorUtils.notFound(Message.Error.Attempt.NOT_FOUND);
    }

    const questionsWithResponses =
      await QuizAttemptModel.getQuizQuestionsWithResponses(attemptId);

    const totalQuestions = questionsWithResponses.length;
    const answeredQuestions = questionsWithResponses.filter(
      (question) => question.response_id
    ).length;
    const correctAnswers = questionsWithResponses.filter(
      (question) => question.response_id && question.points_earned > 0
    ).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;

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

        if (question.points_earned > 0) {
          scoreByDifficulty[question.difficulty_level].correct++;
        } else {
          scoreByDifficulty[question.difficulty_level].incorrect++;
        }

        scoreByDifficulty[question.difficulty_level].points += question.points_earned;
      }
    });

    return {
      attempt_id: attempt.attempt_id,
      quiz_id: attempt.quiz_id,
      quiz_title: attempt.quiz_title,
      start_time: attempt.start_time,
      end_time: attempt.end_time,
      total_points: attempt.total_points,
      total_questions: totalQuestions,
      answered_questions: answeredQuestions,
      correct_answers: correctAnswers,
      incorrect_answers: incorrectAnswers,
      completion_percentage: Math.round(
        (answeredQuestions / totalQuestions) * 100
      ),
      accuracy_percentage:
        answeredQuestions > 0
          ? Math.round((correctAnswers / answeredQuestions) * 100)
          : 0,
      score_by_difficulty: scoreByDifficulty,
    };
  }
}
