import apiService from './api.service.js';

class QuizService {
    async getAllQuizzes() {
        return apiService.get('/api/quizzes');
    }
    
    async getValidQuizzes() {
        return apiService.get('/api/quizzes?valid=true');
    }

    async getQuizzesByCategory(categoryId) {
        return apiService.get(`/api/quizzes?category=${categoryId}`);
    }

    async getQuizzesByCreator(creatorId) {
        return apiService.get(`/api/quizzes?creator=${creatorId}`);
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