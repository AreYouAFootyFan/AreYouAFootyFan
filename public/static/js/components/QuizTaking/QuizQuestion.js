class QuizQuestion extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._question = null;
        this._selectedAnswer = null;
    }
    
    static get observedAttributes() {
        return [
            'question-index', 
            'total-questions', 
            'quiz-title', 
            'score', 
            'time-left', 
            'timer-warning',
            'selected-answer',
            'submitting',
            'show-feedback',
            'feedback-points',
            'show-next-button',
            'show-results-button',
            'time-up'
        ];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        this.render();
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    
    set question(value) {
        this._question = value;
        this.render();
    }
    
    get question() {
        return this._question;
    }
    
    render() {
        if (!this._question) {
            this.shadowRoot.innerHTML = `<p>Loading question...</p>`;
            return;
        }
        
        const questionIndex = parseInt(this.getAttribute('question-index') || '0');
        const totalQuestions = parseInt(this.getAttribute('total-questions') || '0');
        const quizTitle = this.getAttribute('quiz-title') || 'Quiz';
        const score = parseInt(this.getAttribute('score') || '0');
        const timeLeft = parseInt(this.getAttribute('time-left') || '0');
        const timerWarning = this.hasAttribute('timer-warning');
        
        const selectedAnswer = this.getAttribute('selected-answer');
        const submitting = this.hasAttribute('submitting');
        const showFeedback = this.hasAttribute('show-feedback');
        const feedbackPoints = parseInt(this.getAttribute('feedback-points') || '0');
        const showNextButton = this.hasAttribute('show-next-button');
        const showResultsButton = this.hasAttribute('show-results-button');
        const timeUp = this.hasAttribute('time-up');
        
        const progress = timeLeft / this._question.time_limit_seconds * 100;
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                article {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    margin-bottom: 2rem;
                }
                
                header {
                    display: flex;
                    justify-content: space-between;
                    padding: 1.5rem;
                    border-bottom: 0.0625rem solid var(--gray-200);
                    background-color: var(--gray-50);
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .info-block {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                
                .info-label {
                    font-size: 0.875rem;
                    color: var(--gray-600);
                }
                
                .info-value {
                    font-weight: 600;
                }
                
                .timer-value {
                    color: ${timerWarning ? 'var(--error)' : 'var(--primary)'};
                }
                
                .progress-container {
                    height: 0.375rem;
                    background-color: var(--gray-200);
                    overflow: hidden;
                }
                
                .progress-bar {
                    height: 100%;
                    width: ${progress}%;
                    background-color: ${timerWarning ? 'var(--error)' : 'var(--primary)'};
                    transition: width 1s linear;
                }
                
                .question-content {
                    padding: 2rem;
                }
                
                .category-info {
                    font-size: 0.875rem;
                    color: var(--gray-600);
                    margin-bottom: 1rem;
                }
                
                .question-text {
                    font-size: 1.5rem;
                    font-weight: 500;
                    margin-bottom: 2rem;
                    line-height: 1.4;
                }
                
                .answer-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                
                .answer-option {
                    display: flex;
                    align-items: center;
                    background-color: white;
                    border: 0.0625rem solid var(--gray-300);
                    border-radius: 0.5rem;
                    padding: 1rem;
                    color: var(--gray-800);
                    text-align: left;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    width: 100%;
                    font-family: inherit;
                    font-size: 1rem;
                }
                
                .answer-option:hover {
                    border-color: var(--primary);
                    background-color: var(--gray-50);
                }
                
                .answer-option.selected {
                    border-color: var(--primary);
                    background-color: var(--primary-light);
                }
                
                .answer-option.correct {
                    border-color: var(--success) !important;
                    background-color: rgba(34, 197, 94, 0.1) !important;
                }
                
                .answer-option.wrong {
                    border-color: var(--error) !important;
                    background-color: rgba(239, 68, 68, 0.1) !important;
                }
                
                .option-letter {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 2rem;
                    height: 2rem;
                    background-color: var(--gray-100);
                    border-radius: 50%;
                    margin-right: 1rem;
                    font-weight: 600;
                    flex-shrink: 0;
                }
                
                .answer-option.correct .option-letter {
                    background-color: var(--success);
                    color: white;
                }
                
                .answer-option.wrong .option-letter {
                    background-color: var(--error);
                    color: white;
                }
                
                .answer-feedback {
                    margin-top: 2rem;
                    text-align: center;
                    padding-top: 1rem;
                    border-top: 0.0625rem solid var(--gray-200);
                }
                
                .points {
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .points.positive {
                    color: var(--success);
                }
                
                .points.negative {
                    color: var(--error);
                }
                
                .time-up-message {
                    margin-top: 2rem;
                    padding: 1rem;
                    background-color: var(--gray-100);
                    border-radius: 0.5rem;
                    text-align: center;
                    font-weight: 500;
                    color: var(--error);
                }
                
                footer {
                    padding: 1.5rem;
                    border-top: 0.0625rem solid var(--gray-200);
                    text-align: center;
                }
                
                button {
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    border: none;
                    min-width: min(100%, 8rem);
                    font-family: inherit;
                }
                
                .submit-btn {
                    background-color: var(--primary);
                    color: white;
                }
                
                .submit-btn:hover {
                    background-color: var(--primary-dark);
                }
                
                .submit-btn:disabled {
                    background-color: var(--gray-300);
                    cursor: not-allowed;
                }
                
                .next-btn, .results-btn {
                    background-color: var(--secondary);
                    color: white;
                }
                
                .next-btn:hover, .results-btn:hover {
                    background-color: var(--secondary-dark);
                }
            </style>
            
            <article>
                <header>
                    <section class="info-block">
                        <p class="info-label">Question</p>
                        <p class="info-value">${questionIndex + 1}/${totalQuestions}</p>
                    </section>
                    
                    <section class="info-block">
                        <p class="info-label">Quiz</p>
                        <p class="info-value">${quizTitle}</p>
                    </section>
                    
                    <section class="info-block">
                        <p class="info-label">Time Remaining</p>
                        <p class="info-value timer-value">${timeLeft}s</p>
                    </section>
                    
                    <section class="info-block">
                        <p class="info-label">Score</p>
                        <p class="info-value">${score}</p>
                    </section>
                </header>
                
                <section class="progress-container">
                    <span class="progress-bar"></span>
                </section>
                
                <section class="question-content">
                    <p class="category-info">
                        <span>${this._question.difficulty_level} • ${this._question.points_on_correct > 0 ? '+' : ''}${this._question.points_on_correct} points correct / ${this._question.points_on_incorrect < 0 ? '' : '+'}${this._question.points_on_incorrect} points incorrect</span>
                    </p>
                    
                    <h2 class="question-text">${this._question.question_text}</h2>
                    
                    <section class="answer-grid">
                        ${this._question.answers.map((answer, index) => {
                            const isSelected = selectedAnswer === answer.answer_id.toString();
                            const isCorrect = this.hasAttribute(`correct-answer-${answer.answer_id}`);
                            const isWrong = isSelected && !isCorrect && showFeedback;
                            
                            let className = 'answer-option';
                            if (isSelected) className += ' selected';
                            if (isCorrect && (showFeedback || timeUp)) className += ' correct';
                            if (isWrong) className += ' wrong';
                            
                            return `
                                <button 
                                    type="button" 
                                    class="${className}" 
                                    data-id="${answer.answer_id}"
                                    ${showFeedback || submitting || timeUp ? 'disabled' : ''}
                                >
                                    <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                    <span class="option-text">${answer.answer_text}</span>
                                </button>
                            `;
                        }).join('')}
                    </section>
                    
                    ${showFeedback ? `
                        <section class="answer-feedback">
                            <p class="points ${feedbackPoints >= 0 ? 'positive' : 'negative'}">
                                ${feedbackPoints >= 0 ? '+' : ''}${feedbackPoints} points
                            </p>
                        </section>
                    ` : ''}
                    
                    ${timeUp && !showFeedback ? `
                        <section class="time-up-message">
                            <p>Time's up! The correct answer is shown above.</p>
                        </section>
                    ` : ''}
                </section>
                
                <footer>
                    ${!showFeedback && !timeUp ? `
                        <button 
                            id="submit-btn" 
                            class="submit-btn" 
                            ${!selectedAnswer || submitting ? 'disabled' : ''}
                        >
                            Submit Answer
                        </button>
                    ` : ''}
                    
                    ${showNextButton || (timeUp && questionIndex < totalQuestions - 1) ? `
                        <button id="next-btn" class="next-btn">Next Question</button>
                    ` : ''}
                    
                    ${showResultsButton || (timeUp && questionIndex >= totalQuestions - 1) ? `
                        <button id="results-btn" class="results-btn">See Results</button>
                    ` : ''}
                </footer>
            </article>
        `;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const answerOptions = this.shadowRoot.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.addEventListener('click', () => {
                const answerId = option.dataset.id;
                this.dispatchEvent(new CustomEvent('answer-selected', {
                    detail: { answerId }
                }));
            });
        });
        
        const submitButton = this.shadowRoot.querySelector('#submit-btn');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('submit-answer'));
            });
        }
        
        const nextButton = this.shadowRoot.querySelector('#next-btn');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('next-question'));
            });
        }
        
        const resultsButton = this.shadowRoot.querySelector('#results-btn');
        if (resultsButton) {
            resultsButton.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('show-results'));
            });
        }
    }
}

customElements.define('quiz-question', QuizQuestion);

export default QuizQuestion;