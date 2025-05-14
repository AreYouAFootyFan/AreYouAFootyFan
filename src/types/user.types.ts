export interface User {
  user_id: number;
  google_id: string;
  username: string | null;
  role_id: number;
  deactivated_at: Date | null;
}

export interface UserWithRole extends User {
  role_name: string;
}

export interface GoogleTokenPayload {
  iss: string;
  sub: string;
  azp: string;
  aud: string;
  iat: number;
  exp: number;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface LoginResult {
  token: string;
  user: UserWithRole;
  requiresUsername: boolean;
}

export interface AuthenticatedUser {
  id: number;
  role: string;
}

export interface UsernameStatus {
  requiresUsername: boolean;
}