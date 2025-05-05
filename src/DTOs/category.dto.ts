export interface CreateCategoryDto {
  category_name: string;
  category_description?: string;
}

export interface UpdateCategoryDto {
  category_name?: string;
  category_description?: string;
} 