import apiService from './api.service.js';

class DifficultyService {
    async getAllDifficultyLevels() {
        return apiService.get('/api/difficulty-levels');
    }

    async getDifficultyLevelById(id) {
        return apiService.get(`/api/difficulty-levels/${id}`);
    }

    async createDifficultyLevel(data) {
        return apiService.post('/api/difficulty-levels', data);
    }

    async updateDifficultyLevel(id, data) {
        return apiService.put(`/api/difficulty-levels/${id}`, data);
    }

    async deleteDifficultyLevel(id) {
        return apiService.delete(`/api/difficulty-levels/${id}`);
    }
}

const difficultyService = new DifficultyService();
export default difficultyService;