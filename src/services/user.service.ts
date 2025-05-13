import { UserModel } from "../models/user.model";
import { CreateUserDto, UpdateUserDto } from "../DTOs/user.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";
import { User, UserWithRole } from "../types/user.types";

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    return UserModel.findAll();
  }

  static async getUserById(id: number): Promise<User> {
    const user = await UserModel.findById(id);

    if (!user) {
      throw ErrorUtils.notFound(Message.Error.Base.NOT_FOUND);
    }

    return user;
  }

  static async getUserWithRoleById(id: number): Promise<UserWithRole> {
    const user = await UserModel.getUserWithRole(id);

    if (!user) {
      throw ErrorUtils.notFound(Message.Error.Base.NOT_FOUND);
    }

    return user;
  }

  static async getUserByGoogleId(googleId: string): Promise<User | null> {
    return UserModel.findByGoogleId(googleId);
  }

  static async createUser(data: CreateUserDto): Promise<User> {
    const existingUser = await UserModel.findByGoogleId(data.google_id);

    if (existingUser) {
      throw ErrorUtils.conflict(Message.Error.User.GOOGLE_ID_EXISTS);
    }

    if (data.username) {
      const usernameExists = await UserModel.findByUsername(data.username);
      if (usernameExists) {
        throw ErrorUtils.conflict(Message.Error.User.USERNAME_TAKEN);
      }
    }

    return UserModel.create(data);
  }

  static async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const existingUser = await UserModel.findById(id);

    if (!existingUser) {
      throw ErrorUtils.notFound(Message.Error.Base.NOT_FOUND);
    }

    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await UserModel.findByUsername(data.username);
      if (usernameExists) {
        throw ErrorUtils.conflict(Message.Error.User.USERNAME_TAKEN);
      }
    }

    const updatedUser = await UserModel.update(id, data);

    if (!updatedUser) {
      throw ErrorUtils.internal(Message.Error.User.UPDATE_FAILED);
    }

    return updatedUser;
  }

  static async deactivateUser(id: number): Promise<void> {
    const existingUser = await UserModel.findById(id);

    if (!existingUser) {
      throw ErrorUtils.notFound(Message.Error.Base.NOT_FOUND);
    }

    const deactivated = await UserModel.deactivate(id);

    if (!deactivated) {
      throw ErrorUtils.internal(Message.Error.User.DEACTIVATE_FAILED);
    }
  }

  static async findOrCreateUser(googleId: string): Promise<User> {
    const existingUser = await UserModel.findByGoogleId(googleId);

    if (existingUser) {
      return existingUser;
    }

    return UserModel.create({ google_id: googleId });
  }

  static async isUsernameSet(userId: number): Promise<boolean> {
    const user = await UserModel.findById(userId);
    return !!user?.username;
  }
}