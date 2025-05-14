import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "../DTOs/category.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Message, Http, Length } from "../utils/enums";

export class CategoryController {
  static async getAllCategories(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = 1, limit = 10 } = request.body;

      // Validate pagination parameters
      if (!Number.isInteger(Number(page)) || Number(page) < 1) {
        throw ErrorUtils.badRequest("Page number must be a positive integer");
      }
      if (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100) {
        throw ErrorUtils.badRequest("Limit must be between 1 and 100");
      }

      const categories = await CategoryService.getAllCategories({
        page: Number(page),
        limit: Number(limit)
      });
      
      response.json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Category.INVALID);
      }

      const category = await CategoryService.getCategoryById(id);
      response.json(category);
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { category_name, category_description } =
        request.body as CreateCategoryDto;

      if (!category_name) {
        throw ErrorUtils.badRequest(Message.Error.Category.NAME_REQUIRED);
      }

      if (category_name.length < Length.Min.CATEGORY_NAME) {
        throw ErrorUtils.badRequest(Message.Error.Category.NAME_TOO_SHORT);
      }

      if (category_name.length > Length.Max.CATEGORY_NAME) {
        throw ErrorUtils.badRequest(Message.Error.Category.NAME_TOO_LONG);
      }

      if (
        category_description &&
        category_description.length < Length.Min.CATEGORY_DESCRIPTION
      ) {
        throw ErrorUtils.badRequest(
          Message.Error.Category.DESCRIPTION_TOO_SHORT
        );
      }

      if (
        category_description &&
        category_description.length > Length.Max.CATEGORY_DESCRIPTION
      ) {
        throw ErrorUtils.badRequest(
          Message.Error.Category.DESCRIPTION_TOO_LONG
        );
      }

      const category = await CategoryService.createCategory({
        category_name,
        category_description,
      });
      response.status(Http.Status.CREATED).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Category.INVALID);
      }

      const { category_name, category_description } =
        request.body as UpdateCategoryDto;

      if (category_name === undefined && category_description === undefined) {
        throw ErrorUtils.badRequest(
          Message.Error.Permission.NO_FIELD_TO_UPDATE
        );
      }

      if (category_name) {
        if (category_name.length < Length.Min.CATEGORY_NAME) {
          throw ErrorUtils.badRequest(Message.Error.Category.NAME_TOO_SHORT);
        }

        if (category_name.length > Length.Max.CATEGORY_NAME) {
          throw ErrorUtils.badRequest(Message.Error.Category.NAME_TOO_LONG);
        }
      }

      if (category_description) {
        if (category_description.length < Length.Min.CATEGORY_DESCRIPTION) {
          throw ErrorUtils.badRequest(
            Message.Error.Category.DESCRIPTION_TOO_SHORT
          );
        }

        if (category_description.length > Length.Max.CATEGORY_DESCRIPTION) {
          throw ErrorUtils.badRequest(
            Message.Error.Category.DESCRIPTION_TOO_LONG
          );
        }
      }

      const category = await CategoryService.updateCategory(id, {
        category_name,
        category_description,
      });
      response.json(category);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Category.INVALID);
      }

      await CategoryService.deleteCategory(id);
      response.json({ message: Message.Success.Category.DELETE });
    } catch (error) {
      next(error);
    }
  }
}
