class QuizForm extends HTMLElement {
    static get observedAttributes() {
        return ['editing', 'quiz-id', 'quiz-title'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._categories = [];
        this._quizData = {
            quiz_title: '',
            quiz_description: '',
            category_id: ''
        };
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'quiz-title' && newValue) {
            this._quizData.quiz_title = newValue;
        }
        
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
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 0.0625rem solid var(--gray-300);
                    border-radius: 0.25rem;
                    font-size: 1rem;
                    background-color: white;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
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
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
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
                    <label for="quiz-title">Quiz Title</label>
                    <input type="text" id="quiz-title" required placeholder="e.g. World Cup History" maxlength="64" value="${this._quizData.quiz_title || ''}">
                    <p class="form-help">Maximum 64 characters</p>
                </section>
                
                <section class="form-group">
                    <label for="quiz-category">Category</label>
                    <select id="quiz-category">
                        <option value="">-- Select a category --</option>
                        ${this._categories.map(category => `
                            <option 
                                value="${category.category_id}" 
                                ${this._quizData.category_id == category.category_id ? 'selected' : ''}
                            >
                                ${category.category_name}
                            </option>
                        `).join('')}
                    </select>
                </section>
                
                <section class="form-group">
                    <label for="quiz-description">Description</label>
                    <textarea id="quiz-description" rows="3" placeholder="Describe what this quiz is about" maxlength="128">${this._quizData.quiz_description || ''}</textarea>
                    <p class="form-help">Maximum 128 characters</p>
                </section>
                
                <section class="form-actions">
                    <a href="/admin" class="btn btn-secondary" data-link>Cancel</a>
                    <button type="submit" class="btn btn-primary">${isEditing ? 'Save Changes' : 'Create Quiz'}</button>
                </section>
            </form>
        `;
    }
    
    setupEventListeners() {
        const form = this.shadowRoot.querySelector('form');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
        // Navigation links
        const links = this.shadowRoot.querySelectorAll('[data-link]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Clean up localStorage
                localStorage.removeItem('current_question_id');
                localStorage.removeItem('current_question_text');
                
                window.history.pushState(null, null, link.getAttribute('href'));
                window.dispatchEvent(new PopStateEvent('popstate'));
            });
        });
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        const titleInput = this.shadowRoot.querySelector('#quiz-title');
        const categorySelect = this.shadowRoot.querySelector('#quiz-category');
        const descriptionInput = this.shadowRoot.querySelector('#quiz-description');
        
        if (!titleInput) return;
        
        const title = titleInput.value.trim();
        const categoryId = categorySelect ? categorySelect.value : '';
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        
        if (!title) {
            alert('Quiz title is required');
            return;
        }
        
        const quizId = this.getAttribute('quiz-id');
        const isNew = !quizId;
        
        const quizData = {
            quiz_title: title,
            quiz_description: description || null,
            category_id: categoryId || null
        };
        
        this.dispatchEvent(new CustomEvent('quiz-submit', {
            detail: {
                quiz: quizData,
                isNew
            },
            bubbles: true,
            composed: true
        }));
    }
    
    set categories(value) {
        if (Array.isArray(value)) {
            this._categories = value;
            this.render();
        }
    }
    
    get categories() {
        return this._categories;
    }
    
    setQuizData(quiz) {
        this._quizData = {
            quiz_title: quiz.quiz_title || '',
            quiz_description: quiz.quiz_description || '',
            category_id: quiz.category_id || ''
        };
        
        this.render();
    }
}

customElements.define('quiz-form', QuizForm);

export default QuizForm;