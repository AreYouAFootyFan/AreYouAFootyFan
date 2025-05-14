import { StyleLoader } from "../../utils/cssLoader.js";

class LiveScores extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.leagues = [];
        this.selectedLeague = null;
        this.allMatches = [];
        this.filteredMatches = [];
        this.isLoading = true;
        this.error = null;
        this.isCollapsed = false;
        
        this.styleSheet = new CSSStyleSheet();

        // Bind methods
        this.handleLeagueChange = this.handleLeagueChange.bind(this);
        this.loadAllMatches = this.loadAllMatches.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }
    
    async connectedCallback() {
        await this.loadStyles();
        await this.loadAllMatches();
        this.setupPolling();
    }
    
    disconnectedCallback() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }
    
    async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/widgets/liveScores.css'
        );
    }
    
    handleLeagueChange(event) {
        const leagueId = event.target.value;
        this.selectedLeague = leagueId === '' ? null : leagueId;
        
        // Reset to all matches if 'All Leagues' is selected
        if (this.selectedLeague === null) {
            this.filteredMatches = [...this.allMatches];
        } else {
            // Filter matches for selected league
            this.filteredMatches = this.allMatches.filter(match => 
                match.league_id.toString() === this.selectedLeague
            );
        }
        
        this.render();
    }
    
    async loadAllMatches() {
        try {
            if (!window.footballService) {
                throw new Error('Football service not available');
            }
            
            this.isLoading = true;
            this.render();
            
            // Load all live matches first
            const response = await window.footballService.getLiveMatches();
            this.allMatches = response.data;
            
            // Extract unique leagues from matches and create unique identifiers
            const uniqueLeagues = new Map();
            this.allMatches.forEach(match => {
                const leagueKey = `${match.league_id}`;
                if (!uniqueLeagues.has(leagueKey)) {
                    // Create a display name that includes country
                    const displayName = match.country 
                        ? `${match.league_name} (${match.country})`
                        : match.league_name;
                    
                    uniqueLeagues.set(leagueKey, {
                        league_id: match.league_id,
                        league_name: match.league_name,
                        display_name: displayName,
                        country: match.country
                    });
                }
            });
            
            this.leagues = Array.from(uniqueLeagues.values());
            
            // Sort leagues by country then by name
            this.leagues.sort((a, b) => {
                // First sort by country
                const countryCompare = (a.country || '').localeCompare(b.country || '');
                if (countryCompare !== 0) return countryCompare;
                // Then by league name
                return a.league_name.localeCompare(b.league_name);
            });
            
            // Reset filtered matches to show all matches
            this.filteredMatches = [...this.allMatches];
            
        } catch (error) {
            this.error = 'Failed to load matches. Please try again later.';
        } finally {
            this.isLoading = false;
            this.render();
        }
    }
    
    setupPolling() {
        // Poll for updates every 60 seconds
        this.pollInterval = setInterval(this.loadAllMatches.bind(this), 60000);
    }
    
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.render();
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const container = document.createElement('aside');
        container.className = `live-scores-widget ${this.isCollapsed ? 'collapsed' : ''}`;
        
        const header = document.createElement('header');
        header.className = 'widget-header';
        
        const titleSection = document.createElement('section');
        titleSection.className = 'title-section';
        
        const title = document.createElement('h2');
        title.textContent = 'Live Scores';
        
        const collapseBtn = document.createElement('button');
        collapseBtn.className = 'collapse-btn';
        collapseBtn.innerHTML = this.isCollapsed ? '▼' : '▲';
        collapseBtn.addEventListener('click', this.toggleCollapse);
        
        titleSection.appendChild(title);
        titleSection.appendChild(collapseBtn);
        header.appendChild(titleSection);
        
        // Only show league selector if there are multiple leagues and widget is not collapsed
        if (!this.isCollapsed && this.leagues.length > 1) {
            const leagueSelect = document.createElement('select');
            leagueSelect.className = 'league-select';
            leagueSelect.addEventListener('change', this.handleLeagueChange);
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'All Leagues';
            defaultOption.selected = this.selectedLeague === null;
            leagueSelect.appendChild(defaultOption);
            
            this.leagues.forEach(league => {
                const option = document.createElement('option');
                option.value = league.league_id;
                option.textContent = league.display_name;
                option.selected = this.selectedLeague === league.league_id.toString();
                leagueSelect.appendChild(option);
            });
            
            header.appendChild(leagueSelect);
        }
        
        container.appendChild(header);
        
        // Content area - only show if not collapsed
        if (!this.isCollapsed) {
            const content = document.createElement('main');
            content.className = 'widget-content';
            
            if (this.isLoading) {
                const loading = document.createElement('p');
                loading.className = 'loading-text';
                loading.textContent = 'Loading live matches...';
                content.appendChild(loading);
            } else if (this.error) {
                const error = document.createElement('p');
                error.className = 'error-text';
                error.textContent = this.error;
                content.appendChild(error);
            } else if (this.filteredMatches.length === 0) {
                const noMatches = document.createElement('p');
                noMatches.className = 'no-matches-text';
                noMatches.textContent = 'No live matches at the moment';
                content.appendChild(noMatches);
            } else {
                const matchesList = document.createElement('ul');
                matchesList.className = 'matches-list';
                
                // Group matches by league
                const matchesByLeague = this.filteredMatches.reduce((acc, match) => {
                    if (!acc[match.league_name]) {
                        acc[match.league_name] = [];
                    }
                    acc[match.league_name].push(match);
                    return acc;
                }, {});
                
                // Create sections for each league
                Object.entries(matchesByLeague).forEach(([leagueName, matches]) => {
                    const leagueSection = document.createElement('section');
                    leagueSection.className = 'league-section';
                    
                    // Only show league name if showing all leagues
                    if (!this.selectedLeague) {
                        const leagueHeader = document.createElement('h3');
                        leagueHeader.className = 'league-header';
                        const leagueInfo = this.leagues.find(league => league.league_name === leagueName);
                        leagueHeader.textContent = leagueInfo ? leagueInfo.display_name : leagueName;
                        leagueSection.appendChild(leagueHeader);
                    }
                    
                    matches.forEach(match => {
                        const matchItem = document.createElement('li');
                        matchItem.className = 'match-item';
                        
                        const teams = document.createElement('article');
                        teams.className = 'teams';
                        
                        const homeTeamSection = document.createElement('section');
                        homeTeamSection.className = 'team-section home';
                        
                        const homeTeam = document.createElement('strong');
                        homeTeam.className = 'team-name';
                        homeTeam.textContent = match.home_team;
                        homeTeamSection.appendChild(homeTeam);
                        
                        const score = document.createElement('output');
                        score.className = 'score';
                        score.textContent = `${match.home_score} - ${match.away_score}`;
                        
                        const awayTeamSection = document.createElement('section');
                        awayTeamSection.className = 'team-section away';
                        
                        const awayTeam = document.createElement('strong');
                        awayTeam.className = 'team-name';
                        awayTeam.textContent = match.away_team;
                        awayTeamSection.appendChild(awayTeam);
                        
                        const matchTime = document.createElement('time');
                        matchTime.className = 'match-time';
                        matchTime.textContent = match.match_time;
                        
                        teams.appendChild(homeTeamSection);
                        teams.appendChild(score);
                        teams.appendChild(awayTeamSection);
                        
                        matchItem.appendChild(teams);
                        matchItem.appendChild(matchTime);
                        
                        leagueSection.appendChild(matchItem);
                    });
                    
                    matchesList.appendChild(leagueSection);
                });
                
                content.appendChild(matchesList);
            }
            
            container.appendChild(content);
        }
        
        this.shadowRoot.appendChild(container);
    }
}

customElements.define('live-scores', LiveScores);

export default LiveScores; 