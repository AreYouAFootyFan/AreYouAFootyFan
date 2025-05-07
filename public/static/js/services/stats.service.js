import apiService from './api.service.js';

class StatsService {
  async getDashboardStats() {
    return apiService.get('/api/stats/dashboard');
  }
}

const statsService = new StatsService();
export default statsService;