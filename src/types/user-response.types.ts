import { Answer } from "../models/answer.model";

export interface UserResponse {
  response_id: number;
  attempt_id: number;
  question_id: number;
  chosen_answer: number | null;
  points_earned: number;
}

export interface UserResponseDetails extends UserResponse {
  question_text: string;
  answer_text: string | null;
  is_correct: boolean | null;
  difficulty_level: string;
  points_on_correct: number;
  points_on_incorrect: number;
  points_on_no_answer: number;
}

export interface ResponseSubmissionResult extends UserResponseDetails {
  quiz_completed: boolean;
  correct_answer: Answer | null;
}

export interface NoAnswerSubmissionData {
  attempt_id: number;
  question_id: number;
}