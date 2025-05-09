import { StyleLoader } from "../../utils/cssLoader.js";
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
        this.styleSheet = new CSSStyleSheet();
    }
    
    async connectedCallback() {
        await this.loadStyles();
        this.render();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
        
    if (name === 'editing') {
        this.isEditing = newValue === 'true';
    } else if (name === 'question-id') {
        this.questionId = newValue;
    } else if (name === 'quiz-id') {
        this.quizId = newValue;
    }
    
    if (this.isConnected) {
        this.render();
    }
}
    
    async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/quizCreation/quizform.css'
        );
    }
    
    render() {
        const isEditing = this.getAttribute('editing') === 'true';
        
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const form = document.createElement('form');
        form.className = 'creator-form';
        form.addEventListener('submit', this.handleSubmit.bind(this));
        
        const titleGroup = document.createElement('section');
        titleGroup.className = 'form-group';
        
        const titleLabel = document.createElement('label');
        titleLabel.setAttribute('for', 'quiz-title');
        titleLabel.textContent = 'Quiz Title';
        
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.id = 'quiz-title';
        titleInput.required = true;
        titleInput.placeholder = 'e.g. World Cup History';
        titleInput.maxLength = 64;
        titleInput.value = this._quizData.quiz_title || '';
        
        const titleHelp = document.createElement('p');
        titleHelp.className = 'form-help';
        titleHelp.textContent = 'Maximum 64 characters';
        
        titleGroup.appendChild(titleLabel);
        titleGroup.appendChild(titleInput);
        titleGroup.appendChild(titleHelp);
        
        const categoryGroup = document.createElement('section');
        categoryGroup.className = 'form-group';
        
        const categoryLabel = document.createElement('label');
        categoryLabel.setAttribute('for', 'quiz-category');
        categoryLabel.textContent = 'Category';
        
        const categorySelect = document.createElement('select');
        categorySelect.id = 'quiz-category';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select a category --';
        categorySelect.appendChild(defaultOption);
        
        this._categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_id;
            option.textContent = category.category_name;
            if (this._quizData.category_id == category.category_id) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });
        
        categoryGroup.appendChild(categoryLabel);
        categoryGroup.appendChild(categorySelect);
        
        const descGroup = document.createElement('section');
        descGroup.className = 'form-group';
        
        const descLabel = document.createElement('label');
        descLabel.setAttribute('for', 'quiz-description');
        descLabel.textContent = 'Description';
        
        const descTextarea = document.createElement('textarea');
        descTextarea.id = 'quiz-description';
        descTextarea.rows = 3;
        descTextarea.placeholder = 'Describe what this quiz is about';
        descTextarea.maxLength = 128;
        descTextarea.textContent = this._quizData.quiz_description || '';
        
        const descHelp = document.createElement('p');
        descHelp.className = 'form-help';
        descHelp.textContent = 'Maximum 128 characters';
        
        descGroup.appendChild(descLabel);
        descGroup.appendChild(descTextarea);
        descGroup.appendChild(descHelp);
        
        const actions = document.createElement('section');
        actions.className = 'form-actions';
        
        const cancelLink = document.createElement('a');
        cancelLink.href = '/admin';
        cancelLink.className = 'btn btn-secondary';
        cancelLink.dataset.link = '';
        cancelLink.textContent = 'Cancel';
        cancelLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('current_question_id');
            localStorage.removeItem('current_question_text');
            window.history.pushState(null, null, cancelLink.getAttribute('href'));
            window.dispatchEvent(new PopStateEvent('popstate'));
        });
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-primary';
        submitButton.textContent = isEditing ? 'Save Changes' : 'Create Quiz';
        
        actions.appendChild(cancelLink);
        actions.appendChild(submitButton);
        
        form.appendChild(titleGroup);
        form.appendChild(categoryGroup);
        form.appendChild(descGroup);
        form.appendChild(actions);
        
        this.shadowRoot.appendChild(form);
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