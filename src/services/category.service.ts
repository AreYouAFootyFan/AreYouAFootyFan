import { CategoryModel, Category } from "../models/category.model";
import { CreateCategoryDto, UpdateCategoryDto } from "../DTOs/category.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

export class CategoryService {
  static async getAllCategories(): Promise<Category[]> {
    return CategoryModel.findAll();
  }

  static async getCategoryById(id: number): Promise<Category> {
    const category = await CategoryModel.findById(id);

    if (!category) {
      throw ErrorUtils.notFound(Message.Error.Category.NOT_FOUND);
    }

    return category;
  }

  static async createCategory(data: CreateCategoryDto): Promise<Category> {
    const existingCategory = await CategoryModel.findByName(data.category_name);

    if (existingCategory) {
      throw ErrorUtils.conflict(Message.Error.Category.NAME_EXISTS);
    }

    return CategoryModel.create(data);
  }

  static async updateCategory(
    id: number,
    data: UpdateCategoryDto
  ): Promise<Category> {
    const existingCategory = await CategoryModel.findById(id);

    if (!existingCategory) {
      throw ErrorUtils.notFound(Message.Error.Category.NOT_FOUND);
    }

    if (
      data.category_name &&
      data.category_name !== existingCategory.category_name
    ) {
      const categoryWithSameName = await CategoryModel.findByName(
        data.category_name
      );

      if (categoryWithSameName) {
        throw ErrorUtils.conflict(Message.Error.Category.NAME_EXISTS_OTHER);
      }
    }

    const updatedCategory = await CategoryModel.update(id, data);

    if (!updatedCategory) {
      throw ErrorUtils.internal(Message.Error.Category.UPDATE_FAILED);
    }

    return updatedCategory;
  }

  static async deleteCategory(id: number): Promise<void> {
    const existingCategory = await CategoryModel.findById(id);

    if (!existingCategory) {
      throw ErrorUtils.notFound(Message.Error.Category.NOT_FOUND);
    }

    const deleted = await CategoryModel.softDelete(id);

    if (!deleted) {
      throw ErrorUtils.internal(Message.Error.Category.DELETE_FAILED);
    }
  }
}
