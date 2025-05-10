import apiService from './api.service.js';

class LeaderboardService {
    
    async getLeaderboard() {
        return apiService.get('/api/leaderboard');
    }

    async getTopPlayers(limit = 5) {
        return apiService.get(`/api/leaderboard/top?limit=${limit}`);
    }

    async getUserRank() {
        return apiService.get('/api/leaderboard/my-rank');
    }
}

const leaderboardService = new LeaderboardService();
export default leaderboardService;