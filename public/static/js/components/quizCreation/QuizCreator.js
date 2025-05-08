import "./QuizForm.js";
import "./QuestionList.js";
import "./QuestionForm.js";
import "./AnswerList.js";

class QuizCreator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.quizId = localStorage.getItem('selected_quiz_id');
        this.quizTitle = localStorage.getItem('selected_quiz_title');
        this.isEditing = !!this.quizId;
        this.currentQuestionId = localStorage.getItem('current_question_id') || null;
        
        this.viewMode = this.isEditing ? 'questions' : 'quiz';
        
        this.categories = [];
        this.difficulties = [];
        this.questions = [];
        
        this.changeView = this.changeView.bind(this);
        this.handleQuizSubmit = this.handleQuizSubmit.bind(this);
        this.handleQuestionSubmit = this.handleQuestionSubmit.bind(this);
        this.handleEditQuestion = this.handleEditQuestion.bind(this);
        this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);
        this.handleManageAnswers = this.handleManageAnswers.bind(this);
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        
        this.checkAuthorization();
    }
    
    disconnectedCallback() {
        if (this.viewMode === 'questions' || this.viewMode === 'quiz') {
            localStorage.removeItem('current_question_id');
            localStorage.removeItem('current_question_text');
        }
    }
    
    async checkAuthorization() {
        const authService = window.authService;
        
        try {
            const isAuthenticated = await authService.checkAuthentication();
            if (!isAuthenticated) {
                window.location.href = '/login';
                return;
            }

            if (!authService.isQuizMaster()) {
                window.location.href = '/home';
                return;
            }
            
            await this.loadInitialData();
            
        } catch (error) {
            console.error('Error checking authentication:', error);
            window.location.href = '/login';
        }
    }
    
    async loadInitialData() {
        try {
            if (this.isEditing) {
                await this.loadQuizData();
            }
            
            await Promise.all([
                this.loadCategories(),
                this.loadDifficulties()
            ]);
            
            if (this.isEditing && this.viewMode === 'questions') {
                await this.loadQuestions();
            }
            
            this.updateStepIndicators();
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showNotification('Failed to load data. Please try again later.', 'error');
        }
    }

    async loadCategories() {
        try {
            const categoryService = window.categoryService;
            if (!categoryService) {
                console.warn("Category service not available");
                return;
            }
            
            this.categories = await categoryService.getAllCategories();
            
            const quizForm = this.shadowRoot.querySelector('#quiz-form');
            if (quizForm) {
                setTimeout(() => {
                    quizForm.categories = this.categories;
                }, 0);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showNotification('Failed to load categories. Please try again.', 'error');
        }
    }
    
    async loadDifficulties() {
        try {
            const difficultyService = window.difficultyService;
            if (!difficultyService) {
                console.warn("Difficulty service not available");
                return;
            }
            
            this.difficulties = await difficultyService.getAllDifficultyLevels();
            
            const questionForm = this.shadowRoot.querySelector('#question-form');
            if (questionForm) {
                setTimeout(() => {
                    questionForm.difficulties = this.difficulties;
                }, 0);
            }
        } catch (error) {
            console.error('Error loading difficulties:', error);
            this.showNotification('Failed to load difficulty levels. Please try again.', 'error');
        }
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .quiz-creator {
                    width: 100%;
                    min-height: calc(100vh - 8rem);
                    background-color: var(--gray-100);
                }
                
                .creator-container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                }
                
                .creator-sidebar {
                    width: 16rem;
                    background-color: white;
                    border-right: 0.0625rem solid var(--gray-200);
                    padding: 2rem 1rem;
                    display: flex;
                    flex-direction: column;
                }
                
                .step-indicator {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    padding: 0.5rem;
                    border-radius: 0.25rem;
                    transition: background-color 0.2s;
                }
                
                .step-indicator.active {
                    background-color: var(--gray-100);
                }
                
                .step-number {
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    background-color: var(--gray-200);
                    color: var(--gray-700);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                
                .step-indicator.active .step-number {
                    background-color: var(--primary);
                    color: white;
                }
                
                .step-indicator.completed .step-number {
                    background-color: var(--success);
                    color: white;
                }
                
                .step-label {
                    font-weight: 500;
                    color: var(--gray-700);
                }
                
                .step-indicator.active .step-label {
                    color: var(--gray-900);
                    font-weight: 600;
                }
                
                .step-connector {
                    width: 0.125rem;
                    height: 2rem;
                    background-color: var(--gray-200);
                    margin-left: 1rem;
                }
                
                .sidebar-actions {
                    margin-top: auto;
                    padding-top: 2rem;
                }
                
                .creator-content {
                    flex: 1;
                    padding: 2rem;
                    overflow-x: auto;
                }
                
                .creator-view {
                    width: 100%;
                }
                
                .creator-view.hidden {
                    display: none;
                }
                
                .creator-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .creator-header h1 {
                    margin: 0;
                    font-size: 1.75rem;
                }
                
                .creator-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.5rem 1rem;
                    border-radius: 0.25rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    text-decoration: none;
                    font-family: inherit;
                }
                
                .primary-btn {
                    background-color: var(--primary);
                    color: white;
                }
                
                .primary-btn:hover {
                    background-color: var(--primary-dark);
                }
                
                .secondary-btn {
                    background-color: var(--gray-200);
                    color: var(--gray-700);
                }
                
                .secondary-btn:hover {
                    background-color: var(--gray-300);
                }
                
                .questions-info {
                    background-color: var(--info-light);
                    color: var(--info-dark);
                    padding: 1rem;
                    border-radius: 0.25rem;
                    margin-bottom: 1.5rem;
                }
                
                .navigation-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                }
                
                .notification {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    padding: 1rem 1.5rem;
                    border-radius: 0.25rem;
                    color: white;
                    z-index: 1000;
                    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.15);
                    transition: opacity 0.3s, transform 0.3s;
                    opacity: 0;
                    transform: translateY(1rem);
                    pointer-events: none;
                }
                
                .notification.visible {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                }
                
                .notification.success {
                    background-color: var(--success);
                }
                
                .notification.error {
                    background-color: var(--error);
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
            </style>
            
            <main class="quiz-creator">
                <section class="creator-container">
                    <aside class="creator-sidebar">
                        <section class="step-indicator ${this.viewMode === 'quiz' ? 'active' : this.isEditing ? 'completed' : ''}">
                            <p class="step-number">1</p>
                            <p class="step-label">Quiz Details</p>
                        </section>
                        <section class="step-connector"></section>
                        <section class="step-indicator ${this.viewMode === 'questions' ? 'active' : ''}">
                            <p class="step-number">2</p>
                            <p class="step-label">Manage Questions</p>
                        </section>
                        <section class="step-connector"></section>
                        <section class="step-indicator ${this.viewMode === 'question-form' || this.viewMode === 'answers' ? 'active' : ''}">
                            <p class="step-number">3</p>
                            <p class="step-label">Question Details</p>
                        </section>
                        
                        <section class="sidebar-actions">
                            <a href="/admin" class="creator-btn secondary-btn" data-link>Back to Dashboard</a>
                        </section>
                    </aside>

                    <section class="creator-content">
                        <section id="quiz-form-container" class="creator-view ${this.viewMode === 'quiz' ? '' : 'hidden'}">
                            <header class="creator-header">
                                <h1>${this.isEditing ? 'Edit Quiz' : 'Create New Quiz'}</h1>
                            </header>
                            
                            <quiz-form 
                                id="quiz-form"
                                editing="${this.isEditing}"
                                quiz-id="${this.quizId || ''}"
                                quiz-title="${this.quizTitle || ''}"
                                @quiz-submit="${this.handleQuizSubmit}"
                            ></quiz-form>
                        </section>
                        
                        <section id="questions-container" class="creator-view ${this.viewMode === 'questions' ? '' : 'hidden'}">
                            <header class="creator-header">
                                <h1>Questions for <span id="current-quiz-title">${this.quizTitle || 'Quiz'}</span></h1>
                                <section id="quiz-status" class="quiz-status"></section>
                            </header>
                            
                            <section class="questions-info">
                                <p>Add at least 5 questions with 4 answer options each (1 correct) to make the quiz playable.</p>
                            </section>
                            
                            <questions-list 
                                id="questions-list" 
                                @add-question="${() => this.showQuestionForm()}"
                                @edit-question="${(e) => this.handleEditQuestion(e.detail.questionId)}"
                                @delete-question="${(e) => this.handleDeleteQuestion(e.detail.questionId)}"
                                @manage-answers="${(e) => this.handleManageAnswers(e.detail.questionId, e.detail.questionText)}"
                            ></questions-list>
                            
                            <section class="navigation-actions">
                                <button id="back-to-quiz-btn" class="creator-btn secondary-btn">Back to Quiz Details</button>
                                <a href="/admin" class="creator-btn primary-btn" data-link>Back to Dashboard</a>
                            </section>
                        </section>
                        
                        <section id="question-form-container" class="creator-view ${this.viewMode === 'question-form' ? '' : 'hidden'}">
                            <header class="creator-header">
                                <h1>${this.currentQuestionId ? 'Edit Question' : 'Add Question'}</h1>
                            </header>
                            
                            <question-form 
                                id="question-form"
                                editing="${!!this.currentQuestionId}"
                                question-id="${this.currentQuestionId || ''}"
                                quiz-id="${this.quizId || ''}"
                                @question-submit="${this.handleQuestionSubmit}"
                                @cancel="${() => this.showQuestionsView()}"
                            ></question-form>
                        </section>
                        
                        <section id="answers-container" class="creator-view ${this.viewMode === 'answers' ? '' : 'hidden'}">
                            <header class="creator-header">
                                <h1>Answers for Question</h1>
                                <section id="answer-status" class="answer-status"></section>
                            </header>
                            
                            <answers-list 
                                id="answers-list" 
                                question-id="${this.currentQuestionId || ''}"
                                @back-to-questions="${() => this.showQuestionsView()}"
                            ></answers-list>
                        </section>
                    </section>
                </section>
            </main>
            
            <section id="notification" class="notification"></section>
        `;
    }
    
    setupEventListeners() {
        const backToQuizBtn = this.shadowRoot.querySelector('#back-to-quiz-btn');
        if (backToQuizBtn) {
            backToQuizBtn.addEventListener('click', () => this.showQuizForm());
        }
        
        const links = this.shadowRoot.querySelectorAll('[data-link]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                localStorage.removeItem('current_question_id');
                localStorage.removeItem('current_question_text');
                
                window.history.pushState(null, null, link.getAttribute('href'));
                window.dispatchEvent(new PopStateEvent('popstate'));
            });
        });
    }
    
    async loadCategories() {
        try {
            const categoryService = window.categoryService;
            if (!categoryService) {
                console.warn("Category service not available");
                return;
            }
            
            this.categories = await categoryService.getAllCategories();
            
            const quizForm = this.shadowRoot.querySelector('#quiz-form');
            if (quizForm) {
                quizForm.categories = this.categories;
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showNotification('Failed to load categories. Please try again.', 'error');
        }
    }
    
    async loadDifficulties() {
        try {
            const difficultyService = window.difficultyService;
            if (!difficultyService) {
                console.warn("Difficulty service not available");
                return;
            }
            
            this.difficulties = await difficultyService.getAllDifficultyLevels();
            
            const questionForm = this.shadowRoot.querySelector('#question-form');
            if (questionForm) {
                questionForm.difficulties = this.difficulties;
            }
        } catch (error) {
            console.error('Error loading difficulties:', error);
            this.showNotification('Failed to load difficulty levels. Please try again.', 'error');
        }
    }
    
    async loadQuizData() {
        if (!this.quizId) return;
        
        try {
            const quizService = window.quizService;
            if (!quizService) {
                console.warn("Quiz service not available");
                return;
            }
            
            const quiz = await quizService.getQuizById(this.quizId);
            
            const quizForm = this.shadowRoot.querySelector('#quiz-form');
            if (quizForm) {
                quizForm.setQuizData(quiz);
            }
            
            const quizTitleElement = this.shadowRoot.querySelector('#current-quiz-title');
            if (quizTitleElement) {
                quizTitleElement.textContent = quiz.quiz_title;
            }
            
            this.quizTitle = quiz.quiz_title;
            localStorage.setItem('selected_quiz_title', this.quizTitle);
        } catch (error) {
            console.error('Error loading quiz data:', error);
            this.showNotification('Failed to load quiz data. Please try again.', 'error');
        }
    }
    
    async loadQuestions() {
        if (!this.quizId) return;
        
        try {
            const questionsList = this.shadowRoot.querySelector('#questions-list');
            if (!questionsList) return;
            
            questionsList.setLoading(true);
            
            if (!window.quizValidatorService) {
                console.warn("Quiz validator service not available");
                return;
            }
            
            const quizValidation = await window.quizValidatorService.validateQuiz(this.quizId);
            
            this.questions = quizValidation.questions;
            
            this.updateQuizStatus(quizValidation);
            
            questionsList.setQuestions(this.questions);
            questionsList.setLoading(false);
        } catch (error) {
            console.error('Error loading questions:', error);
            const questionsList = this.shadowRoot.querySelector('#questions-list');
            if (questionsList) {
                questionsList.setError('Error loading questions. Please try again later.');
                questionsList.setLoading(false);
            }
        }
    }
    
    updateQuizStatus(validation) {
        const statusContainer = this.shadowRoot.querySelector('#quiz-status');
        if (!statusContainer) return;
        
        const isValid = validation ? validation.is_valid : this.questions.filter(q => q.is_valid).length >= 5;
        const validQuestions = validation ? validation.valid_questions : this.questions.filter(q => q.is_valid).length;
        
        statusContainer.innerHTML = `
            <span class="status-badge ${isValid ? 'valid-status' : 'invalid-status'}">
                ${isValid ? 'Quiz Ready' : `Quiz Not Ready (${validQuestions}/5 valid questions)`}
            </span>
        `;
    }
    
    changeView(viewName) {
        this.viewMode = viewName;
        
        const views = this.shadowRoot.querySelectorAll('.creator-view');
        views.forEach(view => {
            view.classList.add('hidden');
        });
        
        const activeView = this.shadowRoot.querySelector(`#${viewName}-container`);
        if (activeView) {
            activeView.classList.remove('hidden');
        }
        
        this.updateStepIndicators();
    }
    
    showQuizForm() {
        this.changeView('quiz-form');
    }
    
    showQuestionsView() {
        this.changeView('questions');
        this.loadQuestions();
    }
    
    showQuestionForm() {
        this.currentQuestionId = null;
        localStorage.removeItem('current_question_id');
        localStorage.removeItem('current_question_text');
        
        const questionForm = this.shadowRoot.querySelector('#question-form');
        if (questionForm) {
            questionForm.reset();
            questionForm.setEditing(false);
        }
        
        this.changeView('question-form');
    }
    
    showAnswersView(questionId) {
        this.currentQuestionId = questionId;
        localStorage.setItem('current_question_id', questionId);
        
        const answersList = this.shadowRoot.querySelector('#answers-list');
        if (answersList) {
            answersList.setAttribute('question-id', questionId);
            answersList.loadAnswers();
        }
        
        this.changeView('answers');
    }
    
    updateStepIndicators() {
        const stepIndicators = this.shadowRoot.querySelectorAll('.step-indicator');
        
        stepIndicators.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index === 0) { 
                if (this.viewMode === 'quiz-form') {
                    step.classList.add('active');
                } else if (this.isEditing) {
                    step.classList.add('completed');
                }
            } else if (index === 1) { 
                if (this.viewMode === 'questions') {
                    step.classList.add('active');
                } else if (this.viewMode === 'question-form' || this.viewMode === 'answers') {
                    step.classList.add('completed');
                }
            } else if (index === 2) { 
                if (this.viewMode === 'question-form' || this.viewMode === 'answers') {
                    step.classList.add('active');
                }
            }
        });
    }
    
    async handleQuizSubmit(event) {
        const { quiz, isNew } = event.detail;
        
        try {
            const quizService = window.quizService;
            if (!quizService) {
                throw new Error('Quiz service not available');
            }
            
            if (isNew) {
                const newQuiz = await quizService.createQuiz(quiz);
                
                this.quizId = newQuiz.quiz_id;
                this.quizTitle = newQuiz.quiz_title;
                localStorage.setItem('selected_quiz_id', this.quizId);
                localStorage.setItem('selected_quiz_title', this.quizTitle);
                
                this.isEditing = true;
                
                this.showNotification('Quiz created successfully! Now you can add questions.');
            } else {
                await quizService.updateQuiz(this.quizId, quiz);
                
                this.quizTitle = quiz.quiz_title;
                localStorage.setItem('selected_quiz_title', this.quizTitle);
                
                const quizTitleElement = this.shadowRoot.querySelector('#current-quiz-title');
                if (quizTitleElement) {
                    quizTitleElement.textContent = this.quizTitle;
                }
                
                this.showNotification('Quiz updated successfully');
            }
            
            this.showQuestionsView();
            
        } catch (error) {
            console.error('Error saving quiz:', error);
            this.showNotification('Failed to save quiz: ' + (error.message || 'Unknown error'), 'error');
        }
    }
    
    async handleQuestionSubmit(event) {
        const { question, isNew } = event.detail;
        
        try {
            const questionService = window.questionService;
            if (!questionService) {
                throw new Error('Question service not available');
            }
            
            if (isNew) {
                const newQuestion = await questionService.createQuestion({
                    ...question,
                    quiz_id: this.quizId
                });
                
                this.currentQuestionId = newQuestion.question_id;
                this.showNotification('Question created successfully');
            } else {
                await questionService.updateQuestion(this.currentQuestionId, question);
                this.showNotification('Question updated successfully');
            }
            
            this.showAnswersView(this.currentQuestionId);
            
        } catch (error) {
            console.error('Error saving question:', error);
            this.showNotification('Failed to save question: ' + (error.message || 'Unknown error'), 'error');
        }
    }
    
    async handleEditQuestion(questionId) {
        try {
            const questionService = window.questionService;
            if (!questionService) {
                throw new Error('Question service not available');
            }
            
            const question = await questionService.getQuestionById(questionId);
            
            this.currentQuestionId = questionId;
            
            const questionForm = this.shadowRoot.querySelector('#question-form');
            if (questionForm) {
                questionForm.setQuestionData(question);
                questionForm.setEditing(true);
            }
            
            this.changeView('question-form');
            
        } catch (error) {
            console.error('Error loading question:', error);
            this.showNotification('Failed to load question: ' + (error.message || 'Unknown error'), 'error');
        }
    }
    
    async handleDeleteQuestion(questionId) {
        try {
            const questionService = window.questionService;
            if (!questionService) {
                throw new Error('Question service not available');
            }
            
            if (!confirm('Are you sure you want to delete this question? All associated answers will be deleted as well.')) {
                return;
            }
            
            await questionService.deleteQuestion(questionId);
            
            this.showNotification('Question deleted successfully');
            
            await this.loadQuestions();
            
        } catch (error) {
            console.error('Error deleting question:', error);
            this.showNotification('Failed to delete question: ' + (error.message || 'Unknown error'), 'error');
        }
    }
    
    handleManageAnswers(questionId, questionText) {
        this.currentQuestionId = questionId;
        localStorage.setItem('current_question_id', questionId);
        
        if (questionText) {
            localStorage.setItem('current_question_text', questionText);
        }
        
        this.showAnswersView(questionId);
    }
    
    showNotification(message, type = 'success') {
        const notification = this.shadowRoot.querySelector('#notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('visible');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 3000);
    }
}

customElements.define('quiz-creator', QuizCreator);

export default QuizCreator;