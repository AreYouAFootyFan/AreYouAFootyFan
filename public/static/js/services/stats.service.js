import apiService from './api.service.js';

class StatsService {
  async getDashboardStats() {
    return apiService.get('/api/stats/dashboard');
  }

  async getProfileStats() {
    return apiService.get('/api/stats/profile')
  }

  async getPlayedQuizzes() {
    return apiService.get('/api/stats/played')
  }
}

const statsService = new StatsService();
export default statsService;