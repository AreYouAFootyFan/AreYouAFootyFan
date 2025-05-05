export interface CreateAnswerDto {
  question_id: number;
  answer_text: string;
  is_correct: boolean;
}

export interface UpdateAnswerDto {
  answer_text?: string;
  is_correct?: boolean;
} 