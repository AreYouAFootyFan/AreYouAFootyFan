import { StyleLoader } from "../../utils/cssLoader.js";
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
        this.styleSheet = new CSSStyleSheet();
        
        this.isEditing = false;
        this.questionId = null;
        this.quizId = null;
    }
    
    async connectedCallback() {
        await this.loadStyles();
        this.updateStateFromAttributes();
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
            this.updateStateFromAttributes();
            this.render();
        }
    }
    
    updateStateFromAttributes() {
        this.isEditing = this.getAttribute('editing') === 'true';
        this.questionId = this.getAttribute('question-id') || null;
        this.quizId = this.getAttribute('quiz-id') || null;
    }
    
    async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/quizCreation/questionForm.css'
        );
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const form = document.createElement('form');
        form.className = 'creator-form';
        form.addEventListener('submit', this.handleSubmit.bind(this));
        
        const questionTextGroup = document.createElement('section');
        questionTextGroup.className = 'form-group';
        
        const questionTextLabel = document.createElement('label');
        questionTextLabel.setAttribute('for', 'question-text');
        questionTextLabel.textContent = 'Question Text';
        
        const questionTextArea = document.createElement('textarea');
        questionTextArea.id = 'question-text';
        questionTextArea.rows = 2;
        questionTextArea.required = true;
        questionTextArea.placeholder = 'Enter your question';
        questionTextArea.maxLength = 256;
        questionTextArea.value = this._questionData.question_text || '';
        
        const questionTextHelp = document.createElement('p');
        questionTextHelp.className = 'form-help';
        questionTextHelp.textContent = 'Maximum 256 characters';
        
        questionTextGroup.appendChild(questionTextLabel);
        questionTextGroup.appendChild(questionTextArea);
        questionTextGroup.appendChild(questionTextHelp);
        
        const difficultyGroup = document.createElement('section');
        difficultyGroup.className = 'form-group';
        
        const difficultyLabel = document.createElement('label');
        difficultyLabel.setAttribute('for', 'question-difficulty');
        difficultyLabel.textContent = 'Difficulty Level';
        
        const difficultySelect = document.createElement('select');
        difficultySelect.id = 'question-difficulty';
        difficultySelect.required = true;
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select difficulty --';
        difficultySelect.appendChild(defaultOption);
        
        this._difficulties.forEach(difficulty => {
            const option = document.createElement('option');
            option.value = difficulty.difficulty_id;
            option.textContent = `${difficulty.difficulty_level} (${difficulty.time_limit_seconds}s, +${difficulty.points_on_correct}/${difficulty.points_on_incorrect})`;
            
            if (this._questionData.difficulty_id == difficulty.difficulty_id) {
                option.selected = true;
            }
            
            difficultySelect.appendChild(option);
        });
        
        difficultyGroup.appendChild(difficultyLabel);
        difficultyGroup.appendChild(difficultySelect);
        
        const formActions = document.createElement('section');
        formActions.className = 'form-actions';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.id = 'cancel-btn';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('cancel', {
                bubbles: true,
                composed: true
            }));
        });
        
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-primary';
        submitBtn.textContent = this.isEditing ? 'Update Question' : 'Continue to Add Answers';
        
        if (this.isEditing) {
            const modeIndicator = document.createElement('p');
            modeIndicator.style.color = 'var(--primary)';
            modeIndicator.style.fontWeight = 'bold';
            modeIndicator.textContent = `Editing question ID: ${this.questionId}`;
            form.appendChild(modeIndicator);
        }
        
        formActions.appendChild(cancelBtn);
        formActions.appendChild(submitBtn);
        
        form.appendChild(questionTextGroup);
        form.appendChild(difficultyGroup);
        form.appendChild(formActions);
        
        this.shadowRoot.appendChild(form);
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
        
        const isNew = !this.isEditing || !this.questionId;
        
        const questionData = {
            question_text: text,
            difficulty_id: difficultyId
        };
        
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
        this.isEditing = isEditing;
        this.setAttribute('editing', isEditing.toString());
    }
    
    reset() {
        this._questionData = {
            question_text: '',
            difficulty_id: ''
        };
        this.isEditing = false;
        this.questionId = null;
        
        this.setAttribute('editing', 'false');
        this.removeAttribute('question-id');
        
        this.render();
    }
}

customElements.define('question-form', QuestionForm);

export default QuestionForm;