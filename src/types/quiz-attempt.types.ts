import { QuestionWithAnswers } from "./question.types";

export interface QuizAttempt {
  attempt_id: number;
  user_id: number;
  quiz_id: number;
  start_time: Date;
  end_time: Date | null;
}

export interface QuizAttemptWithQuizInfo extends QuizAttempt {
  quiz_title: string;
  responses_count: number;
  questions_count: number;
}

export interface QuizAttemptWithDetails extends QuizAttempt {
  quiz_title: string;
  quiz_description: string | null;
  category_name: string | null;
  responses_count: number;
  questions_count: number;
  total_points: number;
}

export interface QuizAttemptWithQuestions extends QuizAttemptWithDetails {
  questions: QuestionWithResponse[];
}

export interface QuestionWithResponse extends QuestionWithAnswers {
  response_id?: number;
  selected_answer_id?: number;
  points_earned?: number;
}

export interface StartQuizResult {
  attempt_id: number;
  user_id: number;
  quiz_id: number;
  quiz_title: string;
  quiz_description: string | null;
  category_name: string | null;
  start_time: Date;
  end_time: Date | null;
  responses_count: number;
  questions_count: number;
  questions: QuestionWithResponse[];
}

export interface CompletedAttemptResult extends QuizAttemptWithDetails {
  final_score: number;
}

export interface DifficultyScore {
  total: number;
  correct: number;
  incorrect: number;
  points: number;
}

export interface ScoreByDifficulty {
  [difficultyLevel: string]: DifficultyScore;
}

export interface AttemptSummary {
  attempt_id: number;
  quiz_id: number;
  quiz_title: string;
  start_time: Date;
  end_time: Date | null;
  total_points: number;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  completion_percentage: number;
  accuracy_percentage: number;
  score_by_difficulty: ScoreByDifficulty;
}