import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";
import "../shared/StatsCard.js";

class ProfileStats extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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
        clearDOM(this.shadowRoot);
        
        const statsContainer = document.createElement('section');
        const stats = JSON.parse(this.getAttribute('statistics'));
        statsContainer.className = 'profile-stats';
        
        const eloCard = document.createElement('stats-card');
        if(stats.role === 'Player'){
            eloCard.setAttribute('value', stats.elo);
            eloCard.setAttribute('label', 'ELO');
        }else{
            eloCard.setAttribute('value', stats.quizzesCreated);
            eloCard.setAttribute('label', 'Quizzes Created');
        }

        const rankCard = document.createElement('stats-card');
        rankCard.setAttribute('value', stats.rank);
        rankCard.setAttribute('label', 'Current Rank');   
        
        const quizzesCard = document.createElement('stats-card');
        if(stats.role === 'Player'){
            quizzesCard.setAttribute('value', stats.quizzesCompleted);
            quizzesCard.setAttribute('label', 'Quizzes completed');            
        }else{
            quizzesCard.setAttribute('value', stats.quizAttempts);
            quizzesCard.setAttribute('label', 'Player quiz attempts');
        }
        
        const avgCard = document.createElement('stats-card');
        avgCard.setAttribute('value', stats.avgScore + '%');
        if(stats.role === 'Player'){
            avgCard.setAttribute('label', 'Average accuracy');                
        }else{
            avgCard.setAttribute('label', 'Player average accuracy');    
        }
  
 
        statsContainer.appendChild(eloCard);
        
        if(stats.role === 'Player'){
            statsContainer.appendChild(rankCard);
        }
        
        statsContainer.appendChild(quizzesCard);
        statsContainer.appendChild(avgCard);
        
        this.shadowRoot.appendChild(statsContainer);
    }
    
    setStats(stats) {
        this.stats = stats;
        this.render();
    }
    
    setError(error) {
        clearDOM(this.shadowRoot);
        
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = `Error loading statistics: ${error.message || 'Unknown error'}`;
        
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(errorMessage);
    }
}

customElements.define('profile-stats', ProfileStats);

export default ProfileStats;