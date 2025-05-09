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
            this.clearShadowRoot();
            const loadingMessage = document.createElement('p');
            loadingMessage.textContent = 'Loading question...';
            this.shadowRoot.appendChild(loadingMessage);
            return;
        }

        this.clearShadowRoot();

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

        const styleElement = document.createElement('style');
        styleElement.textContent = `
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
        `;
        this.shadowRoot.appendChild(styleElement);

        const article = document.createElement('article');
        this.shadowRoot.appendChild(article);

        const header = document.createElement('header');
        article.appendChild(header);

        const questionInfo = this.createInfoBlock('Question', `${questionIndex + 1}/${totalQuestions}`);
        header.appendChild(questionInfo);

        const quizInfo = this.createInfoBlock('Quiz', quizTitle);
        header.appendChild(quizInfo);

        const timeInfo = this.createInfoBlock('Time Remaining', `${timeLeft}s`, timerWarning ? 'var(--error)' : 'var(--primary)');
        header.appendChild(timeInfo);

        const scoreInfo = this.createInfoBlock('Score', score);
        header.appendChild(scoreInfo);

        const progressContainer = document.createElement('section');
        progressContainer.classList.add('progress-container');
        article.appendChild(progressContainer);

        const progressBar = document.createElement('span');
        progressBar.classList.add('progress-bar');
        progressContainer.appendChild(progressBar);

        const questionContent = document.createElement('section');
        questionContent.classList.add('question-content');
        article.appendChild(questionContent);

        const categoryInfo = document.createElement('p');
        categoryInfo.classList.add('category-info');
        categoryInfo.textContent = `${this._question.difficulty_level} • ${this._question.points_on_correct > 0 ? '+' : ''}${this._question.points_on_correct} points correct / ${this._question.points_on_incorrect < 0 ? '' : '+'}${this._question.points_on_incorrect} points incorrect`;
        questionContent.appendChild(categoryInfo);

        const questionText = document.createElement('h2');
        questionText.classList.add('question-text');
        questionText.textContent = this._question.question_text;
        questionContent.appendChild(questionText);

        const answerGrid = document.createElement('section');
        answerGrid.classList.add('answer-grid');
        questionContent.appendChild(answerGrid);

        this._question.answers.forEach((answer, index) => {
            const isSelected = selectedAnswer === answer.answer_id.toString();
            const isCorrect = this.hasAttribute(`correct-answer-${answer.answer_id}`);
            const isWrong = isSelected && !isCorrect && showFeedback;

            let className = 'answer-option';
            if (isSelected) className += ' selected';
            if (isCorrect && (showFeedback || timeUp)) className += ' correct';
            if (isWrong) className += ' wrong';

            const answerOption = document.createElement('button');
            answerOption.type = 'button';
            answerOption.className = className;
            answerOption.dataset.id = answer.answer_id;
            if (showFeedback || submitting || timeUp) {
                answerOption.disabled = true;
            }

            const optionLetter = document.createElement('span');
            optionLetter.classList.add('option-letter');
            optionLetter.textContent = String.fromCharCode(65 + index);
            answerOption.appendChild(optionLetter);

            const optionText = document.createElement('span');
            optionText.classList.add('option-text');
            optionText.textContent = answer.answer_text;
            answerOption.appendChild(optionText);

            answerGrid.appendChild(answerOption);
        });

        if (showFeedback) {
            const answerFeedback = document.createElement('section');
            answerFeedback.classList.add('answer-feedback');
            questionContent.appendChild(answerFeedback);

            const points = document.createElement('p');
            points.classList.add('points', feedbackPoints >= 0 ? 'positive' : 'negative');
            points.textContent = `${feedbackPoints >= 0 ? '+' : ''}${feedbackPoints} points`;
            answerFeedback.appendChild(points);
        }

        if (timeUp && !showFeedback) {
            const timeUpMessage = document.createElement('section');
            timeUpMessage.classList.add('time-up-message');
            questionContent.appendChild(timeUpMessage);

            const message = document.createElement('p');
            message.textContent = "Time's up! The correct answer is shown above.";
            timeUpMessage.appendChild(message);
        }

        const footer = document.createElement('footer');
        article.appendChild(footer);

        if (!showFeedback && !timeUp) {
            const submitButton = document.createElement('button');
            submitButton.id = 'submit-btn';
            submitButton.classList.add('submit-btn');
            submitButton.textContent = 'Submit Answer';
            if (!selectedAnswer || submitting) {
                submitButton.disabled = true;
            }
            footer.appendChild(submitButton);
        }

        if (showNextButton || (timeUp && questionIndex < totalQuestions - 1)) {
            const nextButton = document.createElement('button');
            nextButton.id = 'next-btn';
            nextButton.classList.add('next-btn');
            nextButton.textContent = 'Next Question';
            footer.appendChild(nextButton);
        }

        if (showResultsButton || (timeUp && questionIndex >= totalQuestions - 1)) {
            const resultsButton = document.createElement('button');
            resultsButton.id = 'results-btn';
            resultsButton.classList.add('results-btn');
            resultsButton.textContent = 'See Results';
            footer.appendChild(resultsButton);
        }

        this.setupEventListeners();
    }

    createInfoBlock(label, value, color) {
        const section = document.createElement('section');
        section.classList.add('info-block');

        const labelElement = document.createElement('p');
        labelElement.classList.add('info-label');
        labelElement.textContent = label;
        section.appendChild(labelElement);

        const valueElement = document.createElement('p');
        valueElement.classList.add('info-value');
        valueElement.textContent = value;
        if (color) {
            valueElement.style.color = color;
        }
        section.appendChild(valueElement);

        return section;
    }

    clearShadowRoot() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
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