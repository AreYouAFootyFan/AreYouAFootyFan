import { Length } from "../../";

export enum Base {
  UNAUTHORIZED = "Authentication token is required",
  USER_NOT_AUTHENTICATED = "User not authenticated",
  BAD_REQUEST = "Bad request",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "Not found",
  CONFLICT = "Conflict",
  INTERNAL_SERVER_ERROR = "Internal server error",
  INVALID_LIMIT = "Invalid limit parameter",
}

export enum Api {
  SOMETHING_WENT_WRONG = "Something went wrong",
  DUPLICATE_RECORD = "A record with this information already exists",
  ENDPOINT_NOT_FOUND = "Cannot {method} {path}",
}

export enum Auth {
  GOOGLE_CODE_REQUIRED = "Google code is required",
}

export enum Quiz {
  NOT_FOUND = "Quiz not found",
  INSUFFICIENT_QUESTIONS = "Quiz does not have enough questions (minimum 5 required)",
  INVALID_QUESTIONS = "Quiz has invalid questions (each question must have exactly 4 answers with 1 correct)",
  HAS_ATTEMPTS = "Cannot delete quiz as it has active attempts",
  QUESTION_NOT_BELONG = "Question does not belong to the current quiz",
  UPDATE_FAILED = "Failed to update quiz",
  DELETE_FAILED = "Failed to delete quiz",
  INVALID_ID = "Invalid quiz ID",
  ID_REQUIRED = "Quiz ID is required",
  TITLE_REQUIRED = "Quiz title is required",
  TITLE_TOO_SHORT = `Quiz title must be at least ${Length.Min.QUIZ_TITLE} characters`,
  TITLE_TOO_LONG = `Quiz title cannot exceed ${Length.Max.QUIZ_TITLE} characters`,
  DESCRIPTION_TOO_SHORT = `Quiz description must be at least ${Length.Min.QUIZ_DESCRIPTION} characters`,
  DESCRIPTION_TOO_LONG = `Quiz description cannot exceed ${Length.Max.QUIZ_DESCRIPTION} characters`,
}

export enum Question {
  NOT_FOUND = "Question not found",
  ID_REQUIRED = "Question ID is required",
  ID_NAN = "Question ID must be a number",
  INVALID_ID = "Invalid Question ID",
  UPDATE_FAILED = "Failed to update question",
  DELETE_FAILED = "Failed to delete question",
  QUIZ_ID_REQUIRED = "Quiz ID is required",
  TEXT_REQUIRED = "Question text is required",
  TEXT_TOO_SHORT = `Question text must be at least ${Length.Min.QUESTION_TEXT} characters`,
  TEXT_TOO_LONG = `Question text cannot exceed ${Length.Max.QUESTION_TEXT} characters`,
  QUIZ_ID_NAN = "Quiz ID must be a number",
  DIFFICULTY_ID_REQUIRED = "Difficulty level ID is required",
  DIFFICULTY_ID_NAN = "Difficulty ID must be a number",
  HAS_ANSWERS = "Cannot delete question as it has associated answers",
  DELETE_SUCCESS = "Question deleted successfully",
}

export enum Answer {
  NOT_FOUND = "Answer not found",
  TEXT_REQUIRED = "Answer text is required",
  TEXT_TOO_SHORT = `Answer text must be at least ${Length.Min.ANSWER_TEXT} character`,
  TEXT_TOO_LONG = `Answer text cannot exceed ${Length.Max.ANSWER_TEXT} characters`,
  INVALID_ID = "Invalid Answer ID",
  ID_REQUIRED = "Answer ID is required",
  IS_CORRECT_REQUIRED = "`is_correct` flag is required",
  NOT_BELONG_TO_QUESTION = "Answer does not belong to the question",
  UPDATE_FAILED = "Failed to update answer",
  DELETE_FAILED = "Failed to delete answer",
  MAX_ANSWERS_REACHED = "Question already has the maximum of 4 answers",
  CANNOT_REMOVE_ONLY_CORRECT = "Cannot remove the only correct answer. Mark another answer as correct first.",
  CANNOT_DELETE_ONLY_CORRECT = "Cannot delete the only correct answer. Mark another answer as correct first.",
}

