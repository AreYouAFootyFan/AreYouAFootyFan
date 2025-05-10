export interface CreateQuizAttemptDto {
  user_id: number;
  quiz_id: number;
}

export interface CompleteQuizAttemptDto {
  end_time: Date;
}
