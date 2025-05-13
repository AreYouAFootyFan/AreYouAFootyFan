import { Answer } from "../models/answer.model";

export interface Question {
  question_id: number;
  quiz_id: number;
  question_text: string;
  difficulty_id: number;
  deactivated_at: Date | null;
}

export interface QuestionWithDifficulty extends Question {
  difficulty_level: string;
  time_limit_seconds: number;
  points_on_correct: number;
  points_on_incorrect: number;
  points_on_no_answer: number;
}

export interface QuestionWithAnswerStats extends QuestionWithDifficulty {
  answer_count: number;
  correct_answer_count: number;
}

export interface QuestionWithAnswers extends QuestionWithDifficulty {
  answers: Answer[];
}

export interface QuestionValidation {
  question_id: number;
  question_text: string;
  difficulty_id: number;
  difficulty_level: string;
  is_valid: boolean;
  answer_count: number;
  correct_answer_count: number;
  validation_messages: string[];
}

export interface QuestionValidationData {
  question: QuestionWithDifficulty;
  validation: {
    isValid: boolean;
    message: string;
  };
  message: string;
}