import apiService from './api.service.js';

class AnswerService {
    async getAnswersByQuestionId(questionId) {
        return apiService.get(`/api/answers/question/${questionId}`);
    }

    async getAnswerById(id) {
        return apiService.get(`/api/answers/${id}`);
    }

    async createAnswer(data) {
        return apiService.post('/api/answers', data);
    }

    async updateAnswer(id, data) {
        return apiService.put(`/api/answers/${id}`, data);
    }

    async deleteAnswer(id) {
        return apiService.delete(`/api/answers/${id}`);
    }

    async markAsCorrect(id) {
        return apiService.put(`/api/answers/${id}/mark-correct`);
    }
}

const answerService = new AnswerService();
export default answerService;