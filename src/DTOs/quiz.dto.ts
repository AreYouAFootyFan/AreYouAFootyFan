export interface CreateQuizDto {
  quiz_title: string;
  quiz_description?: string;
  category_id?: number | null | undefined;
  created_by: number;
}

export interface UpdateQuizDto {
  quiz_title?: string;
  quiz_description?: string;
  category_id?: number | null | undefined;
}
