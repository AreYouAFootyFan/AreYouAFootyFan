import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ErrorUtils } from "../utils/error.utils";
import { UserService } from "../services/user.service";
import { Message, User } from "../utils/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

export const authenticate = async (
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ErrorUtils.unauthorized(Message.Error.Base.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    const userData = await AuthService.getUserFromToken(token);

    request.user = userData;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireUsername = (
  request: Request,
  _response: Response,
  next: NextFunction
): void => {
  if (!request.user) {
    return next(
      ErrorUtils.unauthorized(Message.Error.Base.USER_NOT_AUTHENTICATED)
    );
  }

  UserService.isUsernameSet(request.user.id)
    .then((hasUsername) => {
      if (!hasUsername) {
        next(ErrorUtils.forbidden(Message.Error.Permission.USERNAME_REQUIRED));
      } else {
        next();
      }
    })
    .catch(next);
};

export const requireRole = (role: User.Role) => {
  return (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.user) {
      return next(
        ErrorUtils.unauthorized(Message.Error.Base.USER_NOT_AUTHENTICATED)
      );
    }

    if (request.user.role !== role) {
      return next(ErrorUtils.forbidden(`Requires ${role} role`));
    }

    next();
  };
};
