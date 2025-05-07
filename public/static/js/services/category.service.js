import apiService from './api.service.js';

class CategoryService {
    async getAllCategories() {
        return apiService.get('/api/categories');
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