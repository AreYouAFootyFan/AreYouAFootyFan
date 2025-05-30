export interface CreateDifficultyLevelDto {
  difficulty_level: string;
  time_limit_seconds: number;
  points_on_correct: number;
  points_on_incorrect: number;
  points_on_no_answer?: number; 
}

export interface UpdateDifficultyLevelDto {
  difficulty_level?: string;
  time_limit_seconds?: number;
  points_on_correct?: number;
  points_on_incorrect?: number;
  points_on_no_answer?: number;
}