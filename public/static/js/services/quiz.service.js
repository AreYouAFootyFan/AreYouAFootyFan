import apiService from './api.service.js';

class QuizService {
    async getQuizzes(options = {}) {
        const { page = 1, limit = 10, categoryId, valid } = options;
        return apiService.post('/api/quizzes/list', { 
            page, 
            limit,
            ...categoryId && { categoryId },
            ...valid && { valid }
        });
    }

    async getValidQuizzes(page = 1, limit = 10) {
        return this.getQuizzes({ page, limit, valid: true });
    }

    async getQuizzesByCategory(categoryId, page = 1, limit = 10) {
        return this.getQuizzes({ page, limit, categoryId });
    }

    async getValidQuizzesByCategory(categoryId, page = 1, limit = 10) {
        return this.getQuizzes({ page, limit, categoryId, valid: true });
    }

    async getQuizById(id) {
        return apiService.get(`/api/quizzes/${id}`);
    }

    async createQuiz(data) {
        return apiService.post('/api/quizzes', data);
    }

    async updateQuiz(id, data) {
        return apiService.put(`/api/quizzes/${id}`, data);
    }

    async deleteQuiz(id) {
        return apiService.delete(`/api/quizzes/${id}`);
    }

    async checkQuizStatus(id) {
        return apiService.get(`/api/quizzes/${id}/status`);
    }
}

const quizService = new QuizService();
export default quizService;