import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

export class AuthController {
  static async googleLogin(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const code = request.body.code as string;

      if (!code) {
        throw ErrorUtils.badRequest(Message.Error.Auth.GOOGLE_CODE_REQUIRED);
      }

      const authResult = await AuthService.loginWithGoogle(code);

      response.json(authResult);
    } catch (error) {
      next(error);
    }
  }

  static async checkUsernameStatus(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.user?.id;

      if (!userId) {
        throw ErrorUtils.unauthorized(
          Message.Error.Base.USER_NOT_AUTHENTICATED
        );
      }

      const hasUsername = await UserService.isUsernameSet(userId);

      response.json({ requiresUsername: !hasUsername });
    } catch (error) {
      next(error);
    }
  }
}
