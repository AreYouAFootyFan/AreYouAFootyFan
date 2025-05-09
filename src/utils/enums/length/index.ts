/**
 * Length constraints used throughout the application.
 * Centralizes all minimum and maximum length values for consistency.
 */

/**
 * Minimum length constraints for various fields
 */
export enum Min {
  // User-related
  USERNAME = 3,
  PASSWORD = 8,

  // Question and answer-related
  QUESTION_TEXT = 10,
  ANSWER_TEXT = 1,

  // Category-related
  CATEGORY_NAME = 2,
  CATEGORY_DESCRIPTION = 5,

  // Quiz-related
  QUIZ_TITLE = 5,
  QUIZ_DESCRIPTION = 10,
  QUESTIONS_PER_QUIZ = 5,

  // Difficulty-related
  DIFFICULTY_NAME = 3,
}

/**
 * Maximum length constraints for various fields
 */
export enum Max {
  // User-related
  USERNAME = 16,
  PASSWORD = 64,

  // Question and answer-related
  QUESTION_TEXT = 256,
  ANSWER_TEXT = 128,

  // Category-related
  CATEGORY_NAME = 32,
  CATEGORY_DESCRIPTION = 64,

  // Quiz-related
  QUIZ_TITLE = 64,
  QUIZ_DESCRIPTION = 128,
  ANSWERS_PER_QUESTION = 4,

  // Difficulty-related
  DIFFICULTY_NAME = 16,

  // File upload-related
  FILE_SIZE_MB = 5,

  // Pagination-related
  PAGE_SIZE = 20,
  DEFAULT_LIMIT = 10,
}

/**
 * Default values for counters, limits, etc.
 */
export enum Default {
  // Quiz-related
  QUESTIONS_PER_QUIZ = 5,
  ANSWERS_PER_QUESTION = 4,
  CORRECT_ANSWERS_PER_QUESTION = 1,

  // Leaderboard-related
  LEADERBOARD_LIMIT = 5,

  // Pagination-related
  PAGE_SIZE = 10,

  // Time-related (in minutes)
  SESSION_TIMEOUT = 60,
}
