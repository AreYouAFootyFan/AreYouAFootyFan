export interface CreateUserResponseDto {
  attempt_id: number;
  question_id: number;
  answer_id: number;
}

export interface UpdateUserResponseDto {
  answer_id: number;
}