import apiService from './api.service.js';

class QuizValidatorService {
  async validateQuiz(quizId) {
    return apiService.get(`/api/validator/quiz/${quizId}`);
  }

  async validateQuestion(questionId) {
    return apiService.get(`/api/validator/question/${questionId}`);
  }
}

const quizValidatorService = new QuizValidatorService();
export default quizValidatorService;