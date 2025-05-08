import { QuizAttemptModel } from '../models/quiz-attempt.model';
import { UserResponseModel } from '../models/user-response.model';
import { QuizModel } from '../models/quiz.model';
import { QuestionModel } from '../models/question.model';
import { ErrorUtils } from '../utils/error.utils';
import { CreateQuizAttemptDto } from '../DTOs/quiz-attempt.dto';

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
      throw ErrorUtils.notFound('Quiz attempt not found');
    }
    
    if (attempt.user_id !== userId) {
      throw ErrorUtils.forbidden('You do not have permission to access this attempt');
    }
    const questionsWithResponses = await QuizAttemptModel.getQuizQuestionsWithResponses(id);
    attempt.questions = questionsWithResponses;
    
    return attempt;
  }

 
  static async startQuiz(data: CreateQuizAttemptDto, userRole: string): Promise<any> {
    
    if (userRole !== 'Player') {
      throw ErrorUtils.forbidden('Only Players can start quizzes');
    }

    const quiz = await QuizModel.findById(data.quiz_id);
    
    if (!quiz) {
      throw ErrorUtils.notFound('Quiz not found');
    }
    
    const questionCount = await QuizModel.countQuestions(data.quiz_id);
    
    if (questionCount < 5) {
      throw ErrorUtils.badRequest('Quiz does not have enough questions (minimum 5 required)');
    }

    const questions = await QuestionModel.findByQuizIdWithDetails(data.quiz_id);
    
    const invalidQuestions = questions.filter(q => 
      q.answer_count != 4 || q.correct_answer_count != 1
    );
    
    if (invalidQuestions.length > 0) {
      throw ErrorUtils.badRequest('Quiz has invalid questions (each question must have exactly 4 answers with 1 correct)');
    }
    
    const attempt = await QuizAttemptModel.create(data);
    
    const attemptWithDetails = await QuizAttemptModel.findByIdWithDetails(attempt.attempt_id);
    const questionsWithAnswers = await QuizAttemptModel.getQuizQuestionsWithResponses(attempt.attempt_id);
    
    return {
      ...attemptWithDetails,
      questions: questionsWithAnswers
    };
  }

 
  static async getNextQuestion(attemptId: number): Promise<any> {
    const attempt = await QuizAttemptModel.findById(attemptId);
    
    if (!attempt) {
      throw ErrorUtils.notFound('Quiz attempt not found');
    }
    
    if (attempt.end_time) {
      throw ErrorUtils.badRequest('Quiz attempt is already completed');
    }
    
    const questions = await QuizAttemptModel.getQuizQuestionsWithResponses(attemptId);
    
    const nextQuestion = questions.find(q => !q.response_id);
    
    if (!nextQuestion) {
      return null; // All questions answered
    }
    
    return nextQuestion;
  }

  
  static async completeQuiz(attemptId: number): Promise<any> {
    const attempt = await QuizAttemptModel.findById(attemptId);
    
    if (!attempt) {
      throw ErrorUtils.notFound('Quiz attempt not found');
    }
    
    if (attempt.end_time) {
      throw ErrorUtils.badRequest('Quiz attempt is already completed');
    }
    
    const completedAttempt = await QuizAttemptModel.complete(attemptId);
    
    if (!completedAttempt) {
      throw ErrorUtils.internal('Failed to complete quiz attempt');
    }
    
    const score = await QuizAttemptModel.calculateScore(attemptId);
    const completedAttemptWithDetails = await QuizAttemptModel.findByIdWithDetails(attemptId);
    
    return {
      ...completedAttemptWithDetails,
      final_score: score
    };
  }

  
  static async checkAutoComplete(attemptId: number): Promise<boolean> {
    const questions = await QuizAttemptModel.getQuizQuestionsWithResponses(attemptId);
    
    const allAnswered = questions.every(q => q.response_id);
    
    return allAnswered;
  }

  
  static async getAttemptSummary(attemptId: number): Promise<any> {
    const attempt = await QuizAttemptModel.findByIdWithDetails(attemptId);
    
    if (!attempt) {
      throw ErrorUtils.notFound('Quiz attempt not found');
    }
    
    const questionsWithResponses = await QuizAttemptModel.getQuizQuestionsWithResponses(attemptId);
    
    const totalQuestions = questionsWithResponses.length;
    const answeredQuestions = questionsWithResponses.filter(q => q.response_id).length;
    const correctAnswers = questionsWithResponses.filter(q => q.response_id && q.points_earned > 0).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;
    
    const scoreByDifficulty: ScoreByDifficulty = {};
    
    questionsWithResponses.forEach(q => {
      if (q.response_id) {
        if (!scoreByDifficulty[q.difficulty_level]) {
          scoreByDifficulty[q.difficulty_level] = {
            total: 0,
            correct: 0,
            incorrect: 0,
            points: 0
          };
        }
        
        scoreByDifficulty[q.difficulty_level].total++;
        
        if (q.points_earned > 0) {
          scoreByDifficulty[q.difficulty_level].correct++;
        } else {
          scoreByDifficulty[q.difficulty_level].incorrect++;
        }
        
        scoreByDifficulty[q.difficulty_level].points += q.points_earned;
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
      completion_percentage: Math.round((answeredQuestions / totalQuestions) * 100),
      accuracy_percentage: answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0,
      score_by_difficulty: scoreByDifficulty
    };
  }
}