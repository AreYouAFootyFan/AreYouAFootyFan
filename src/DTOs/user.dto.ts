export interface CreateUserDto {
  google_id: string;
  username?: string | null;
  role_id?: number;
}

export interface UpdateUserDto {
  username?: string;
  role_id?: number;
}
