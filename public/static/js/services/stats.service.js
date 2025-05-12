import apiService from './api.service.js';

class StatsService {
  async getDashboardStats() {
    return apiService.get('/api/stats/dashboard');
  }

  async getProfileStats() {
    return apiService.get('/api/stats/profile')
  }
}

const statsService = new StatsService();
export default statsService;