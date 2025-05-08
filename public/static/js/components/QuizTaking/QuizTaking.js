class QuizTaking extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.quizId = localStorage.getItem('selected_quiz_id');
        this.quizData = null;
        this.attempt = null;
        this.currentQuestionIndex = 0;
        this.currentQuestion = null;
        this.selectedAnswer = null;
        this.timer = null;
        this.timeLeft = 0;
        this.score = 0;
        this.isQuizCompleted = false;
    }

    connectedCallback() {
        this.render();
        this.init();
        
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        window.addEventListener('beforeunload', this.cleanup.bind(this));
    }
    
    disconnectedCallback() {
        this.cleanup();
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: var(--font-sans, 'Inter', sans-serif);
                    color: var(--gray-800);
                    background-color: var(--gray-100);
                    min-height: calc(100vh - 4rem);
                }
                
                .quiz-container {
                    max-width: var(--container-max-width);
                    margin: 0 auto;
                    padding: 2rem 1rem;
                }
                
                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 50vh;
                    font-size: 1.125rem;
                    color: var(--gray-600);
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
                
                .error-container {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: var(--shadow);
                    padding: 2rem;
                    text-align: center;
                    max-width: 40rem;
                    margin: 2rem auto;
                }
                
                .error-message {
                    color: var(--error);
                    margin-bottom: 1.5rem;
                }
                
                .home-btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    font-weight: 500;
                    background-color: var(--primary);
                    color: white;
                    text-decoration: none;
                    display: inline-block;
                    transition: all var(--transition-fast);
                }
                
                .home-btn:hover {
                    background-color: var(--primary-dark);
                }
            </style>
            
            <main class="quiz-container">
                <section class="loading-container">
                    <span class="loading-spinner"></span>
                    <p>Loading quiz...</p>
                </section>
            </main>
        `;
    }
    
    async init() {
        const authService = window.authService;
        
        if (!authService || !authService.isAuthenticated()) {
            window.location.href = '/';
            return;
        }

        if (authService.isQuizMaster && authService.isQuizMaster()) {
            this.showError("Quiz Masters cannot take quizzes. Please use a Quiz Taker account.");
            return;
        }

        if (this.quizId) {
            await this.startQuiz(this.quizId);
        } else {
            this.showError("No quiz selected. Please go back to the home page and select a quiz.");
        }
    }
    
    cleanup() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseTimer();
        } else {
            this.resumeTimer();
        }
    }
    
    async startQuiz(quizId) {
        try {
            const quizAttemptService = window.quizAttemptService;
            
            const quizContainer = this.shadowRoot.querySelector('.quiz-container');
            if (quizContainer) {
                quizContainer.innerHTML = `
                    <section class="loading-container">
                        <span class="loading-spinner"></span>
                        <p>Loading quiz... Please wait.</p>
                    </section>
                `;
            }
            
            this.attempt = await quizAttemptService.startQuiz(quizId);
            
            this.quizData = {
                title: this.attempt.quiz_title,
                description: this.attempt.quiz_description,
                totalQuestions: this.attempt.questions.length
            };
            
            this.loadQuestion(0);
        } catch (error) {
            console.error('Error starting quiz:', error);
            this.showError(`Failed to start quiz: ${error.message || 'Unknown error'}`);
        }
    }
    
    loadQuestion(index) {
        if (!this.attempt || !this.attempt.questions || index >= this.attempt.questions.length) {
            this.completeQuiz();
            return;
        }
        
        this.currentQuestionIndex = index;
        this.currentQuestion = this.attempt.questions[index];
        this.selectedAnswer = null;
        
        this.timeLeft = this.currentQuestion.time_limit_seconds;
        
        this.renderQuestion();
        
        this.startTimer();
    }
    
    renderQuestion() {
        const quizContainer = this.shadowRoot.querySelector('.quiz-container');
        if (!quizContainer) return;
        
        const question = this.currentQuestion;
        
        const questionElement = document.createElement('quiz-question');
        questionElement.setAttribute('question-index', this.currentQuestionIndex);
        questionElement.setAttribute('total-questions', this.quizData.totalQuestions);
        questionElement.setAttribute('quiz-title', this.quizData.title);
        questionElement.setAttribute('score', this.score);
        questionElement.setAttribute('time-limit', this.timeLeft);
        questionElement.question = question;
        
        questionElement.addEventListener('answer-selected', (e) => this.selectAnswer(e.detail.answerId));
        questionElement.addEventListener('submit-answer', () => this.submitAnswer());
        
        quizContainer.innerHTML = '';
        quizContainer.appendChild(questionElement);
        
        this.startTimerUpdates(questionElement);
    }
    
    startTimerUpdates(questionElement) {
        const updateTimer = () => {
            if (questionElement) {
                questionElement.setAttribute('time-left', this.timeLeft);
                
                if (this.timeLeft <= 5) {
                    questionElement.setAttribute('timer-warning', 'true');
                } else {
                    questionElement.removeAttribute('timer-warning');
                }
            }
        };
        
        updateTimer();
        
        this.timerUpdateInterval = setInterval(updateTimer, 100);
    }
    
    selectAnswer(answerId) {
        this.selectedAnswer = parseInt(answerId);
        
        const questionElement = this.shadowRoot.querySelector('quiz-question');
        if (questionElement) {
            questionElement.setAttribute('selected-answer', answerId);
        }
    }
    
    async submitAnswer() {
        if (!this.selectedAnswer) return;
        
        try {
            this.pauseTimer();
            
            const questionElement = this.shadowRoot.querySelector('quiz-question');
            if (questionElement) {
                questionElement.setAttribute('submitting', 'true');
            }
            
            const userResponseService = window.userResponseService;
            
            if (!userResponseService && !window.quizAttemptService) {
                console.warn("Response services not available.");
                return;
            }
            
            let response;
            try {
                if (userResponseService) {
                    response = await userResponseService.submitResponse({
                        attempt_id: this.attempt.attempt_id,
                        question_id: this.currentQuestion.question_id,
                        answer_id: this.selectedAnswer
                    });
                } else {
                    response = await window.quizAttemptService.submitResponse({
                        attempt_id: this.attempt.attempt_id,
                        question_id: this.currentQuestion.question_id,
                        answer_id: this.selectedAnswer
                    });
                }
            } catch (e) {
                console.warn("API call failed.", e);
                return;
            }
            
            this.score += response.points_earned;
            
            this.showAnswerFeedback(response);
            
            this.updateActionButtons(response.quiz_completed || this.currentQuestionIndex === this.quizData.totalQuestions - 1);
        } catch (error) {
            console.error('Error submitting answer:', error);
            
            const questionElement = this.shadowRoot.querySelector('quiz-question');
            if (questionElement) {
                questionElement.setAttribute('submitting', 'false');
            }
            
            this.resumeTimer();
        }
    }
    
    showAnswerFeedback(response) {
        const questionElement = this.shadowRoot.querySelector('quiz-question');
        if (questionElement) {
            questionElement.setAttribute('show-feedback', 'true');
            questionElement.setAttribute('feedback-points', response.points_earned);
            questionElement.setAttribute('score', this.score);
            
            this.currentQuestion.answers.forEach(answer => {
                if (answer.is_correct) {
                    questionElement.setAttribute(`correct-answer-${answer.answer_id}`, 'true');
                }
            });
        }
    }
    
    updateActionButtons(quizCompleted) {
        const questionElement = this.shadowRoot.querySelector('quiz-question');
        if (!questionElement) return;
        
        if (quizCompleted || this.currentQuestionIndex >= this.quizData.totalQuestions - 1) {
            questionElement.setAttribute('show-results-button', 'true');
            questionElement.addEventListener('show-results', () => this.completeQuiz());
        } else {
            questionElement.setAttribute('show-next-button', 'true');
            questionElement.addEventListener('next-question', () => this.loadQuestion(this.currentQuestionIndex + 1));
        }
    }
    
    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeUp();
            }
        }, 1000);
    }
    
    pauseTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        if (this.timerUpdateInterval) {
            clearInterval(this.timerUpdateInterval);
            this.timerUpdateInterval = null;
        }
    }
    
    resumeTimer() {
        if (!this.timer && this.timeLeft > 0 && !this.selectedAnswer) {
            this.startTimer();
            
            const questionElement = this.shadowRoot.querySelector('quiz-question');
            if (questionElement) {
                this.startTimerUpdates(questionElement);
            }
        }
    }
    
    handleTimeUp() {
        const questionElement = this.shadowRoot.querySelector('quiz-question');
        if (!questionElement) return;
        
        if (this.selectedAnswer) {
            this.submitAnswer();
        } else {
            questionElement.setAttribute('time-up', 'true');
            
            this.currentQuestion.answers.forEach(answer => {
                if (answer.is_correct) {
                    questionElement.setAttribute(`correct-answer-${answer.answer_id}`, 'true');
                }
            });
            
            if (this.currentQuestionIndex >= this.quizData.totalQuestions - 1) {
                questionElement.setAttribute('show-results-button', 'true');
                questionElement.addEventListener('show-results', () => this.completeQuiz());
            } else {
                questionElement.setAttribute('show-next-button', 'true');
                questionElement.addEventListener('next-question', () => this.loadQuestion(this.currentQuestionIndex + 1));
            }
        }
    }
    
    async completeQuiz() {
        try {
            const quizAttemptService = window.quizAttemptService;
            
            if (!quizAttemptService) {
                console.warn("Quiz attempt service not available.");
                return;
            }
            
            try {
                await quizAttemptService.completeQuiz(this.attempt.attempt_id);
                const summary = await quizAttemptService.getAttemptSummary(this.attempt.attempt_id);
                this.showQuizResults(summary);
            } catch (e) {
                console.warn("API call failed.", e);
                throw e;
            }
            
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            
            if (this.timerUpdateInterval) {
                clearInterval(this.timerUpdateInterval);
                this.timerUpdateInterval = null;
            }
            
            this.isQuizCompleted = true;
        } catch (error) {
            console.error('Error completing quiz:', error);
            this.showError(`Failed to complete quiz: ${error.message || 'Unknown error'}`);
        }
    }
    
    showQuizResults(summary) {
        const quizContainer = this.shadowRoot.querySelector('.quiz-container');
        if (!quizContainer) return;
        
        const resultsElement = document.createElement('quiz-results');
        resultsElement.summary = summary;
        
        quizContainer.innerHTML = '';
        quizContainer.appendChild(resultsElement);
    }
    
    showError(message) {
        const quizContainer = this.shadowRoot.querySelector('.quiz-container');
        if (quizContainer) {
            quizContainer.innerHTML = `
                <article class="error-container">
                    <p class="error-message">${message}</p>
                    <a href="/home" class="home-btn" data-link>Back to Home</a>
                </article>
            `;
            
            const homeButton = quizContainer.querySelector('[data-link]');
            if (homeButton) {
                homeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.history.pushState(null, null, homeButton.getAttribute('href'));
                    window.dispatchEvent(new PopStateEvent('popstate'));
                });
            }
        }
    }
}

customElements.define('quiz-taking', QuizTaking);

export default QuizTaking;