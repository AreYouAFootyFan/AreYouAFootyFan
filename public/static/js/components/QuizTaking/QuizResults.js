class QuizResults extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._summary = null;
    }
    
    connectedCallback() {
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
        style.textContent = `
            :host {
                display: block;
                width: 100%;
            }
            
            .loading {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                color: var(--gray-500);
            }
            
            .loading-spinner {
                display: inline-block;
                width: 1.5rem;
                height: 1.5rem;
                border: 0.125rem solid currentColor;
                border-right-color: transparent;
                border-radius: 50%;
                margin-right: 0.5rem;
                animation: spin 0.75s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            article {
                background-color: white;
                border-radius: 0.5rem;
                box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
                padding: 2rem;
                max-width: 40rem;
                margin: 0 auto;
                text-align: center;
            }
            
            h2 {
                color: var(--primary);
                margin-bottom: 1.5rem;
                font-size: 1.75rem;
            }
            
            .final-score {
                font-size: 1.25rem;
                margin-bottom: 1rem;
            }
            
            .percentage {
                font-size: 3rem;
                font-weight: 700;
                color: var(--primary);
                margin: 1.5rem 0;
            }
            
            .stats-summary {
                background-color: var(--gray-50);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 2rem;
                text-align: left;
            }
            
            .stats-summary p {
                margin-bottom: 0.5rem;
            }
            
            .actions {
                display: flex;
                justify-content: center;
                gap: 1rem;
            }
            
            .home-btn {
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                font-size: 1rem;
                font-weight: 500;
                background-color: var(--primary);
                color: white;
                text-decoration: none;
                display: inline-block;
                transition: all var(--transition-fast);
                border: none;
                cursor: pointer;
                font-family: inherit;
            }
            
            .home-btn:hover {
                background-color: var(--primary-dark);
            }
        `;
        
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