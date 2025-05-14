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
        this.isVisible = sessionStorage.getItem('liveScoresVisible') === null ? true : sessionStorage.getItem('liveScoresVisible') !== 'false';
        this.abortController = null;
        
        this.styleSheet = new CSSStyleSheet();

        // Bind methods
        this.handleLeagueChange = this.handleLeagueChange.bind(this);
        this.loadAllMatches = this.loadAllMatches.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }
    
    async connectedCallback() {
        await this.loadStyles();
        // Set initial visibility in sessionStorage if not set
        if (sessionStorage.getItem('liveScoresVisible') === null) {
            sessionStorage.setItem('liveScoresVisible', 'true');
        }
        console.log('LiveScores visibility:', this.isVisible);
        console.log('LiveScores sessionStorage:', sessionStorage.getItem('liveScoresVisible'));
        
        if (this.isVisible) {
            await this.loadAllMatches();
            this.setupPolling();
        }
        this.render();
    }
    
    disconnectedCallback() {
        this.cleanup();
    }
    
    cleanup() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }
    
    async loadStyles() {
        try {
            await StyleLoader(
                this.shadowRoot,
                './static/css/styles.css',
                './static/css/widgets/liveScores.css'
            );
            console.log('LiveScores styles loaded successfully');
        } catch (error) {
            console.error('Error loading LiveScores styles:', error);
        }
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
            
            // Cancel any existing request
            if (this.abortController) {
                this.abortController.abort();
            }
            
            // Create new abort controller for this request
            this.abortController = new AbortController();
            
            this.isLoading = true;
            this.render();
            
            // Load all live matches first
            const response = await window.footballService.getLiveMatches(this.abortController.signal);
            
            // If widget was hidden during the request, don't update state
            if (!this.isVisible) {
                return;
            }
            
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
        console.log('Toggling collapse from:', this.isCollapsed);
        this.isCollapsed = !this.isCollapsed;
        const container = this.shadowRoot.querySelector('.live-scores-widget');
        const collapseBtn = this.shadowRoot.querySelector('.collapse-btn');
        
        if (container) {
            if (this.isCollapsed) {
                container.classList.add('collapsed');
            } else {
                container.classList.remove('collapsed');
            }
        }
        
        if (collapseBtn) {
            collapseBtn.style.transform = this.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
        }
        console.log('Collapse toggled to:', this.isCollapsed);
    }

    toggleVisibility() {
        console.log('Toggling visibility from:', this.isVisible);
        this.isVisible = !this.isVisible;
        sessionStorage.setItem('liveScoresVisible', this.isVisible);
        console.log('Visibility toggled to:', this.isVisible);
        console.log('sessionStorage updated to:', sessionStorage.getItem('liveScoresVisible'));
        
        if (this.isVisible) {
            this.loadAllMatches();
            this.setupPolling();
        } else {
            this.cleanup();
            this.allMatches = [];
            this.filteredMatches = [];
            this.leagues = [];
            this.error = null;
        }
        
        this.render();
    }
    
    render() {
        console.log('LiveScores rendering, isVisible:', this.isVisible);
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }

        if (!this.isVisible) {
            const showButton = document.createElement('button');
            showButton.className = 'show-scores-btn';
            showButton.textContent = 'Show Live Scores';
            showButton.addEventListener('click', this.toggleVisibility);
            showButton.setAttribute('aria-label', 'Show live football scores');
            this.shadowRoot.appendChild(showButton);
            console.log('Show button rendered');
            return;
        }
        
        const container = document.createElement('aside');
        container.className = `live-scores-widget ${this.isCollapsed ? 'collapsed' : ''}`;
        
        const header = document.createElement('header');
        header.className = 'widget-header';
        
        const titleSection = document.createElement('section');
        titleSection.className = 'title-section';
        
        const title = document.createElement('h2');
        title.textContent = 'Live Scores';
        
        const buttonGroup = document.createElement('section');
        buttonGroup.className = 'button-group';
        
        const collapseBtn = document.createElement('button');
        collapseBtn.className = 'collapse-btn';
        collapseBtn.innerHTML = '↑';
        collapseBtn.style.transform = this.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
        collapseBtn.title = this.isCollapsed ? 'Expand' : 'Collapse';
        collapseBtn.setAttribute('aria-label', this.isCollapsed ? 'Expand live scores' : 'Collapse live scores');
        collapseBtn.addEventListener('click', this.toggleCollapse);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&#215;';
        closeBtn.title = 'Close Live Scores';
        closeBtn.addEventListener('click', this.toggleVisibility);
        
        buttonGroup.appendChild(collapseBtn);
        buttonGroup.appendChild(closeBtn);
        
        titleSection.appendChild(title);
        titleSection.appendChild(buttonGroup);
        header.appendChild(titleSection);
        
        container.appendChild(header);

        // Wrap all non-header content in a container
        const nonHeaderContent = document.createElement('div');
        nonHeaderContent.className = 'non-header-content';
        
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
            
            nonHeaderContent.appendChild(leagueSelect);
        }
        
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
            
            nonHeaderContent.appendChild(content);
        }
        
        container.appendChild(nonHeaderContent);
        
        this.shadowRoot.appendChild(container);
    }
}

customElements.define('live-scores', LiveScores);

export default LiveScores; 