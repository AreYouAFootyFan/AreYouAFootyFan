/**
 * Enum for user roles in the application.
 * Used to replace string literals for better type safety and consistency.
 */
export enum UserRole {
  PLAYER = "Player",
  MANAGER = "Manager",
}

/**
 * Enum for common error messages.
 * Provides consistent error messages throughout the application.
 */
export enum ErrorMessage {
  UNAUTHORIZED = "Authentication token is required",
  USER_NOT_AUTHENTICATED = "User not authenticated",
  USERNAME_REQUIRED = "Username is required to access this resource",
  QUIZ_NOT_FOUND = "Quiz not found",
  QUESTION_NOT_FOUND = "Question not found",
  ANSWER_NOT_FOUND = "Answer not found",
  CATEGORY_NOT_FOUND = "Category not found",
  ATTEMPT_NOT_FOUND = "Quiz attempt not found",
  ATTEMPT_COMPLETED = "Quiz attempt is already completed",
  INVALID_CATEGORY = "Invalid category ID",
  INSUFFICIENT_QUESTIONS = "Quiz does not have enough questions (minimum 5 required)",
  INVALID_QUESTIONS = "Quiz has invalid questions (each question must have exactly 4 answers with 1 correct)",
  QUIZ_HAS_ATTEMPTS = "Cannot delete quiz as it has active attempts",
  FORBIDDEN_PLAYER = "Only Players can submit responses",
  FORBIDDEN_MANAGER = "Only Managers can create quizzes",
  // Additional generic error messages
  BAD_REQUEST = "Bad request",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "Not found",
  CONFLICT = "Conflict",
  INTERNAL_SERVER_ERROR = "Internal server error",
}

/**
 * Enum for token-related error messages
 */
export enum TokenError {
  INVALID_FORMAT = "Invalid token format",
  INVALID_TOKEN = "Invalid Google token",
  MISSING_USER_ID = "Invalid Google token: missing user ID",
  EXPIRED = "Invalid or expired token",
}

/**
 * Enum for database table names.
 * Useful for queries and joins.
 */
export enum TableName {
  USERS = "users",
  ROLES = "roles",
  QUIZZES = "quizzes",
  QUESTIONS = "questions",
  ANSWERS = "answers",
  CATEGORIES = "categories",
  QUIZ_ATTEMPTS = "quiz_attempts",
  USER_RESPONSES = "user_responses",
  BADGES = "badges",
  BADGE_HISTORY = "badge_history",
  DIFFICULTY_LEVELS = "difficulty_levels",
}

/**
 * Enum for HTTP status codes.
 * Makes code more readable when setting response status.
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Application configuration values.
 * Centralizes important constants used throughout the application.
 */
export enum ConfigValue {
  MIN_QUESTIONS_PER_QUIZ = 5,
  DEFAULT_ANSWERS_PER_QUESTION = 4,
  DEFAULT_LEADERBOARD_LIMIT = 5,
  PASSWORD_MIN_LENGTH = 8,
  SESSION_TIMEOUT_MINUTES = 60,
  PAGE_SIZE = 10,
  MAX_FILE_SIZE_MB = 5,
  DEFAULT_ROLE_ID = 1, // Player role
}
