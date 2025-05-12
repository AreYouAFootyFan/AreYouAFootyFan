import { StyleLoader } from "../../utils/cssLoader.js";
import "../shared/StatsCard.js";

class ProfileStats extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.stats = {
            elo: 1450,
            quizzesCompleted: 27,
            avgScore: 82,
        };
        this.styleSheet = new CSSStyleSheet();
    }
    
    async connectedCallback() {
        await this.loadStyles();
        this.render();
    }
    
    async loadStyles() {
         await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/profile/stats.css'
        );
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const statsContainer = document.createElement('section');
        statsContainer.className = 'profile-stats';
        
        const eloCard = document.createElement('stats-card');
        // eloCard.className = 'stat-card';
        eloCard.setAttribute('value', this.stats.elo);
        eloCard.setAttribute('label', 'ELO');
        
        const quizzesCard = document.createElement('stats-card');
        // quizzesCard.className = 'stat-card';
        quizzesCard.setAttribute('value', this.stats.quizzesCompleted);
        quizzesCard.setAttribute('label', 'Quizzes completed');       
        
        const avgCard = document.createElement('stats-card');
        // avgCard.className = 'stat-card';
        avgCard.setAttribute('value', this.stats.avgScore + '%');
        avgCard.setAttribute('label', 'Average score');       

        statsContainer.appendChild(eloCard);
        statsContainer.appendChild(quizzesCard);
        statsContainer.appendChild(avgCard);
        
        this.shadowRoot.appendChild(statsContainer);
    }
    
    setStats(stats) {
        this.stats = stats;
        this.render();
    }
    
    setError(error) {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = `Error loading statistics: ${error.message || 'Unknown error'}`;
        
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(errorMessage);
    }
}

customElements.define('profile-stats', ProfileStats);

export default ProfileStats;