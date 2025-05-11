import { StyleLoader } from "../../utils/cssLoader.js";
class QuizResults extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._summary = null;
        this.styleSheet = new CSSStyleSheet();
    }
    
    async connectedCallback() {
        await this.loadStyles();
        this.render();
        this.setupEventListeners();
    }
    
    set summary(value) {
        this._summary = value;
        this.render();
    }
    
    get summary() {
        return this._summary;
    }

    async loadStyles() {        
        await StyleLoader(
            this.shadowRoot,
            '/static/css/styles.css',
            '/static/css/shared/components.css',
            '/static/css/quizTaking/quizResults.css'
        );
    }
    
    render() {
        if (!this._summary) {
            const loadingSection = document.createElement('section');
            loadingSection.classList.add('loading');
            
            const loadingSpinner = document.createElement('span');
            loadingSpinner.classList.add('loading-spinner');
            
            const loadingText = document.createElement('p');
            loadingText.textContent = 'Loading quiz results...';
            
            loadingSection.appendChild(loadingSpinner);
            loadingSection.appendChild(loadingText);
            
            this.shadowRoot.innerHTML = '';
            this.shadowRoot.appendChild(loadingSection);
            return;
        }
        
        const answeredPercent = Math.round((this._summary.answered_questions / this._summary.total_questions) * 100);
        const accuracyPercent = this._summary.answered_questions > 0 
            ? Math.round((this._summary.correct_answers / this._summary.answered_questions) * 100) 
            : 0;
        
        const style = document.createElement('style');
        const article = document.createElement('article');
        article.classList.add('card');
        
        const heading = document.createElement('h2');
        heading.textContent = 'Quiz Complete!';
        
        // Create percentage container
        const percentageContainer = document.createElement('div');
        percentageContainer.classList.add('percentage-container');
        
        const percentage = document.createElement('p');
        percentage.classList.add('percentage');
        percentage.textContent = `${accuracyPercent}%`;
        
        const finalScore = document.createElement('p');
        finalScore.classList.add('final-score');
        finalScore.innerHTML = `Your score: <strong>${this._summary.total_points}</strong> points`;
        
        percentageContainer.appendChild(percentage);
        percentageContainer.appendChild(finalScore);

        
        const statsSummary = document.createElement('section');
        statsSummary.classList.add('stats-summary');
        
        // First stat item - Questions completed
        const questionsItem = document.createElement('div');
        questionsItem.classList.add('stat-item');
        
        const questionsLabel = document.createElement('div');
        questionsLabel.classList.add('stat-label');
        questionsLabel.textContent = 'Questions';
        
        const questionsValue = document.createElement('div');
        questionsValue.classList.add('stat-value');
        questionsValue.textContent = `${this._summary.answered_questions}/${this._summary.total_questions}`;
        
        questionsItem.appendChild(questionsLabel);
        questionsItem.appendChild(questionsValue);
        
        // Second stat item - Correct answers
        const correctItem = document.createElement('div');
        correctItem.classList.add('stat-item', 'correct-stat');
        
        const correctLabel = document.createElement('div');
        correctLabel.classList.add('stat-label');
        correctLabel.textContent = 'Correct';
        
        const correctValue = document.createElement('div');
        correctValue.classList.add('stat-value');
        correctValue.textContent = `${this._summary.correct_answers}`;
        
        correctItem.appendChild(correctLabel);
        correctItem.appendChild(correctValue);
        
        // Third stat item - Incorrect answers
        const incorrectItem = document.createElement('div');
        incorrectItem.classList.add('stat-item', 'incorrect-stat');
        
        const incorrectLabel = document.createElement('div');
        incorrectLabel.classList.add('stat-label');
        incorrectLabel.textContent = 'Incorrect';
        
        const incorrectValue = document.createElement('div');
        incorrectValue.classList.add('stat-value');
        incorrectValue.textContent = `${this._summary.incorrect_answers}`;
        
        incorrectItem.appendChild(incorrectLabel);
        incorrectItem.appendChild(incorrectValue);
        
        // Add all stat items to the summary
        statsSummary.appendChild(questionsItem);
        statsSummary.appendChild(correctItem);
        statsSummary.appendChild(incorrectItem);
        
        const actions = document.createElement('section');
        actions.classList.add('actions', 'button-container');
        
        const homeButton = document.createElement('a');
        homeButton.href = '/home';
        homeButton.classList.add('home-btn');
        homeButton.setAttribute('data-link', '');
        homeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>Back to Home`;
        
        actions.appendChild(homeButton);
        
        // Assemble the final structure - ultra minimal version
        article.appendChild(heading);
        article.appendChild(percentageContainer);
        article.appendChild(statsSummary);
        article.appendChild(actions);
        
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(article);
    }
    
    setupEventListeners() {
        const homeButton = this.shadowRoot.querySelector('[data-link]');
        if (homeButton) {
            homeButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.pushState(null, null, homeButton.getAttribute('href'));
                window.dispatchEvent(new PopStateEvent('popstate'));
            });
        }
    }
}

customElements.define('quiz-results', QuizResults);

export default QuizResults;