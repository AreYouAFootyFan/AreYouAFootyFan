import apiService from './api.service.js';

class QuestionService {
    async getQuestionsByQuizId(quizId) {
        return apiService.get(`/api/questions/quiz/${quizId}`);
    }

    async getQuestionById(id) {
        return apiService.get(`/api/questions/${id}`);
    }

    async validateQuestion(id) {
        return apiService.get(`/api/questions/${id}/validate`);
    }

    async createQuestion(data) {
        return apiService.post('/api/questions', data);
    }

    async updateQuestion(id, data) {
        return apiService.put(`/api/questions/${id}`, data);
    }

    async deleteQuestion(id) {
        return apiService.delete(`/api/questions/${id}`);
    }
}

const questionService = new QuestionService();
export default questionService;