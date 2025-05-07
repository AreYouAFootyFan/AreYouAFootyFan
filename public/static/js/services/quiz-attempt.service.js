import apiService from './api.service.js';

class QuizAttemptService {
    async getUserAttempts() {
        return apiService.get('/api/quiz-attempts/my-attempts');
    }

    async getAttemptById(id) {
        return apiService.get(`/api/quiz-attempts/${id}`);
    }

    async startQuiz(quizId) {
        return apiService.post('/api/quiz-attempts/start', { quiz_id: quizId });
    }

    async getNextQuestion(attemptId) {
        return apiService.get(`/api/quiz-attempts/${attemptId}/next-question`);
    }

    async completeQuiz(attemptId) {
        return apiService.put(`/api/quiz-attempts/${attemptId}/complete`);
    }

    async getAttemptSummary(attemptId) {
        return apiService.get(`/api/quiz-attempts/${attemptId}/summary`);
    }

    async submitResponse(data) {
        return apiService.post('/api/user-responses/submit', data);
    }

    async getAttemptResponses(attemptId) {
        return apiService.get(`/api/user-responses/attempt/${attemptId}`);
    }

    async getResponseById(id) {
        return apiService.get(`/api/user-responses/${id}`);
    }
}

const quizAttemptService = new QuizAttemptService();
export default quizAttemptService;