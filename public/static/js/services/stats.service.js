import apiService from './api.service.js';

class StatsService {
  async getDashboardStats() {
    return apiService.get('/api/stats/dashboard');
  }

  async getProfileStats() {
    return apiService.get('/api/stats/profile')
  }

  async getPlayedQuizzes(page = 1, limit = 6) {
    return apiService.get(`/api/stats/played?page=${page}&limit=${limit}`);
  }
}

const statsService = new StatsService();
export default statsService;