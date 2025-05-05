import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';
import { ErrorUtils } from '../utils/error.utils';

export class CategoryController {
  
  static async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  
  static async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid category ID');
      }
      
      const category = await CategoryService.getCategoryById(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  
  static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category_name, category_description } = req.body as CreateCategoryDto;
      
      if (!category_name) {
        throw ErrorUtils.badRequest('Category name is required');
      }
      
      if (category_name.length > 32) {
        throw ErrorUtils.badRequest('Category name cannot exceed 32 characters');
      }
      
      if (category_description && category_description.length > 64) {
        throw ErrorUtils.badRequest('Category description cannot exceed 64 characters');
      }
      
      const category = await CategoryService.createCategory({ category_name, category_description });
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  
  static async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid category ID');
      }
      
      const { category_name, category_description } = req.body as UpdateCategoryDto;
      
      if (category_name === undefined && category_description === undefined) {
        throw ErrorUtils.badRequest('At least one field to update is required');
      }
      
      if (category_name && category_name.length > 32) {
        throw ErrorUtils.badRequest('Category name cannot exceed 32 characters');
      }
      
      if (category_description && category_description.length > 64) {
        throw ErrorUtils.badRequest('Category description cannot exceed 64 characters');
      }
      
      const category = await CategoryService.updateCategory(id, { category_name, category_description });
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  
  static async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid category ID');
      }
      
      await CategoryService.deleteCategory(id);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}