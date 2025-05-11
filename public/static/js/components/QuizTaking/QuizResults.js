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
            './static/css/styles.css',
            './static/css/shared/components.css',
            './static/css/quizTaking/quizResults.css'
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
        
        const heading = document.createElement('h2');
        heading.textContent = 'Quiz Complete!';
        
        const finalScore = document.createElement('p');
        finalScore.classList.add('final-score');
        finalScore.innerHTML = `Your score: <strong>${this._summary.total_points}</strong> points`;
        
        const percentage = document.createElement('p');
        percentage.classList.add('percentage');
        percentage.textContent = `${accuracyPercent}%`;
        
        const statsSummary = document.createElement('section');
        statsSummary.classList.add('stats-summary');
        
        const questions = document.createElement('p');
        questions.innerHTML = `<strong>Questions:</strong> ${this._summary.answered_questions}/${this._summary.total_questions} (${answeredPercent}% completed)`;
        
        const correctAnswers = document.createElement('p');
        correctAnswers.innerHTML = `<strong>Correct answers:</strong> ${this._summary.correct_answers}/${this._summary.answered_questions}`;
        
        const incorrectAnswers = document.createElement('p');
        incorrectAnswers.innerHTML = `<strong>Incorrect answers:</strong> ${this._summary.incorrect_answers}`;
        
        statsSummary.appendChild(questions);
        statsSummary.appendChild(correctAnswers);
        statsSummary.appendChild(incorrectAnswers);
        
        const actions = document.createElement('section');
        actions.classList.add('actions');
        
        const homeButton = document.createElement('a');
        homeButton.href = '/home';
        homeButton.classList.add('home-btn');
        homeButton.setAttribute('data-link', '');
        homeButton.textContent = 'Back to Home';
        
        actions.appendChild(homeButton);
        
        article.appendChild(heading);
        article.appendChild(finalScore);
        article.appendChild(percentage);
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