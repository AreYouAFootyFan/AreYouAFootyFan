/**
 * Re-export all message enums
 */
import * as Error from './error';
export { Error };

/**
 * Success messages for various operations
 */
export enum SuccessMessage {
  ANSWER_DELETE = "Answer deleted successfully",
  CATEGORY_DELETE = "Category deleted successfully",
} 