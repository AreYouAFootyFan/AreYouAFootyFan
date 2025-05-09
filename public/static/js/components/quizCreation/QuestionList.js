class QuestionsList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.questions = [];
        this.loading = true;
        this.error = null;
        this.styleSheet = new CSSStyleSheet();
    }
    
    connectedCallback() {
        this.loadStyles();
        this.render();
    }
    
    async loadStyles() {        
        const cssText = await fetch('./static/css/quizCreation/questionList.css').then(r => r.text());
        this.styleSheet.replaceSync(cssText);
        this.shadowRoot.adoptedStyleSheets = [this.styleSheet];
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const actionBar = document.createElement('section');
        actionBar.className = 'action-bar';
        
        const addQuestionBtn = document.createElement('button');
        addQuestionBtn.id = 'add-question-btn';
        addQuestionBtn.className = 'btn btn-primary';
        addQuestionBtn.textContent = 'Add Question';
        addQuestionBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('add-question', {
                bubbles: true,
                composed: true
            }));
        });
        
        actionBar.appendChild(addQuestionBtn);
        this.shadowRoot.appendChild(actionBar);
        
        const questionsListContainer = document.createElement('section');
        questionsListContainer.className = 'questions-list';
        
        if (this.loading) {
            const loadingSection = this.createLoadingSection();
            questionsListContainer.appendChild(loadingSection);
        } else if (this.error) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'error-message';
            errorMessage.textContent = this.error;
            questionsListContainer.appendChild(errorMessage);
        } else if (this.questions.length === 0) {
            const emptySection = this.createEmptySection();
            questionsListContainer.appendChild(emptySection);
        } else {
            this.questions.forEach((question, index) => {
                const questionCard = this.createQuestionCard(question, index);
                questionsListContainer.appendChild(questionCard);
            });
        }
        
        this.shadowRoot.appendChild(questionsListContainer);
    }
    
    createLoadingSection() {
        const loadingSection = document.createElement('section');
        loadingSection.className = 'loading';
        
        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner';
        
        const loadingText = document.createElement('p');
        loadingText.textContent = 'Loading questions...';
        
        loadingSection.appendChild(spinner);
        loadingSection.appendChild(loadingText);
        
        return loadingSection;
    }
    
    createEmptySection() {
        const emptySection = document.createElement('section');
        emptySection.className = 'empty-message';
        
        const title = document.createElement('h3');
        title.className = 'empty-title';
        title.textContent = 'No questions found';
        
        const message = document.createElement('p');
        message.className = 'empty-message-text';
        message.textContent = 'Add your first question to get started.';
        
        emptySection.appendChild(title);
        emptySection.appendChild(message);
        
        return emptySection;
    }
    
    createQuestionCard(question, index) {
        const isValid = question.is_valid;
        const statusClass = isValid ? 'status-valid' : 'status-invalid';
        
        const statusText = question.validation_messages && question.validation_messages.length > 0 
            ? question.validation_messages[0]
            : isValid ? 'Valid question' : 'Invalid question';
        
        const questionCard = document.createElement('article');
        questionCard.className = 'question-card';
        questionCard.dataset.id = question.question_id;
        
        const cardHeader = document.createElement('header');
        cardHeader.className = 'card-header';
        
        const cardTitle = document.createElement('h3');
        cardTitle.textContent = `Question ${index + 1}`;
        
        const actionSection = document.createElement('section');
        actionSection.className = 'question-actions';
        
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'action-btn edit-question';
        editButton.title = 'Edit Question';
        editButton.dataset.id = question.question_id;
        
        const editIcon = document.createElement('span');
        editIcon.setAttribute('aria-hidden', 'true');
        editIcon.textContent = '✏️';
        
        editButton.appendChild(editIcon);
        editButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('edit-question', {
                detail: { questionId: question.question_id },
                bubbles: true,
                composed: true
            }));
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'action-btn delete-question';
        deleteButton.title = 'Delete Question';
        deleteButton.dataset.id = question.question_id;
        
        const deleteIcon = document.createElement('span');
        deleteIcon.setAttribute('aria-hidden', 'true');
        deleteIcon.textContent = '🗑️';
        
        deleteButton.appendChild(deleteIcon);
        deleteButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete-question', {
                detail: { questionId: question.question_id },
                bubbles: true,
                composed: true
            }));
        });
        
        actionSection.appendChild(editButton);
        actionSection.appendChild(deleteButton);
        
        cardHeader.appendChild(cardTitle);
        cardHeader.appendChild(actionSection);
        
        const cardContent = document.createElement('section');
        cardContent.className = 'card-content';
        
        const questionText = document.createElement('p');
        questionText.className = 'question-text';
        questionText.textContent = question.question_text;
        
        const questionMeta = document.createElement('section');
        questionMeta.className = 'question-meta';
        
        const difficultyBadge = document.createElement('span');
        difficultyBadge.className = 'difficulty-badge';
        difficultyBadge.textContent = question.difficulty_level;
        
        const statusBadge = document.createElement('span');
        statusBadge.className = `question-status ${statusClass}`;
        statusBadge.textContent = statusText;
        
        questionMeta.appendChild(difficultyBadge);
        questionMeta.appendChild(statusBadge);
        
        cardContent.appendChild(questionText);
        cardContent.appendChild(questionMeta);
        
        const cardFooter = document.createElement('footer');
        cardFooter.className = 'card-footer';
        
        const manageAnswersBtn = document.createElement('button');
        manageAnswersBtn.type = 'button';
        manageAnswersBtn.className = 'btn btn-secondary manage-answers';
        manageAnswersBtn.dataset.id = question.question_id;
        manageAnswersBtn.dataset.text = question.question_text;
        manageAnswersBtn.textContent = 'Manage Answers';
        
        manageAnswersBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('manage-answers', {
                detail: { 
                    questionId: question.question_id,
                    questionText: question.question_text
                },
                bubbles: true,
                composed: true
            }));
        });
        
        cardFooter.appendChild(manageAnswersBtn);
        
        questionCard.appendChild(cardHeader);
        questionCard.appendChild(cardContent);
        questionCard.appendChild(cardFooter);
        
        return questionCard;
    }
    
    setQuestions(questions) {
        this.questions = questions;
        this.render();
    }
    
    setLoading(isLoading) {
        this.loading = isLoading;
        this.render();
    }
    
    setError(errorMessage) {
        this.error = errorMessage;
        this.render();
    }
}

customElements.define('questions-list', QuestionsList);

export default QuestionsList;