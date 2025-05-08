class QuestionForm extends HTMLElement {
    static get observedAttributes() {
        return ['editing', 'question-id', 'quiz-id'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._difficulties = [];
        this._questionData = {
            question_text: '',
            difficulty_id: ''
        };
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.isConnected) {
            this.render();
        }
    }
    
    render() {
        const isEditing = this.getAttribute('editing') === 'true';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .creator-form {
                    background-color: white;
                    border-radius: 0.5rem;
                    padding: 2rem;
                    max-width: 40rem;
                    margin: 0 auto;
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
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
                
                .form-group textarea,
                .form-group select {
                    width: 100%;
                    padding: 0.75rem;
                    border: 0.0625rem solid var(--gray-300);
                    border-radius: 0.25rem;
                    font-size: 1rem;
                    background-color: white;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }
                
                .form-group textarea:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 0.125rem rgba(59, 130, 246, 0.2);
                }
                
                .form-help {
                    font-size: 0.75rem;
                    color: var(--gray-500);
                    margin-top: 0.25rem;
                }
                
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1.5rem;
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
            </style>
            
            <form class="creator-form">
                <section class="form-group">
                    <label for="question-text">Question Text</label>
                    <textarea id="question-text" rows="2" required placeholder="Enter your question" maxlength="256">${this._questionData.question_text || ''}</textarea>
                    <p class="form-help">Maximum 256 characters</p>
                </section>
                
                <section class="form-group">
                    <label for="question-difficulty">Difficulty Level</label>
                    <select id="question-difficulty" required>
                        <option value="">-- Select difficulty --</option>
                        ${this._difficulties.map(difficulty => `
                            <option 
                                value="${difficulty.difficulty_id}" 
                                ${this._questionData.difficulty_id == difficulty.difficulty_id ? 'selected' : ''}
                            >
                                ${difficulty.difficulty_level} (${difficulty.time_limit_seconds}s, +${difficulty.points_on_correct}/${difficulty.points_on_incorrect})
                            </option>
                        `).join('')}
                    </select>
                </section>
                
                <section class="form-actions">
                    <button type="button" id="cancel-btn" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">Continue to Add Answers</button>
                </section>
            </form>
        `;
    }
    
    setupEventListeners() {
        const form = this.shadowRoot.querySelector('form');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
        const cancelBtn = this.shadowRoot.querySelector('#cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('cancel', {
                    bubbles: true,
                    composed: true
                }));
            });
        }
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        const textInput = this.shadowRoot.querySelector('#question-text');
        const difficultySelect = this.shadowRoot.querySelector('#question-difficulty');
        
        if (!textInput || !difficultySelect) return;
        
        const text = textInput.value.trim();
        const difficultyId = difficultySelect.value;
        
        if (!text) {
            alert('Question text is required');
            return;
        }
        
        if (!difficultyId) {
            alert('Difficulty level is required');
            return;
        }
        
        const questionId = this.getAttribute('question-id');
        const isNew = !questionId;
        
        // Prepare question data
        const questionData = {
            question_text: text,
            difficulty_id: difficultyId
        };
        
        // Dispatch submit event
        this.dispatchEvent(new CustomEvent('question-submit', {
            detail: {
                question: questionData,
                isNew
            },
            bubbles: true,
            composed: true
        }));
    }
    
    set difficulties(value) {
        if (Array.isArray(value)) {
            this._difficulties = value;
            this.render();
        }
    }
    
    get difficulties() {
        return this._difficulties;
    }
    
    setQuestionData(question) {
        this._questionData = {
            question_text: question.question_text || '',
            difficulty_id: question.difficulty_id || ''
        };
        
        this.render();
    }
    
    setEditing(isEditing) {
        this.setAttribute('editing', isEditing.toString());
    }
    
    reset() {
        this._questionData = {
            question_text: '',
            difficulty_id: ''
        };
        
        this.render();
    }
}

customElements.define('question-form', QuestionForm);

export default QuestionForm;