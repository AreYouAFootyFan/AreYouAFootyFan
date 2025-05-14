import apiService from './api.service.js';

class CategoryService {
    async getAllCategories(page = 1, limit = 4) {
        return apiService.get(`/api/categories/list?page=${page}&limit=${limit}`);
    }

    async getCategoryById(id) {
        return apiService.get(`/api/categories/${id}`);
    }

    async createCategory(data) {
        return apiService.post('/api/categories', data);
    }

    async updateCategory(id, data) {
        return apiService.put(`/api/categories/${id}`, data);
    }

    async deleteCategory(id) {
        return apiService.delete(`/api/categories/${id}`);
    }
}

const categoryService = new CategoryService();
export default categoryService;