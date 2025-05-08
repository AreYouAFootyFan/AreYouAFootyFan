import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "../DTOs/category.dto";
import { ErrorUtils } from "../utils/error.utils";

export class CategoryController {
  static async getAllCategories(
    _request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
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
        throw ErrorUtils.badRequest("Invalid category ID");
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
        throw ErrorUtils.badRequest("Category name is required");
      }

      if (category_name.length > 32) {
        throw ErrorUtils.badRequest(
          "Category name cannot exceed 32 characters"
        );
      }

      if (category_description && category_description.length > 64) {
        throw ErrorUtils.badRequest(
          "Category description cannot exceed 64 characters"
        );
      }

      const category = await CategoryService.createCategory({
        category_name,
        category_description,
      });
      response.status(201).json(category);
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
        throw ErrorUtils.badRequest("Invalid category ID");
      }

      const { category_name, category_description } =
        request.body as UpdateCategoryDto;

      if (category_name === undefined && category_description === undefined) {
        throw ErrorUtils.badRequest("At least one field to update is required");
      }

      if (category_name && category_name.length > 32) {
        throw ErrorUtils.badRequest(
          "Category name cannot exceed 32 characters"
        );
      }

      if (category_description && category_description.length > 64) {
        throw ErrorUtils.badRequest(
          "Category description cannot exceed 64 characters"
        );
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
        throw ErrorUtils.badRequest("Invalid category ID");
      }

      await CategoryService.deleteCategory(id);
      response.json({ message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
