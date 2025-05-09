import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { UpdateUserDto } from "../DTOs/user.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Message, Length } from "../utils/enums";

export class UserController {
  static async getCurrentUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.user?.id;

      if (!userId) {
        throw ErrorUtils.unauthorized(Message.Error.BaseError.USER_NOT_AUTHENTICATED);
      }

      const user = await UserService.getUserWithRoleById(userId);
      response.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async setUsername(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.user?.id;

      if (!userId) {
        throw ErrorUtils.unauthorized(Message.Error.BaseError.USER_NOT_AUTHENTICATED);
      }

      const { username } = request.body;

      if (!username || typeof username !== "string") {
        throw ErrorUtils.badRequest(Message.Error.UserError.USERNAME_REQUIRED);
      }

      if (username.length < Length.Min.USERNAME || username.length > Length.Max.USERNAME) {
        throw ErrorUtils.badRequest(
          Message.Error.UserError.USERNAME_LENGTH
        );
      }

      const user = await UserService.updateUser(userId, { username });
      response.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.UserError.INVALID_ID);
      }

      const user = await UserService.getUserWithRoleById(id);
      response.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.UserError.INVALID_ID);
      }

      const { username, role_id } = request.body as UpdateUserDto;

      if (username === undefined && role_id === undefined) {
        throw ErrorUtils.badRequest(Message.Error.PermissionError.NO_FIELD_TO_UPDATE);
      }

      const data: UpdateUserDto = {};

      if (username !== undefined) {
        if (
          typeof username !== "string" ||
          username.length < Length.Min.USERNAME ||
          username.length > Length.Max.USERNAME
        ) {
          throw ErrorUtils.badRequest(
            Message.Error.UserError.USERNAME_LENGTH
          );
        }
        data.username = username;
      }

      if (role_id !== undefined) {
        if (isNaN(parseInt(role_id.toString()))) {
          throw ErrorUtils.badRequest(Message.Error.UserError.INVALID_ROLE_ID);
        }
        data.role_id = parseInt(role_id.toString());
      }

      const user = await UserService.updateUser(id, data);
      response.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async deactivateUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.UserError.INVALID_ID);
      }

      await UserService.deactivateUser(id);
      response.json({ message: Message.Success.UserSuccess.DEACTIVATE });
    } catch (error) {
      next(error);
    }
  }
}
