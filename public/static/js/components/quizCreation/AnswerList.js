class AnswersList extends HTMLElement {
    static get observedAttributes() {
        return ['question-id'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.answers = [];
        this.loading = true;
        this.error = null;
        this.showAnswerForm = true;
        this.questionInfo = null;
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadAnswers();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'question-id' && oldValue !== newValue && newValue) {
            this.loadAnswers();
        }
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .question-preview {
                    background-color: white;
                    padding: 1.5rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
                }
                
                .question-preview h2 {
                    margin: 0;
                    font-size: 1.25rem;
                    color: var(--gray-800);
                }
                
                .answers-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                
                .answer-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: white;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease;
                }
                
                .answer-card:hover {
                    transform: translateY(-0.125rem);
                }
                
                .answer-card.correct {
                    border-left: 0.25rem solid var(--success);
                }
                
                .answer-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }
                
                .answer-marker {
                    width: 1.5rem;
                    height: 1.5rem;
                    border-radius: 50%;
                    background-color: var(--gray-200);
                    color: var(--success);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                
                .answer-text {
                    margin: 0;
                }
                
                .answer-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .action-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s ease;
                }
                
                .action-btn:hover {
                    background-color: var(--gray-200);
                }
                
                .answer-form {
                    background-color: white;
                    padding: 1.5rem;
                    border-radius: 0.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
                }
                
                .answer-form.hidden {
                    display: none;
                }
                
                .answer-form h3 {
                    margin-top: 0;
                    margin-bottom: 1.5rem;
                    font-size: 1.25rem;
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: var(--gray-700);
                }
                
                .form-group input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 0.0625rem solid var(--gray-300);
                    border-radius: 0.25rem;
                    font-size: 1rem;
                    background-color: white;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }
                
                .form-group input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 0.125rem rgba(59, 130, 246, 0.2);
                }
                
                .form-help {
                    font-size: 0.75rem;
                    color: var(--gray-500);
                    margin-top: 0.25rem;
                }
                
                .form-check {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                
                .form-check input[type="checkbox"] {
                    width: auto;
                }
                
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                
                .navigation-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                }
                
                .btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.25rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    font-family: inherit;
                    font-size: 0.875rem;
                }
                
                .btn-secondary {
                    background-color: var(--gray-200);
                    color: var(--gray-700);
                }
                
                .btn-secondary:hover {
                    background-color: var(--gray-300);
                }

                .btn-primary {
                    background-color: var(--primary);
                    color: white;
                }
                
                .btn-primary:hover {
                    background-color: var(--primary-dark);
                }
                
                .empty-message {
                    text-align: center;
                    padding: 3rem 1rem;
                    background-color: var(--gray-50);
                    border-radius: 0.5rem;
                    margin-bottom: 2rem;
                }
                
                .empty-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--gray-700);
                }
                
                .empty-message-text {
                    color: var(--gray-500);
                    max-width: 30rem;
                    margin: 0 auto;
                }
                
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
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
                
                .error-message {
                    color: var(--error);
                    text-align: center;
                    padding: 1rem;
                    background-color: var(--error-light);
                    border-radius: 0.5rem;
                    margin-bottom: 1rem;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                .status-valid {
                    background-color: var(--success-light);
                    color: var(--success-dark);
                }
                
                .status-invalid {
                    background-color: var(--error-light);
                    color: var(--error-dark);
                }
            </style>
            
            <article class="question-preview">
                <h2 id="current-question-text">${this.questionInfo?.question_text || 'Loading question...'}</h2>
                ${this.questionInfo ? `
                    <section id="answer-status" class="answer-status">
                        <p class="status-badge ${this.questionInfo.is_valid ? 'status-valid' : 'status-invalid'}">
                            ${this.questionInfo.is_valid ? 'Valid question' : this.questionInfo.validation_message || 'Invalid question'}
                        </p>
                    </section>
                ` : ''}
            </article>
            
            <section class="answers-content">
                ${this.renderAnswersList()}
                
                ${this.showAnswerForm && this.answers.length < 4 ? `
                    <form class="answer-form" id="add-answer-form">
                        <h3>Add Answer Option</h3>
                        <section class="form-group">
                            <label for="answer-text">Answer Text</label>
                            <input type="text" id="answer-text" required placeholder="Enter answer option" maxlength="128">
                            <p class="form-help">Maximum 128 characters</p>
                        </section>
                        
                        <section class="form-check">
                            <input type="checkbox" id="answer-correct">
                            <label for="answer-correct">Mark as correct answer</label>
                        </section>
                        
                        <section class="form-actions">
                            <button type="button" id="cancel-answer-btn" class="btn btn-secondary">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Answer</button>
                        </section>
                    </form>
                ` : ''}
            </section>
            
            <section class="navigation-actions">
                <button id="back-to-questions-btn" class="btn btn-secondary">Back to Questions</button>
            </section>
        `;
    }
    
    renderAnswersList() {
        if (this.loading) {
            return `
                <section class="loading">
                    <span class="loading-spinner"></span>
                    <p>Loading answers...</p>
                </section>
            `;
        }
        
        if (this.error) {
            return `<p class="error-message">${this.error}</p>`;
        }
        
        if (this.answers.length === 0) {
            return `
                <section class="empty-message">
                    <h3 class="empty-title">No answers found</h3>
                    <p class="empty-message-text">Add 4 answer options with 1 correct answer.</p>
                </section>
            `;
        }
        
        return `
            <section class="answers-list">
                ${this.answers.map(answer => this.renderAnswerCard(answer)).join('')}
            </section>
        `;
    }
    
    renderAnswerCard(answer) {
        return `
            <article class="answer-card ${answer.is_correct ? 'correct' : ''}" data-id="${answer.answer_id}">
                <section class="answer-content">
                    <span class="answer-marker">${answer.is_correct ? '✓' : ''}</span>
                    <p class="answer-text">${answer.answer_text}</p>
                </section>
                <section class="answer-actions">
                    ${!answer.is_correct ? `
                        <button class="action-btn mark-correct" title="Mark as Correct" data-id="${answer.answer_id}">
                            <span aria-hidden="true">✓</span>
                        </button>
                    ` : ''}
                    <button class="action-btn delete-answer" title="Delete Answer" data-id="${answer.answer_id}">
                        <span aria-hidden="true">🗑️</span>
                    </button>
                </section>
            </article>
        `;
    }
    
    setupEventListeners() {
        const backToQuestionsBtn = this.shadowRoot.querySelector('#back-to-questions-btn');
        if (backToQuestionsBtn) {
            backToQuestionsBtn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('back-to-questions', {
                    bubbles: true,
                    composed: true
                }));
            });
        }
        
        const answerForm = this.shadowRoot.querySelector('#add-answer-form');
        if (answerForm) {
            answerForm.addEventListener('submit', this.handleAddAnswer.bind(this));
        }
        
        const cancelAnswerBtn = this.shadowRoot.querySelector('#cancel-answer-btn');
        if (cancelAnswerBtn) {
            cancelAnswerBtn.addEventListener('click', () => {
                const answerText = this.shadowRoot.querySelector('#answer-text');
                const answerCorrect = this.shadowRoot.querySelector('#answer-correct');
                
                if (answerText) answerText.value = '';
                if (answerCorrect) answerCorrect.checked = false;
            });
        }
        
        const markCorrectButtons = this.shadowRoot.querySelectorAll('.mark-correct');
        markCorrectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const answerId = button.dataset.id;
                this.handleMarkCorrect(answerId);
            });
        });
        
        const deleteButtons = this.shadowRoot.querySelectorAll('.delete-answer');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const answerId = button.dataset.id;
                this.handleDeleteAnswer(answerId);
            });
        });
    }
    
    async loadAnswers() {
        const questionId = this.getAttribute('question-id');
        if (!questionId) return;
        
        try {
            this.loading = true;
            this.error = null;
            this.render();
            
            if (window.questionService) {
                this.questionInfo = await window.questionService.getQuestionById(questionId);
            }
            
            if (window.quizValidatorService) {
                const validation = await window.quizValidatorService.validateQuestion(questionId);
                this.questionInfo = {
                    ...this.questionInfo,
                    is_valid: validation.is_valid,
                    validation_message: validation.validation_messages?.[0] || ''
                };
            }
            
            if (window.answerService) {
                this.answers = await window.answerService.getAnswersByQuestionId(questionId);
            } else {
                throw new Error('Answer service not available');
            }
            
            this.loading = false;
            this.showAnswerForm = this.answers.length < 4;
            this.render();
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Error loading answers:', error);
            this.loading = false;
            this.error = 'Failed to load answers: ' + (error.message || 'Unknown error');
            this.render();
        }
    }
    
    async handleAddAnswer(event) {
        event.preventDefault();
        
        const questionId = this.getAttribute('question-id');
        if (!questionId) return;
        
        const textInput = this.shadowRoot.querySelector('#answer-text');
        const correctCheckbox = this.shadowRoot.querySelector('#answer-correct');
        
        if (!textInput || !correctCheckbox) return;
        
        const text = textInput.value.trim();
        const isCorrect = correctCheckbox.checked;
        
        if (!text) {
            alert('Answer text is required');
            return;
        }
        
        try {
            if (isCorrect && this.answers.some(a => a.is_correct)) {
                if (!confirm('This question already has a correct answer. Do you want to mark this as the new correct answer?')) {
                    return;
                }
            }
            
            const answerService = window.answerService;
            if (!answerService) {
                throw new Error('Answer service not available');
            }
            
            await answerService.createAnswer({
                question_id: questionId,
                answer_text: text,
                is_correct: isCorrect
            });
            
            textInput.value = '';
            correctCheckbox.checked = false;
            
            await this.loadAnswers();
            
        } catch (error) {
            console.error('Error adding answer:', error);
            alert('Failed to add answer: ' + (error.message || 'Unknown error'));
        }
    }
    
    async handleMarkCorrect(answerId) {
        try {
            const answerService = window.answerService;
            if (!answerService) {
                throw new Error('Answer service not available');
            }
            
            await answerService.markAsCorrect(answerId);
            
            await this.loadAnswers();
            
        } catch (error) {
            console.error('Error marking answer as correct:', error);
            alert('Failed to mark answer as correct: ' + (error.message || 'Unknown error'));
        }
    }
    
    async handleDeleteAnswer(answerId) {
        try {
            if (!confirm('Are you sure you want to delete this answer?')) {
                return;
            }
            
            const answerService = window.answerService;
            if (!answerService) {
                throw new Error('Answer service not available');
            }
            
            await answerService.deleteAnswer(answerId);
            
            await this.loadAnswers();
            
        } catch (error) {
            console.error('Error deleting answer:', error);
            alert('Failed to delete answer: ' + (error.message || 'Unknown error'));
        }
    }
}

customElements.define('answers-list', AnswersList);

export default AnswersList;