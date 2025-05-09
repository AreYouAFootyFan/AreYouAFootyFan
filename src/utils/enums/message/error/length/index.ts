/**
 * Maximum length constraints used in error messages
 */
export enum MaxLength {
  ANSWER_TEXT = 128,
  CATEGORY_NAME = 32,
  CATEGORY_DESCRIPTION = 64,
}

/**
 * Length-related error messages
 */
export enum LengthError {
  ANSWER_TOO_LONG = `Answer text cannot exceed ${MaxLength.ANSWER_TEXT} characters`,
  CATEGORY_NAME_TOO_LONG = `Category name cannot exceed ${MaxLength.CATEGORY_NAME} characters`,
  CATEGORY_DESCRIPTION_TOO_LONG = `Category description cannot exceed ${MaxLength.CATEGORY_DESCRIPTION} characters`,
} 