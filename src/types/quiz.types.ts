import { PaginationOptions } from './pagination.types';

export interface Quiz {
  quiz_id: number;
  quiz_title: string;
  quiz_description: string | null;
  category_id: number | null;
  created_by: number;
  created_at: Date;
  deactivated_at: Date | null;
}

export interface QuizWithCategory extends Quiz {
  category_name: string | null;
  category_description: string | null;
}

export interface QuizWithQuestionCount extends Quiz {
  question_count: number;
}

export interface QuizWithCategoryAndCount extends QuizWithCategory {
  question_count: number;
}

export interface QuizWithValidation extends QuizWithCategoryAndCount {
  is_valid: boolean;
  valid_question_count?: number;
  in_progress?: boolean;
  has_completed?: boolean;
}

export interface QuizStatus {
  quiz: QuizWithCategory;
  has_enough_questions: boolean;
  is_ready: boolean;
}

export interface GetQuizzesOptions {
  categoryId?: number;
  validOnly?: boolean;
  userId?: number;
  userRole?: string;
  pagination?: PaginationOptions;
  useValidationView?: boolean;
}