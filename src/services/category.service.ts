import { CategoryModel, Category } from '../models/category.model';
import { CreateCategoryDto, UpdateCategoryDto } from '../DTOs/category.dto';
import { ErrorUtils } from '../utils/error.utils';

export class CategoryService {
  static async getAllCategories(): Promise<Category[]> {
    return CategoryModel.findAll();
  }


  static async getCategoryById(id: number): Promise<Category> {
    const category = await CategoryModel.findById(id);
    
    if (!category) {
      throw ErrorUtils.notFound('Category not found');
    }
    
    return category;
  }


  static async createCategory(data: CreateCategoryDto): Promise<Category> {
    const existingCategory = await CategoryModel.findByName(data.category_name);
    
    if (existingCategory) {
      throw ErrorUtils.conflict('A category with this name already exists');
    }
    
    return CategoryModel.create(data);
  }


  static async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    const existingCategory = await CategoryModel.findById(id);
    
    if (!existingCategory) {
      throw ErrorUtils.notFound('Category not found');
    }
    
    if (data.category_name && data.category_name !== existingCategory.category_name) {
      const categoryWithSameName = await CategoryModel.findByName(data.category_name);
      
      if (categoryWithSameName) {
        throw ErrorUtils.conflict('Another category with this name already exists');
      }
    }
    
    const updatedCategory = await CategoryModel.update(id, data);
    
    if (!updatedCategory) {
      throw ErrorUtils.internal('Failed to update category');
    }
    
    return updatedCategory;
  }

  static async deleteCategory(id: number): Promise<void> {
    const existingCategory = await CategoryModel.findById(id);
    
    if (!existingCategory) {
      throw ErrorUtils.notFound('Category not found');
    }
    
    const isUsed = await CategoryModel.isUsedByQuizzes(id);
    
    if (isUsed) {
      throw ErrorUtils.badRequest('Cannot delete category as it is used by existing quizzes');
    }
    
    const deleted = await CategoryModel.softDelete(id);
    
    if (!deleted) {
      throw ErrorUtils.internal('Failed to delete category');
    }
  }
}