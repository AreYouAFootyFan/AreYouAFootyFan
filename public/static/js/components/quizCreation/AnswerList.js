import { StyleLoader } from "../../utils/cssLoader.js";
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
        this.styleSheet = new CSSStyleSheet();
        this.editingAnswerId = null;
    }
    
    async connectedCallback() {
        await this.loadStyles();
        this.render();
        this.loadAnswers();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'question-id' && oldValue !== newValue && newValue) {
            this.loadAnswers();
        }
    }
    
    async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/quizCreation/answerList.css'
        );
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const questionPreview = this.createQuestionPreview();
        this.shadowRoot.appendChild(questionPreview);
        
        const answersContent = document.createElement('section');
        answersContent.className = 'answers-content';
        
        if (this.loading) {
            answersContent.appendChild(this.createLoadingSection());
        } else if (this.error) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'error-message';
            errorMessage.textContent = this.error;
            answersContent.appendChild(errorMessage);
        } else if (this.answers.length === 0) {
            answersContent.appendChild(this.createEmptySection());
        } else {
            const answersList = document.createElement('section');
            answersList.className = 'answers-list';
            
            this.answers.forEach(answer => {
                answersList.appendChild(this.createAnswerCard(answer));
            });
            
            answersContent.appendChild(answersList);
        }
        
        if (this.showAnswerForm ) {
            answersContent.appendChild(this.createAnswerForm());
        }
        
        this.shadowRoot.appendChild(answersContent);
        
        const navigationActions = document.createElement('section');
        navigationActions.className = 'navigation-actions';
        
        const backButton = document.createElement('button');
        backButton.id = 'back-to-questions-btn';
        backButton.className = 'btn btn-secondary';
        backButton.textContent = 'Back to Questions';
        backButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('back-to-questions', {
                bubbles: true,
                composed: true
            }));
        });
        
        navigationActions.appendChild(backButton);
        this.shadowRoot.appendChild(navigationActions);
    }
    
    createQuestionPreview() {
        const questionPreview = document.createElement('article');
        questionPreview.className = 'question-preview';
        
        const questionText = document.createElement('h2');
        questionText.id = 'current-question-text';
        questionText.textContent = this.questionInfo?.question_text || 'Loading question...';
        
        questionPreview.appendChild(questionText);
        
        if (this.questionInfo) {
            const answerStatus = document.createElement('section');
            answerStatus.id = 'answer-status';
            answerStatus.className = 'answer-status';
            
            const statusBadge = document.createElement('p');
            statusBadge.className = `status-badge ${this.questionInfo.is_valid ? 'status-valid' : 'status-invalid'}`;
            statusBadge.textContent = this.questionInfo.is_valid 
                ? 'Valid question' 
                : this.questionInfo.validation_message || 'Invalid question';
            
            answerStatus.appendChild(statusBadge);
            questionPreview.appendChild(answerStatus);
        }
        
        return questionPreview;
    }
    
    createLoadingSection() {
        const loadingSection = document.createElement('section');
        loadingSection.className = 'loading';
        
        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner';
        
        const loadingText = document.createElement('p');
        loadingText.textContent = 'Loading answers...';
        
        loadingSection.appendChild(spinner);
        loadingSection.appendChild(loadingText);
        
        return loadingSection;
    }
    
    createEmptySection() {
        const emptyMessage = document.createElement('section');
        emptyMessage.className = 'empty-message';
        
        const title = document.createElement('h3');
        title.className = 'empty-title';
        title.textContent = 'No answers found';
        
        const message = document.createElement('p');
        message.className = 'empty-message-text';
        message.textContent = 'Add 4 answer options with 1 correct answer.';
        
        emptyMessage.appendChild(title);
        emptyMessage.appendChild(message);
        
        return emptyMessage;
    }
    
    createAnswerCard(answer) {
        const answerCard = document.createElement('article');
        answerCard.className = `answer-card ${answer.is_correct ? 'correct' : ''}`;
        answerCard.dataset.id = answer.answer_id;
        
        const contentSection = document.createElement('section');
        contentSection.className = 'answer-content';
        
        const marker = document.createElement('span');
        marker.className = 'answer-marker';
        marker.textContent = answer.is_correct ? '✓' : '';
        
        const text = document.createElement('p');
        text.className = 'answer-text';
        text.textContent = answer.answer_text;
        
        contentSection.appendChild(marker);
        contentSection.appendChild(text);
        
        const actionsSection = document.createElement('section');
        actionsSection.className = 'answer-actions';
        
        if (!answer.is_correct) {
            const markCorrectBtn = document.createElement('button');
            markCorrectBtn.className = 'action-btn mark-correct';
            markCorrectBtn.title = 'Mark as Correct';
            markCorrectBtn.dataset.id = answer.answer_id;
            
            const markIcon = document.createElement('span');
            markIcon.setAttribute('aria-hidden', 'true');
            markIcon.textContent = '✓';
            
            markCorrectBtn.appendChild(markIcon);
            markCorrectBtn.addEventListener('click', () => {
                this.handleMarkCorrect(answer.answer_id);
            });
            
            actionsSection.appendChild(markCorrectBtn);
        }
        
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-answer';
        editBtn.title = 'Edit Answer';
        editBtn.dataset.id = answer.answer_id;
        
        const editIcon = document.createElement('span');
        editIcon.setAttribute('aria-hidden', 'true');
        editIcon.textContent = '✏️';
        
        editBtn.appendChild(editIcon);
        editBtn.addEventListener('click', () => {
            this.handleEditAnswer(answer);
        });
        
        actionsSection.appendChild(editBtn);
        
        
        answerCard.appendChild(contentSection);
        answerCard.appendChild(actionsSection);
        
        return answerCard;
    }
    
    createAnswerForm() {
        const form = document.createElement('form');
        form.className = 'answer-form';
        form.id = 'add-answer-form';
        form.addEventListener('submit', this.handleAddAnswer.bind(this));
        
        const formTitle = document.createElement('h3');
        formTitle.id = 'form-title';
        formTitle.textContent = this.editingAnswerId ? 'Edit Answer Option' : 'Add Answer Option';
        
        const textGroup = document.createElement('section');
        textGroup.className = 'form-group';
        
        const textLabel = document.createElement('label');
        textLabel.setAttribute('for', 'answer-text');
        textLabel.textContent = 'Answer Text';
        
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.id = 'answer-text';
        textInput.required = true;
        textInput.placeholder = 'Enter answer option';
        textInput.maxLength = 128;
        
        const textHelp = document.createElement('p');
        textHelp.className = 'form-help';
        textHelp.textContent = 'Maximum 128 characters';
        
        textGroup.appendChild(textLabel);
        textGroup.appendChild(textInput);
        textGroup.appendChild(textHelp);
        
        const checkGroup = document.createElement('section');
        checkGroup.className = 'form-check';
        
        const checkInput = document.createElement('input');
        checkInput.type = 'checkbox';
        checkInput.id = 'answer-correct';
        
        const checkLabel = document.createElement('label');
        checkLabel.setAttribute('for', 'answer-correct');
        checkLabel.textContent = 'Mark as correct answer';
        
        checkGroup.appendChild(checkInput);
        checkGroup.appendChild(checkLabel);
        
        const formActions = document.createElement('section');
        formActions.className = 'form-actions';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.id = 'cancel-answer-btn';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => {
            this.cancelEdit();
        });
        
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.id = 'save-answer-btn';
        submitBtn.className = 'btn btn-primary';
        submitBtn.textContent = this.editingAnswerId ? 'Save Changes' : 'Save Answer';
        
        formActions.appendChild(cancelBtn);
        formActions.appendChild(submitBtn);
        
        form.appendChild(formTitle);
        form.appendChild(textGroup);
        form.appendChild(checkGroup);
        form.appendChild(formActions);
        
        if (this.editingAnswerId) {
            const answer = this.answers.find(a => a.answer_id === this.editingAnswerId);
            if (answer) {
                textInput.value = answer.answer_text;
                checkInput.checked = answer.is_correct;
                
                if (answer.is_correct) {
                    checkInput.disabled = true;
                }
            }
        }
        
        return form;
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
            
        } catch (error) {
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
            const answerService = window.answerService;
            if (!answerService) {
                throw new Error('Answer service not available');
            }
            
            if (this.editingAnswerId) {
                const currentAnswer = this.answers.find(a => a.answer_id === this.editingAnswerId);
                
                if (isCorrect && !currentAnswer.is_correct && this.answers.some(a => a.is_correct)) {
                    if (!confirm('This question already has a correct answer. Do you want to mark this as the new correct answer?')) {
                        return;
                    }
                }
                
                await answerService.updateAnswer(this.editingAnswerId, {
                    answer_text: text,
                    is_correct: isCorrect
                });
                
                if (isCorrect && !currentAnswer.is_correct) {
                    await answerService.markAsCorrect(this.editingAnswerId);
                }
                
                this.editingAnswerId = null;
            } else {
                if (isCorrect && this.answers.some(a => a.is_correct)) {
                    if (!confirm('This question already has a correct answer. Do you want to mark this as the new correct answer?')) {
                        return;
                    }
                }
                
                await answerService.createAnswer({
                    question_id: questionId,
                    answer_text: text,
                    is_correct: isCorrect
                });
            }
            
            textInput.value = '';
            correctCheckbox.checked = false;
            correctCheckbox.disabled = false;
            
            await this.loadAnswers();
            
        } catch (error) {
            alert('Failed to save answer: ' + (error.message || 'Unknown error'));
        }
    }
    
    handleEditAnswer(answer) {
        this.editingAnswerId = answer.answer_id;
        
        this.showAnswerForm = true;
        this.render();
        
        setTimeout(() => {
            const textInput = this.shadowRoot.querySelector('#answer-text');
            if (textInput) {
                textInput.focus();
            }
        }, 0);
    }
    
    cancelEdit() {
        const answerText = this.shadowRoot.querySelector('#answer-text');
        const answerCorrect = this.shadowRoot.querySelector('#answer-correct');
        
        if (answerText) answerText.value = '';
        if (answerCorrect) {
            answerCorrect.checked = false;
            answerCorrect.disabled = false;
        }
        
        this.editingAnswerId = null;
        this.showAnswerForm = false;
        
        const formTitle = this.shadowRoot.querySelector('#form-title');
        if (formTitle) formTitle.textContent = 'Add Answer Option';
        
        const saveBtn = this.shadowRoot.querySelector('#save-answer-btn');
        if (saveBtn) saveBtn.textContent = 'Save Answer';
        this.render();
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
            alert('Failed to mark answer as correct: ' + (error.message || 'Unknown error'));
        }
    }
}

customElements.define('answers-list', AnswersList);

export default AnswersList;