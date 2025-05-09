import "./QuizForm.js";
import "./QuestionList.js";
import "./QuestionForm.js";
import "./AnswerList.js";
import { StyleLoader } from "../../utils/cssLoader.js";
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
        
        this.styleSheet = new CSSStyleSheet();
    }

    async connectedCallback() {
        await this.loadStyles();
        this.render();
        this.checkAuthorization();
    }
    
    disconnectedCallback() {
        if (this.viewMode === 'questions' || this.viewMode === 'quiz') {
            localStorage.removeItem('current_question_id');
            localStorage.removeItem('current_question_text');
        }
        localStorage.removeItem('selected_quiz_id');
        localStorage.removeItem('selected_quiz_title');
    }
    
    async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/quizCreation/quizCreator.css'
        );
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }

        this.quizId = localStorage.getItem('selected_quiz_id');
        console.log(this.quizId);
        this.quizTitle = localStorage.getItem('selected_quiz_title');
        this.isEditing = !!this.quizId;
        
        const main = document.createElement('main');
        main.className = 'quiz-creator';
        
        const creatorContainer = document.createElement('section');
        creatorContainer.className = 'creator-container';
        
        const sidebar = this.createSidebar();
        creatorContainer.appendChild(sidebar);
        
        const creatorContent = document.createElement('section');
        creatorContent.className = 'creator-content';
        
        creatorContent.appendChild(this.createQuizFormView());
        creatorContent.appendChild(this.createQuestionsView());
        creatorContent.appendChild(this.createQuestionFormView());
        creatorContent.appendChild(this.createAnswersView());
        
        creatorContainer.appendChild(creatorContent);
        main.appendChild(creatorContainer);
        
        const notification = document.createElement('section');
        notification.id = 'notification';
        notification.className = 'notification';
        
        this.shadowRoot.appendChild(main);
        this.shadowRoot.appendChild(notification);
        
        this.setupEventListeners();
    }
    
    createSidebar() {
        const sidebar = document.createElement('aside');
        sidebar.className = 'creator-sidebar';
        
        // Create navigation container that holds both steps and button
        const navigationContainer = document.createElement('section');
        navigationContainer.className = 'creator-navigation';
        
        // Create steps container
        const stepsContainer = document.createElement('section');
        stepsContainer.className = 'sidebar-steps';
        
        // Step 1
        const step1 = document.createElement('section');
        step1.className = `step-indicator ${this.viewMode === 'quiz' ? 'active' : this.isEditing ? 'completed' : ''}`;
        
        const step1Number = document.createElement('p');
        step1Number.className = 'step-number';
        step1Number.textContent = '1';
        
        const step1Label = document.createElement('p');
        step1Label.className = 'step-label';
        step1Label.textContent = 'Quiz Details';
        
        step1.appendChild(step1Number);
        step1.appendChild(step1Label);
        stepsContainer.appendChild(step1);
        
        // Step 2
        const step2 = document.createElement('section');
        step2.className = `step-indicator ${this.viewMode === 'questions' ? 'active' : ''}`;
        
        const step2Number = document.createElement('p');
        step2Number.className = 'step-number';
        step2Number.textContent = '2';
        
        const step2Label = document.createElement('p');
        step2Label.className = 'step-label';
        step2Label.textContent = 'Manage Questions';
        
        step2.appendChild(step2Number);
        step2.appendChild(step2Label);
        stepsContainer.appendChild(step2);
        
        // Step 3
        const step3 = document.createElement('section');
        step3.className = `step-indicator ${this.viewMode === 'question-form' || this.viewMode === 'answers' ? 'active' : ''}`;
        
        const step3Number = document.createElement('p');
        step3Number.className = 'step-number';
        step3Number.textContent = '3';
        
        const step3Label = document.createElement('p');
        step3Label.className = 'step-label';
        step3Label.textContent = 'Question Details';
        
        step3.appendChild(step3Number);
        step3.appendChild(step3Label);
        stepsContainer.appendChild(step3);
        
        // Back to Dashboard button now in the navigation container
        const sidebarActions = document.createElement('section');
        sidebarActions.className = 'sidebar-actions';
                
        // Append both steps and actions to the navigation container
        navigationContainer.appendChild(stepsContainer);
        navigationContainer.appendChild(sidebarActions);
        
        // Append navigation container to sidebar
        sidebar.appendChild(navigationContainer);
        
        return sidebar;
    }
    
    createQuizFormView() {
        const quizFormContainer = document.createElement('section');
        quizFormContainer.id = 'quiz-form-container';
        quizFormContainer.className = `creator-view ${this.viewMode === 'quiz' ? '' : 'hidden'}`;
        
        const header = document.createElement('header');
        header.className = 'creator-header';
        
        const h1 = document.createElement('h1');
        h1.textContent = this.isEditing ? 'Edit Quiz' : 'Create New Quiz';
        header.appendChild(h1);
        
        quizFormContainer.appendChild(header);
        
        const quizForm = document.createElement('quiz-form');
        quizForm.id = 'quiz-form';
        quizForm.setAttribute('editing', this.isEditing.toString());
        console.log(this.quizId)
        quizForm.setAttribute('quiz-id', this.quizId || '');
        quizForm.setAttribute('quiz-title', this.quizTitle || '');
        
        quizForm.addEventListener('quiz-submit', this.handleQuizSubmit);
        
        quizFormContainer.appendChild(quizForm);
        
        return quizFormContainer;
    }
    
    createQuestionsView() {
        const questionsContainer = document.createElement('section');
        questionsContainer.id = 'questions-container';
        questionsContainer.className = `creator-view ${this.viewMode === 'questions' ? '' : 'hidden'}`;
        
        const header = document.createElement('header');
        header.className = 'creator-header';
        
        const h1 = document.createElement('h1');
        h1.textContent = 'Questions for ';
        
        const titleSpan = document.createElement('span');
        titleSpan.id = 'current-quiz-title';
        titleSpan.textContent = this.quizTitle || 'Quiz';
        h1.appendChild(titleSpan);
        
        const quizStatus = document.createElement('section');
        quizStatus.id = 'quiz-status';
        quizStatus.className = 'quiz-status';
        
        header.appendChild(h1);
        header.appendChild(quizStatus);
        questionsContainer.appendChild(header);
        
        const questionsInfo = document.createElement('section');
        questionsInfo.className = 'questions-info';
        
        const infoText = document.createElement('p');
        infoText.textContent = 'Add at least 5 questions with 4 answer options each (1 correct) to make the quiz playable.';
        questionsInfo.appendChild(infoText);
        
        questionsContainer.appendChild(questionsInfo);
        
        const questionsList = document.createElement('questions-list');
        questionsList.id = 'questions-list';
        
        questionsList.addEventListener('add-question', () => this.showQuestionForm());
        questionsList.addEventListener('edit-question', (e) => this.handleEditQuestion(e.detail.questionId));
        questionsList.addEventListener('delete-question', (e) => this.handleDeleteQuestion(e.detail.questionId));
        questionsList.addEventListener('manage-answers', (e) => this.handleManageAnswers(e.detail.questionId, e.detail.questionText));
        
        questionsContainer.appendChild(questionsList);
        
        const navActions = document.createElement('section');
        navActions.className = 'navigation-actions';
        
        if(this.isEditing){
            const backBtn = document.createElement('button');
            backBtn.id = 'back-to-quiz-btn';
            backBtn.className = 'creator-btn secondary-btn';
            backBtn.textContent = 'Back to Quiz Details';
            backBtn.addEventListener('click', () => this.showQuizForm());
            navActions.appendChild(backBtn);
        }
        
        const dashboardLink = document.createElement('a');
        dashboardLink.href = '/admin';
        dashboardLink.className = 'creator-btn primary-btn';
        dashboardLink.dataset.link = '';
        dashboardLink.textContent = 'Back to Dashboard';
        navActions.appendChild(dashboardLink);
        questionsContainer.appendChild(navActions);
        
        return questionsContainer;
    }
    
   createQuestionFormView() {
    const questionFormContainer = document.createElement('section');
    questionFormContainer.id = 'question-form-container';
    questionFormContainer.className = `creator-view ${this.viewMode === 'question-form' ? '' : 'hidden'}`;
    
    const header = document.createElement('header');
    header.className = 'creator-header';
    
    const questionId = this.currentQuestionId || localStorage.getItem('current_question_id');
    const isEditing = !!questionId;
    
    console.log(`Creating question form view. Question ID: ${questionId}, isEditing: ${isEditing}`);
    
    const h1 = document.createElement('h1');
    h1.textContent = isEditing ? 'Edit Question' : 'Add Question';
    header.appendChild(h1);
    
    questionFormContainer.appendChild(header);
    
    if (isEditing) {
        const debugInfo = document.createElement('p');
        debugInfo.style.color = 'var(--info)';
        debugInfo.style.padding = '0.5rem';
        debugInfo.textContent = `Editing Question ID: ${questionId}`;
        questionFormContainer.appendChild(debugInfo);
    }
    
    const questionForm = document.createElement('question-form');
    questionForm.id = 'question-form';
    
    questionForm.setAttribute('quiz-id', this.quizId || '');
    
    if (isEditing) {
        questionForm.setAttribute('editing', 'true');
        if (questionId) {
            questionForm.setAttribute('question-id', questionId);
        }
    } else {
        questionForm.setAttribute('editing', 'false');
    }
    
    questionForm.addEventListener('question-submit', this.handleQuestionSubmit);
    questionForm.addEventListener('cancel', () => this.showQuestionsView());
    
    questionFormContainer.appendChild(questionForm);
    
    return questionFormContainer;
}

    
    createAnswersView() {
        const answersContainer = document.createElement('section');
        answersContainer.id = 'answers-container';
        answersContainer.className = `creator-view ${this.viewMode === 'answers' ? '' : 'hidden'}`;
        
        const header = document.createElement('header');
        header.className = 'creator-header';
        
        const h1 = document.createElement('h1');
        h1.textContent = 'Answers for Question';
        
        const answerStatus = document.createElement('section');
        answerStatus.id = 'answer-status';
        answerStatus.className = 'answer-status';
        
        header.appendChild(h1);
        header.appendChild(answerStatus);
        answersContainer.appendChild(header);
        
        const answersList = document.createElement('answers-list');
        answersList.id = 'answers-list';
        answersList.setAttribute('question-id', this.currentQuestionId || '');
        answersList.addEventListener('back-to-questions', () => this.showQuestionsView());
        
        answersContainer.appendChild(answersList);
        
        return answersContainer;
    }
    
    setupEventListeners() {
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
        
        while (statusContainer.firstChild) {
            statusContainer.removeChild(statusContainer.firstChild);
        }
        
        let isValid = false;
        let validQuestions = 0;
        let validationMessage = '';
        
        if (validation) {
            isValid = validation.is_valid;
            validQuestions = validation.valid_questions;
            
            const hasInvalidAnswers = validation.questions && 
                validation.questions.some(q => 
                    !q.is_valid && 
                    q.validation_messages && 
                    q.validation_messages.some(msg => msg.includes('answer'))
                );
                
            if (hasInvalidAnswers) {
                isValid = false;
                validationMessage = 'Some questions have invalid answers';
            }
        } else {
            validQuestions = this.questions.filter(q => q.is_valid).length;
            isValid = validQuestions >= 5 && 
                    !this.questions.some(q => 
                        !q.is_valid && 
                        q.validation_messages && 
                        q.validation_messages.some(msg => msg.includes('answer'))
                    );
        }
        
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge ${isValid ? 'status-valid' : 'status-invalid'}`;
        
        if (isValid) {
            statusBadge.textContent = 'Quiz Ready';
        } else if (validationMessage) {
            statusBadge.textContent = `Quiz Not Ready (${validationMessage})`;
        } else {
            statusBadge.textContent = `Quiz Not Ready (${validQuestions}/5 valid questions)`;
        }
        
        statusContainer.appendChild(statusBadge);
    }
    
    changeView(viewName) {
        this.viewMode = viewName;
        
        const views = this.shadowRoot.querySelectorAll('.creator-view');
        views.forEach(view => {
            if (view.id === `${viewName}-container`) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        });
        
        this.updateStepIndicators();
    }
    
    updateStepIndicators() {
        const stepIndicators = this.shadowRoot.querySelectorAll('.step-indicator');
        
        stepIndicators.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index === 0) { 
                if (this.viewMode === 'quiz') {
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
            if (typeof answersList.loadAnswers === 'function') {
                answersList.loadAnswers();
            }
        }
        
        this.changeView('answers');
    }
    
    async handleQuizSubmit(event) {
        console.log('QuizCreator: handleQuizSubmit called', event.detail);
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
    console.log('QuizCreator: handleQuestionSubmit called', event.detail);
    const { question, isNew } = event.detail;
    
    try {
        const questionService = window.questionService;
        if (!questionService) {
            throw new Error('Question service not available');
        }
        
        const questionId = this.currentQuestionId;
        
        console.log('Current question state:', {
            isNew,
            questionId,
            localStorageId: localStorage.getItem('current_question_id'),
            question
        });
        
        if (isNew || !questionId) {
            console.log('Creating new question with data:', question);
            const newQuestion = await questionService.createQuestion({
                ...question,
                quiz_id: this.quizId
            });
            
            this.currentQuestionId = newQuestion.question_id;
            localStorage.setItem('current_question_id', newQuestion.question_id);
            console.log(`Created question with ID ${newQuestion.question_id} and updated state`);
            
            this.showNotification('Question created successfully');
        } else {
            console.log(`Updating question ${questionId} with data:`, question);
            await questionService.updateQuestion(questionId, question);
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
        
        this.currentQuestionId = questionId;
        localStorage.setItem('current_question_id', questionId);
        
        const questionService = window.questionService;
        if (!questionService) {
            throw new Error('Question service not available');
        }
        
        const question = await questionService.getQuestionById(questionId);
        
        this.changeView('question-form');
        
        const questionForm = this.shadowRoot.querySelector('#question-form');
        if (questionForm) {
            questionForm.setAttribute('question-id', questionId);
            
            questionForm.setAttribute('editing', 'true');
            
            questionForm.setQuestionData(question);
            
        } else {
            console.error('Question form element not found!');
        }
        
    } catch (error) {
        console.error('Error loading question for editing:', error);
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
        
        while (notification.firstChild) {
            notification.removeChild(notification.firstChild);
        }
        
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('visible');
        
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 3000);
    }
}

customElements.define('quiz-creator', QuizCreator);

export default QuizCreator;