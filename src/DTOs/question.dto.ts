export interface CreateQuestionDto {
  quiz_id: number;
  question_text: string;
  difficulty_id: number;
}

export interface UpdateQuestionDto {
  question_text?: string;
  difficulty_id?: number;
} 