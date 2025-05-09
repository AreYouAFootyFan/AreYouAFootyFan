/**
 * @deprecated This file is kept for backward compatibility.
 * Please import directly from src/utils/enums/index.ts instead.
 * 
 * Example usage:
 * ```
 * // New way:
 * import { Message, Http, User, Config } from '@utils/enums';
 * 
 * // Then use like:
 * Message.SuccessMessage.ANSWER_DELETE
 * Message.Error.BaseError.NOT_FOUND
 * Message.Error.LengthError.ANSWER_TOO_LONG
 * Http.HttpStatus.OK
 * User.Role.PLAYER
 * Config.Value.MAX_FILE_SIZE_MB
 * ```
 */

// Re-export everything from the modular enums directory
export * from './enums/index'; 