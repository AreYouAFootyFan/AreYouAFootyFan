class FootballService {
    constructor() {
        this.API_KEY = "53aaedf27c25807e38c5e99b22a319ab";
        this.BASE_URL = 'https://v3.football.api-sports.io';
    }

    setApiKey(apiKey) {
        this.API_KEY = apiKey;
    }

    async makeRequest(endpoint, signal) {
        if (!this.API_KEY) {
            throw new Error('API key not set. Please configure your API key first.');
        }

        const response = await fetch(`${this.BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': this.API_KEY
            },
            signal
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            data: data.response,
            pagination: data.paging
        };
    }

    async getLeagues(signal) {
        const response = await this.makeRequest('/leagues', signal);
        return {
            data: response.data.map(league => ({
                league_id: league.league.id,
                league_name: league.league.name,
                country_name: league.country.name,
                country_flag: league.country.flag,
                season: league.seasons[0].year
            }))
        };
    }

    async getLiveMatches(signal, leagueId) {
        const response = await this.makeRequest(`/fixtures?live=all${leagueId ? `&league=${leagueId}` : ''}`, signal);
        return {
            data: response.data.map(match => ({
                match_id: match.fixture.id,
                home_team: match.teams.home.name,
                away_team: match.teams.away.name,
                home_score: match.goals.home,
                away_score: match.goals.away,
                match_time: `${match.fixture.status.elapsed}'`,
                league_id: match.league.id,
                league_name: match.league.name,
                country: match.league.country
            }))
        };
    }
}

const footballService = new FootballService();
window.footballService = footballService;

export default footballService; 