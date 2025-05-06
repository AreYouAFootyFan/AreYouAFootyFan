import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../DTOs/user.dto';
import { ErrorUtils } from '../utils/error.utils';

export class UserController {
    static async getCurrentUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
          const userId = request.user?.id;
          
          if (!userId) {
            throw ErrorUtils.unauthorized('User not authenticated');
          }
          
          const user = await UserService.getUserWithRoleById(userId);
          response.json(user); 
        } catch (error) {
          next(error);
        }
      }

  static async setUsername(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = request.user?.id;
      
      if (!userId) {
        throw ErrorUtils.unauthorized('User not authenticated');
      }
      
      const { username } = request.body;
      
      if (!username || typeof username !== 'string') {
        throw ErrorUtils.badRequest('Username is required');
      }
      
      if (username.length < 3 || username.length > 32) {
        throw ErrorUtils.badRequest('Username must be between 3 and 32 characters');
      }
      
      const user = await UserService.updateUser(userId, { username });
      response.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid user ID');
      }
      
      const user = await UserService.getUserWithRoleById(id);
      response.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid user ID');
      }
      
      const { username, role_id } = request.body as UpdateUserDto;
      
      if (username === undefined && role_id === undefined) {
        throw ErrorUtils.badRequest('At least one field to update is required');
      }
      
      const data: UpdateUserDto = {};
      
      if (username !== undefined) {
        if (typeof username !== 'string' || username.length < 3 || username.length > 32) {
          throw ErrorUtils.badRequest('Username must be between 3 and 32 characters');
        }
        data.username = username;
      }
      
      if (role_id !== undefined) {
        if (isNaN(parseInt(role_id.toString()))) {
          throw ErrorUtils.badRequest('Invalid role ID');
        }
        data.role_id = parseInt(role_id.toString());
      }
      
      const user = await UserService.updateUser(id, data);
      response.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async deactivateUser(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid user ID');
      }
      
      await UserService.deactivateUser(id);
      response.json({ message: 'User deactivated successfully' });
    } catch (error) {
      next(error);
    }
  }
}