export enum Attempt {
  NOT_FOUND = "Quiz attempt not found",
  COMPLETED = "Quiz attempt is already completed",
  NO_ACCESS = "You do not have permission to access this attempt",
  INVALID_ID = "Invalid attempt ID",
  ID_REQUIRED = "Attempt ID is required",
}

export enum Category {
  NOT_FOUND = "Category not found",
  INVALID = "Invalid category ID",
  NAME_REQUIRED = "Category name is required",
  NAME_TOO_SHORT = `Category name must be at least ${Length.Min.CATEGORY_NAME} characters`,
  NAME_TOO_LONG = `Category name cannot exceed ${Length.Max.CATEGORY_NAME} characters`,
  DESCRIPTION_TOO_SHORT = `Category description must be at least ${Length.Min.CATEGORY_DESCRIPTION} characters`,
  DESCRIPTION_TOO_LONG = `Category description cannot exceed ${Length.Max.CATEGORY_DESCRIPTION} characters`,
  NAME_EXISTS = "A category with this name already exists",
  NAME_EXISTS_OTHER = "Another category with this name already exists",
  UPDATE_FAILED = "Failed to update category",
  DELETE_FAILED = "Failed to delete category",
  USED_BY_QUIZZES = "Cannot delete category as it is used by existing quizzes",
}

export enum Permission {
  USERNAME_REQUIRED = "Username is required to access this resource",
  NO_FIELD_TO_UPDATE = "At least one field to update is required",
}

export enum Role {
  FORBIDDEN_PLAYER = "Only Players can submit responses",
  FORBIDDEN_MANAGER = "Only Managers can create quizzes",
}

export enum Token {
  INVALID_FORMAT = "Invalid token format",
  INVALID_TOKEN = "Invalid Google token",
  MISSING_USER_ID = "Invalid Google token: missing user ID",
  EXPIRED = "Invalid or expired token",
}

export enum Response {
  NOT_FOUND = "Response not found",
  UPDATE_FAILED = "Failed to update response",
  INVALID_ID = "Invalid response ID",
}

export enum User {
  NOT_FOUND = "User not found",
  GOOGLE_ID_EXISTS = "User with this Google ID already exists",
  USERNAME_TAKEN = "Username already taken",
  UPDATE_FAILED = "Failed to update user",
  DEACTIVATE_FAILED = "Failed to deactivate user",
  USERNAME_REQUIRED = "Username is required",
  USERNAME_TOO_SHORT = `Username must be at least ${Length.Min.USERNAME} characters`,
  USERNAME_TOO_LONG = `Username cannot exceed ${Length.Max.USERNAME} characters`,
  INVALID_ID = "Invalid user ID",
  INVALID_ROLE_ID = "Invalid role ID",
}

export enum Leaderboard {
  FETCH_RANK_FAILED = "Failed to fetch user rank",
  FETCH_TOP_FAILED = "Failed to fetch top players",
}

export enum Difficulty {
  INVALID_ID = "Invalid difficulty level ID",
  LEVEL_REQUIRED = "Difficulty level name is required",
  LEVEL_TOO_SHORT = `Difficulty level name must be at least ${Length.Min.DIFFICULTY_NAME} characters`,
  LEVEL_TOO_LONG = `Difficulty level name cannot exceed ${Length.Max.DIFFICULTY_NAME} characters`,
  TIME_LIMIT_REQUIRED = "Time limit is required",
  POINTS_CORRECT_REQUIRED = "Points on correct is required",
  POINTS_INCORRECT_REQUIRED = "Points on incorrect is required",
  TIME_LIMIT_POSITIVE = "Time limit must be a positive number",
  POINTS_CORRECT_NUMBER = "Points on correct must be a number",
  POINTS_INCORRECT_NUMBER = "Points on incorrect must be a number",
  UPDATE_FAILED = "Failed to update difficulty level",
  DELETE_FAILED = "Failed to delete difficulty level",
  NOT_FOUND = "Difficulty level not found",
  NAME_EXISTS = "A difficulty level with this name already exists",
  NAME_EXISTS_OTHER = "Another difficulty level with this name already exists",
  USED_BY_QUESTIONS = "Cannot delete difficulty level as it is used by existing questions",
}
