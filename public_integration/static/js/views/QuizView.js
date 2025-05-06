import AbstractView from "./AbstractView.js";
import authService from "../services/auth.service.js";
import quizService from "../services/quiz.service.js";
import quizAttemptService from "../services/quiz-attempt.service.js";

export default class QuizView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Quiz");
        
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

    async getHtml() {
        return `
            <section class="quiz-page">
                <div id="quiz-container" class="quiz-container">
                    <div class="loading-container">
                        <p>Loading quiz...</p>
                    </div>
                </div>
            </section>
        `;
    }

    async mount() {
        const isAuthenticated = await authService.checkAuthentication();
        if (!isAuthenticated) {
            window.location.href = '/';
            return;
        }

        this.updateHeader();
        
        if (this.quizId) {
            await this.startQuiz(this.quizId);
        } else {
            this.showError("No quiz selected. Please go back to the home page and select a quiz.");
        }
        
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        window.addEventListener('beforeunload', this.cleanup.bind(this));
    }

    cleanup() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseTimer();
        } else {
            this.resumeTimer();
        }
    }

    updateHeader() {
        const user = authService.getUser();
        const loginLink = document.querySelector('.user-menu .btn');
        const userDropdown = document.getElementById('user-dropdown');
        const usernameDisplay = document.getElementById('username-display');
        
        if (user) {
            if (loginLink) loginLink.classList.add('hidden');
            if (userDropdown) {
                userDropdown.classList.remove('hidden');
                if (usernameDisplay) {
                    usernameDisplay.textContent = user.username || 'User';
                }
            }
            
            const adminLink = document.querySelector('.admin-link');
            if (adminLink) {
                if (authService.isQuizMaster()) {
                    adminLink.classList.add('hidden');
                } else {
                    adminLink.classList.add('hidden');
                }
            }
            
            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    authService.logout();
                });
            }
        }
    }

    async startQuiz(quizId) {
        try {
            this.attempt = await quizAttemptService.startQuiz(quizId);
            
            this.quizData = {
                title: this.attempt.quiz_title,
                description: this.attempt.quiz_description,
                totalQuestions: this.attempt.questions.length
            };
            
            this.loadQuestion(0);
        } catch (error) {
            console.error('Error starting quiz:', error);
            this.showError(`Failed to start quiz: ${error.message}`);
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
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;

        const question = this.currentQuestion;
        
        quizContainer.innerHTML = `
            <header class="question-header">
                <section class="question-info">
                    <p class="question-number">Question ${this.currentQuestionIndex + 1}/${this.quizData.totalQuestions}</p>
                    <p class="score">Score: ${this.score}</p>
                </section>
                <section class="question-type">
                    <p>Quiz</p>
                    <p class="type-value">${this.quizData.title}</p>
                </section>
                <section class="timer">
                    <p>Time</p>
                    <p id="timer-value">${this.timeLeft}s</p>
                </section>
            </header>
            
            <div class="progress-container">
                <div class="progress-bar" style="width: 100%"></div>
            </div>
            
            <main class="question-content">
                <aside class="category-info">
                    <span>${question.difficulty_level} • ${question.points_on_correct} points</span>
                </aside>
                <h2 class="question-text">${question.question_text}</h2>
                
                <div class="answer-grid">
                    ${this.renderAnswerOptions(question.answers)}
                </div>
            </main>
            
            <footer class="action-buttons">
                <button id="submit-btn" class="submit-btn" disabled>Submit Answer</button>
            </footer>
        `;
        
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', () => this.selectAnswer(option.dataset.id));
        });
        
        document.getElementById('submit-btn').addEventListener('click', () => this.submitAnswer());
    }

    renderAnswerOptions(answers) {
        const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);
        
        return shuffledAnswers.map(answer => `
            <button id="option-${answer.answer_id}" class="answer-option" data-id="${answer.answer_id}">
                <span class="option-letter">${this.getOptionLetter(answer.answer_id)}</span>
                <span class="option-text">${answer.answer_text}</span>
            </button>
        `).join('');
    }

    getOptionLetter(answerId) {
        const index = this.currentQuestion.answers.findIndex(a => a.answer_id === answerId);
        return ['A', 'B', 'C', 'D'][index] || '?';
    }

    selectAnswer(answerId) {
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected-answer');
        });
        
        const selectedOption = document.querySelector(`.answer-option[data-id="${answerId}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected-answer');
            this.selectedAnswer = parseInt(answerId);
            
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
    }

    async submitAnswer() {
        if (!this.selectedAnswer) return;
        
        try {
            this.pauseTimer();
            
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
            }
            
            const response = await quizAttemptService.submitResponse({
                attempt_id: this.attempt.attempt_id,
                question_id: this.currentQuestion.question_id,
                answer_id: this.selectedAnswer
            });
            
            this.score += response.points_earned;
            
            this.showAnswerFeedback(response);
            
            this.updateActionButtons(response.quiz_completed);
        } catch (error) {
            console.error('Error submitting answer:', error);
            
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.disabled = false;
            }
            
            this.resumeTimer();
        }
    }

    showAnswerFeedback(response) {
        const answerOptions = document.querySelectorAll('.answer-option');
        
        answerOptions.forEach(option => {
            const answerId = parseInt(option.dataset.id);
            const answer = this.currentQuestion.answers.find(a => a.answer_id === answerId);
            
            if (answer.is_correct) {
                option.classList.add('correct-answer');
            } else if (answerId === this.selectedAnswer && !answer.is_correct) {
                option.classList.add('wrong-answer');
            }
        });
        
        const questionContent = document.querySelector('.question-content');
        if (questionContent) {
            const feedbackElement = document.createElement('div');
            feedbackElement.className = 'answer-feedback';
            feedbackElement.innerHTML = `
                <p class="points ${response.points_earned >= 0 ? 'positive' : 'negative'}">
                    ${response.points_earned >= 0 ? '+' : ''}${response.points_earned} points
                </p>
            `;
            questionContent.appendChild(feedbackElement);
        }
        
        const scoreElement = document.querySelector('.score');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
        }
    }

    updateActionButtons(quizCompleted) {
        const actionButtons = document.querySelector('.action-buttons');
        if (!actionButtons) return;
        
        actionButtons.innerHTML = '';
        
        if (quizCompleted || this.currentQuestionIndex >= this.quizData.totalQuestions - 1) {
            const finishButton = document.createElement('button');
            finishButton.id = 'finish-btn';
            finishButton.className = 'results-btn';
            finishButton.textContent = 'See Results';
            finishButton.addEventListener('click', () => this.completeQuiz());
            actionButtons.appendChild(finishButton);
        } else {
            const nextButton = document.createElement('button');
            nextButton.id = 'next-btn';
            nextButton.className = 'next-btn';
            nextButton.textContent = 'Next Question';
            nextButton.addEventListener('click', () => this.loadQuestion(this.currentQuestionIndex + 1));
            actionButtons.appendChild(nextButton);
        }
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeUp();
            } else {
                this.updateTimerDisplay();
            }
        }, 1000);
    }

    pauseTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    resumeTimer() {
        if (!this.timer && this.timeLeft > 0 && !this.selectedAnswer) {
            this.startTimer();
        }
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer-value');
        if (timerElement) {
            timerElement.textContent = `${this.timeLeft}s`;
        }
        
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const percentage = (this.timeLeft / this.currentQuestion.time_limit_seconds) * 100;
            progressBar.style.width = `${percentage}%`;
            
            if (this.timeLeft <= 5) {
                progressBar.style.backgroundColor = '#ef4444';
            } else {
                progressBar.style.backgroundColor = '#2196f3';
            }
        }
    }

    handleTimeUp() {
        if (this.selectedAnswer) {
            this.loadQuestion(this.currentQuestionIndex + 1);
        } else {
            const questionContent = document.querySelector('.question-content');
            if (questionContent) {
                const timeUpElement = document.createElement('div');
                timeUpElement.className = 'time-up-message';
                timeUpElement.innerHTML = `<p>Time's up! Moving to the next question.</p>`;
                questionContent.appendChild(timeUpElement);
            }
            
            document.querySelectorAll('.answer-option').forEach(option => {
                const answerId = parseInt(option.dataset.id);
                const answer = this.currentQuestion.answers.find(a => a.answer_id === answerId);
                
                if (answer && answer.is_correct) {
                    option.classList.add('correct-answer');
                }
            });
            
            const actionButtons = document.querySelector('.action-buttons');
            if (actionButtons) {
                actionButtons.innerHTML = '';
                
                if (this.currentQuestionIndex >= this.quizData.totalQuestions - 1) {
                    const finishButton = document.createElement('button');
                    finishButton.id = 'finish-btn';
                    finishButton.className = 'results-btn';
                    finishButton.textContent = 'See Results';
                    finishButton.addEventListener('click', () => this.completeQuiz());
                    actionButtons.appendChild(finishButton);
                } else {
                    const nextButton = document.createElement('button');
                    nextButton.id = 'next-btn';
                    nextButton.className = 'next-btn';
                    nextButton.textContent = 'Next Question';
                    nextButton.addEventListener('click', () => this.loadQuestion(this.currentQuestionIndex + 1));
                    actionButtons.appendChild(nextButton);
                }
            }
        }
    }

    async completeQuiz() {
        try {
            await quizAttemptService.completeQuiz(this.attempt.attempt_id);
            
            const summary = await quizAttemptService.getAttemptSummary(this.attempt.attempt_id);
            
            this.showQuizResults(summary);
            
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            
            this.isQuizCompleted = true;
        } catch (error) {
            console.error('Error completing quiz:', error);
            this.showError(`Failed to complete quiz: ${error.message}`);
        }
    }

    showQuizResults(summary) {
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;
        
        const answeredPercent = Math.round((summary.answered_questions / summary.total_questions) * 100);
        const accuracyPercent = summary.answered_questions > 0 
            ? Math.round((summary.correct_answers / summary.answered_questions) * 100) 
            : 0;
        
        quizContainer.innerHTML = `
            <div class="results-container">
                <h2>Quiz Complete!</h2>
                
                <div class="final-score">
                    Your score: ${summary.total_points} points
                </div>
                
                <div class="percentage">
                    ${accuracyPercent}%
                </div>
                
                <div class="stats-summary">
                    <p>Questions answered: ${summary.answered_questions}/${summary.total_questions} (${answeredPercent}%)</p>
                    <p>Correct answers: ${summary.correct_answers}/${summary.answered_questions}</p>
                    <p>Incorrect answers: ${summary.incorrect_answers}</p>
                </div>
                
                <div class="results-actions">
                    <a href="/home" class="btn btn-primary home-btn" data-link>Back to Home</a>
                </div>
            </div>
        `;
    }

    showError(message) {
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            quizContainer.innerHTML = `
                <div class="error-container">
                    <p class="error-message">${message}</p>
                    <a href="/home" class="btn btn-primary" data-link>Back to Home</a>
                </div>
            `;
        }
    }
}