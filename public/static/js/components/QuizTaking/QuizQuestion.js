import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";
class QuizQuestion extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._question = null;
        this._selectedAnswer = null;
        this.styleSheet = new CSSStyleSheet();
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

    async connectedCallback() {
        await this.loadStyles();
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

    async loadStyles() {        
        await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/quizTaking/quizQuestion.css'
        );
    }

    render() {
        if (!this._question) {
            clearDOM(this.shadowRoot);
            const loadingMessage = document.createElement('p');
            loadingMessage.textContent = 'Loading question...';
            this.shadowRoot.appendChild(loadingMessage);
            return;
        }

        clearDOM(this.shadowRoot);

        const questionIndex = parseInt(this.getAttribute('question-index') || '0');
        const totalQuestions = parseInt(this.getAttribute('total-questions') || '0');
        const quizTitle = this.getAttribute('quiz-title') || 'Quiz';
        const score = parseInt(this.getAttribute('score') || '0');
        const timeLeft = parseInt(this.getAttribute('time-left') || '0');

        const selectedAnswer = this.getAttribute('selected-answer');
        const submitting = this.hasAttribute('submitting');
        const showFeedback = this.hasAttribute('show-feedback');
        const feedbackPoints = parseInt(this.getAttribute('feedback-points') || '0');
        const showNextButton = this.hasAttribute('show-next-button');
        const showResultsButton = this.hasAttribute('show-results-button');
        const timeUp = this.hasAttribute('time-up');

        const styleElement = document.createElement('style');
        
        this.shadowRoot.appendChild(styleElement);

        const article = document.createElement('article');
        this.shadowRoot.appendChild(article);

        const header = document.createElement('header');
        article.appendChild(header);

        const questionInfo = this.createInfoBlock('Question', `${questionIndex + 1}/${totalQuestions}`);
        header.appendChild(questionInfo);

        const quizInfo = this.createInfoBlock('Quiz', quizTitle);
        header.appendChild(quizInfo);

        const timeInfo = this.createInfoBlock('Time Remaining', `${timeLeft}s`, 'var(--primary)');
        header.appendChild(timeInfo);

        const scoreInfo = this.createInfoBlock('Score', score);
        header.appendChild(scoreInfo);

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

            const optionLetter = document.createElement('section');
            optionLetter.classList.add('option-letter');
            optionLetter.textContent = String.fromCharCode(65 + index);
            answerOption.appendChild(optionLetter);

            const optionText = document.createElement('section');
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