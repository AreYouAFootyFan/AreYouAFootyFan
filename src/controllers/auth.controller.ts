import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ErrorUtils } from '../utils/error.utils';

export class AuthController {
  static async googleLogin(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const code = request.body.code as string;

      if (!code) {
        throw ErrorUtils.badRequest('Google code is required');
      }
      
      const authResult = await AuthService.loginWithGoogle(code);
      
      response.json(authResult);
    } catch (error) {
      next(error);
    }
  }

  static async checkUsernameStatus(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = request.user?.id;
      
      if (!userId) {
        throw ErrorUtils.unauthorized('User not authenticated');
      }
      
      const hasUsername = await UserService.isUsernameSet(userId);
      
      response.json({ requiresUsername: !hasUsername });
    } catch (error) {
      next(error);
    }
  }
}