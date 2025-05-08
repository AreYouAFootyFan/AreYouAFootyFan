class FootballQuizView extends HTMLElement {
    constructor() {
      super();
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
      this.addStyles();
      this.render();
      this.init();
      
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      window.addEventListener('beforeunload', this.cleanup.bind(this));
    }
    
    disconnectedCallback() {
      this.cleanup();
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    
    addStyles() {
      const styleId = 'football-quiz-view-styles';
      
      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        
        styleElement.textContent = `
          football-quiz-view {
            display: block;
            width: 100%;
            font-family: var(--font-sans, 'Inter', sans-serif);
            color: var(--gray-800);
            background-color: var(--gray-100);
            min-height: calc(100vh - 4rem);
          }
          
          football-quiz-view .quiz-container {
            max-width: 75rem;
            margin: 0 auto;
            padding: 2rem 1rem;
          }
          
          football-quiz-view .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 50vh;
            font-size: 1.125rem;
            color: var(--gray-600);
          }
          
          football-quiz-view .error-container {
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: var(--shadow);
            padding: 2rem;
            text-align: center;
            max-width: 40rem;
            margin: 2rem auto;
          }
          
          football-quiz-view .error-message {
            color: var(--error);
            margin-bottom: 1.5rem;
          }
          
          football-quiz-view .question-card {
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: var(--shadow);
            overflow: hidden;
            margin-bottom: 2rem;
          }
          
          football-quiz-view .question-header {
            display: flex;
            justify-content: space-between;
            padding: 1.5rem;
            border-bottom: 0.0625rem solid var(--gray-200);
            background-color: var(--gray-50);
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          football-quiz-view .question-info, 
          football-quiz-view .question-type, 
          football-quiz-view .timer {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          
          football-quiz-view .question-number, 
          football-quiz-view .score, 
          football-quiz-view .type-value, 
          football-quiz-view #timer-value {
            font-weight: 600;
          }
          
          football-quiz-view #timer-value {
            color: var(--primary);
          }
          
          football-quiz-view #timer-value.warning {
            color: var(--error);
          }
          
          football-quiz-view .progress-container {
            height: 0.375rem;
            background-color: var(--gray-200);
            overflow: hidden;
          }
          
          football-quiz-view .progress-bar {
            height: 100%;
            background-color: var(--primary);
            transition: width 1s linear;
          }
          
          football-quiz-view .progress-bar.warning {
            background-color: var(--error);
          }
          
          football-quiz-view .question-content {
            padding: 2rem;
          }
          
          football-quiz-view .category-info {
            font-size: 0.875rem;
            color: var(--gray-600);
            margin-bottom: 1rem;
          }
          
          football-quiz-view .question-text {
            font-size: 1.5rem;
            font-weight: 500;
            margin-bottom: 2rem;
            line-height: 1.4;
          }
          
          football-quiz-view .answer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
            gap: 1rem;
          }
          
          football-quiz-view .answer-option {
            display: flex;
            align-items: center;
            background-color: white;
            border: 0.0625rem solid var(--gray-300);
            border-radius: 0.5rem;
            padding: 1rem;
            color: var(--gray-800);
            text-align: left;
            cursor: pointer;
            transition: all var(--transition-fast);
            width: 100%;
          }
          
          football-quiz-view .answer-option:hover {
            border-color: var(--primary);
            background-color: var(--gray-50);
          }
          
          football-quiz-view .option-letter {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2rem;
            height: 2rem;
            background-color: var(--gray-100);
            border-radius: 50%;
            margin-right: 1rem;
            font-weight: 600;
            flex-shrink: 0;
          }
          
          football-quiz-view .option-text {
            font-size: 1rem;
            line-height: 1.4;
          }
          
          football-quiz-view .selected-answer {
            border-color: var(--primary);
            background-color: var(--primary-light);
          }
          
          football-quiz-view .correct-answer {
            border-color: var(--success) !important;
            background-color: rgba(34, 197, 94, 0.1) !important;
          }
          
          football-quiz-view .correct-answer .option-letter {
            background-color: var(--success);
            color: white;
          }
          
          football-quiz-view .wrong-answer {
            border-color: var(--error) !important;
            background-color: rgba(239, 68, 68, 0.1) !important;
          }
          
          football-quiz-view .wrong-answer .option-letter {
            background-color: var(--error);
            color: white;
          }
          
          football-quiz-view .answer-feedback {
            margin-top: 2rem;
            text-align: center;
            padding-top: 1rem;
            border-top: 0.0625rem solid var(--gray-200);
          }
          
          football-quiz-view .points {
            font-size: 1.25rem;
            font-weight: 600;
          }
          
          football-quiz-view .points.positive {
            color: var(--success);
          }
          
          football-quiz-view .points.negative {
            color: var(--error);
          }
          
          football-quiz-view .action-buttons {
            padding: 1.5rem;
            border-top: 0.0625rem solid var(--gray-200);
            text-align: center;
          }
          
          football-quiz-view .submit-btn, 
          football-quiz-view .next-btn, 
          football-quiz-view .results-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-fast);
            border: none;
            min-width: min(100%, 8rem);
          }
          
          football-quiz-view .submit-btn {
            background-color: var(--primary);
            color: white;
          }
          
          football-quiz-view .submit-btn:hover {
            background-color: var(--primary-dark);
          }
          
          football-quiz-view .submit-btn:disabled {
            background-color: var(--gray-300);
            cursor: not-allowed;
          }
          
          football-quiz-view .next-btn, 
          football-quiz-view .results-btn {
            background-color: var(--secondary);
            color: white;
          }
          
          football-quiz-view .next-btn:hover, 
          football-quiz-view .results-btn:hover {
            background-color: var(--secondary-dark);
          }
          
          football-quiz-view .time-up-message {
            margin-top: 2rem;
            padding: 1rem;
            background-color: var(--gray-100);
            border-radius: 0.5rem;
            text-align: center;
            font-weight: 500;
            color: var(--error);
          }
          
          football-quiz-view .results-container {
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: var(--shadow);
            padding: 2rem;
            max-width: 40rem;
            margin: 0 auto;
            text-align: center;
          }
          
          football-quiz-view .results-container h2 {
            color: var(--primary);
            margin-bottom: 1.5rem;
          }
          
          football-quiz-view .final-score {
            font-size: 1.25rem;
            margin-bottom: 1rem;
          }
          
          football-quiz-view .percentage {
            font-size: 3rem;
            font-weight: 700;
            color: var(--primary);
            margin: 1.5rem 0;
          }
          
          football-quiz-view .stats-summary {
            background-color: var(--gray-50);
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
          }
          
          football-quiz-view .stats-summary p {
            margin-bottom: 0.5rem;
          }
          
          football-quiz-view .home-btn {
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
          
          football-quiz-view .home-btn:hover {
            background-color: var(--primary-dark);
          }
          
          football-quiz-view .question-header {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 1rem;
          }
          
          football-quiz-view .answer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
            gap: 1rem;
          }
          
          football-quiz-view .results-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
          
          football-quiz-view .submit-btn,
          football-quiz-view .next-btn,
          football-quiz-view .results-btn,
          football-quiz-view .home-btn {
            min-width: min(100%, 8rem);
          }
        `;
        
        document.head.appendChild(styleElement);
      }
    }
    
    render() {
      this.innerHTML = `
        <section class="quiz-container" id="quiz-container">
          <div class="loading-container">
            <p>Loading quiz...</p>
          </div>
        </section>
      `;
    }
    
    async init() {
      const authService = window.authService;
      
      if (!authService || !authService.isAuthenticated()) {
        window.location.href = '/';
        return;
      }
  
      if (authService.isQuizMaster && authService.isQuizMaster()) {
        this.showError("Managers cannot take quizzes. Please use a Player account.");
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
        
        const quizContainer = this.querySelector('#quiz-container');
        if (quizContainer) {
          quizContainer.innerHTML = `
            <div class="loading-container">
              <p>Loading quiz... Please wait.</p>
            </div>
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
      const quizContainer = this.querySelector('#quiz-container');
      if (!quizContainer) return;
      
      const question = this.currentQuestion;
      
      quizContainer.innerHTML = `
        <article class="question-card">
          <header class="question-header">
            <section class="question-info">
              <p>Question</p>
              <p class="question-number">${this.currentQuestionIndex + 1}/${this.quizData.totalQuestions}</p>
            </section>
            <section class="question-type">
              <p>Quiz</p>
              <p class="type-value">${this.quizData.title}</p>
            </section>
            <section class="timer">
              <p>Time Remaining</p>
              <p id="timer-value">${this.timeLeft}s</p>
            </section>
            <section class="question-info">
              <p>Score</p>
              <p class="score">${this.score}</p>
            </section>
          </header>
          
          <div class="progress-container">
            <div class="progress-bar" style="width: 100%"></div>
          </div>
          
          <main class="question-content">
            <aside class="category-info">
              <span>${question.difficulty_level} • ${question.points_on_correct > 0 ? '+' : ''}${question.points_on_correct} points correct / ${question.points_on_incorrect < 0 ? '' : '+'}${question.points_on_incorrect} points incorrect</span>
            </aside>
            <h2 class="question-text">${question.question_text}</h2>
            
            <div class="answer-grid">
              ${this.renderAnswerOptions(question.answers)}
            </div>
          </main>
          
          <footer class="action-buttons">
            <button id="submit-btn" class="submit-btn" disabled>Submit Answer</button>
          </footer>
        </article>
      `;
      
      this.querySelectorAll('.answer-option').forEach(option => {
        option.addEventListener('click', () => this.selectAnswer(option.dataset.id));
      });
      
      this.querySelector('#submit-btn').addEventListener('click', () => this.submitAnswer());
    }
    
    renderAnswerOptions(answers) {
      const shuffledAnswers = answers.map(a => ({...a})).sort(() => Math.random() - 0.5);
      
      return shuffledAnswers.map((answer, index) => `
        <button id="option-${answer.answer_id}" class="answer-option" data-id="${answer.answer_id}">
          <span class="option-letter">${String.fromCharCode(65 + index)}</span>
          <span class="option-text">${answer.answer_text}</span>
        </button>
      `).join('');
    }
    
    selectAnswer(answerId) {
      this.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected-answer');
      });
      
      const selectedOption = this.querySelector(`.answer-option[data-id="${answerId}"]`);
      if (selectedOption) {
        selectedOption.classList.add('selected-answer');
        this.selectedAnswer = parseInt(answerId);
        
        const submitBtn = this.querySelector('#submit-btn');
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }
    }
    
    async submitAnswer() {
      if (!this.selectedAnswer) return;
      
      try {
        this.pauseTimer();
        
        const submitBtn = this.querySelector('#submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
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
          return
        }
        
        this.score += response.points_earned;
        
        this.showAnswerFeedback(response);
        
        this.updateActionButtons(response.quiz_completed || this.currentQuestionIndex === this.quizData.totalQuestions - 1);
      } catch (error) {
        console.error('Error submitting answer:', error);
        
        const submitBtn = this.querySelector('#submit-btn');
        if (submitBtn) {
          submitBtn.disabled = false;
        }
        
        this.resumeTimer();
      }
    }
    
    
    showAnswerFeedback(response) {
        const answerOptions = this.querySelectorAll('.answer-option');
        
        answerOptions.forEach(option => {
          const answerId = parseInt(option.dataset.id);
          const answer = this.currentQuestion.answers.find(a => a.answer_id === answerId);
          
          if (answer && answer.is_correct) {
            option.classList.add('correct-answer');
          } else if (answerId === this.selectedAnswer && !(answer && answer.is_correct)) {
            option.classList.add('wrong-answer');
          }
        });
        
        const questionContent = this.querySelector('.question-content');
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
        
        const scoreElement = this.querySelector('.score');
        if (scoreElement) {
          scoreElement.textContent = this.score;
        }
      }
      
      updateActionButtons(quizCompleted) {
        const actionButtons = this.querySelector('.action-buttons');
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
        const timerElement = this.querySelector('#timer-value');
        if (timerElement) {
          timerElement.textContent = `${this.timeLeft}s`;
          
          if (this.timeLeft <= 5) {
            timerElement.classList.add('warning');
          } else {
            timerElement.classList.remove('warning');
          }
        }
        
        const progressBar = this.querySelector('.progress-bar');
        if (progressBar) {
          const percentage = (this.timeLeft / this.currentQuestion.time_limit_seconds) * 100;
          progressBar.style.width = `${percentage}%`;
          
          if (this.timeLeft <= 5) {
            progressBar.classList.add('warning');
          } else {
            progressBar.classList.remove('warning');
          }
        }
      }
      
      handleTimeUp() {
        if (this.selectedAnswer) {
          this.submitAnswer();
        } else {
          const questionContent = this.querySelector('.question-content');
          if (questionContent) {
            this.querySelectorAll('.answer-option').forEach(option => {
              const answerId = parseInt(option.dataset.id);
              const answer = this.currentQuestion.answers.find(a => a.answer_id === answerId);
              
              if (answer && answer.is_correct) {
                option.classList.add('correct-answer');
              }
            });
            
            const timeUpElement = document.createElement('div');
            timeUpElement.className = 'time-up-message';
            timeUpElement.innerHTML = `<p>Time's up! The correct answer is shown above.</p>`;
            questionContent.appendChild(timeUpElement);
          }
          
          const actionButtons = this.querySelector('.action-buttons');
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
            throw e
          }
          
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
          
          this.isQuizCompleted = true;
        } catch (error) {
          console.error('Error completing quiz:', error);
          this.showError(`Failed to complete quiz: ${error.message || 'Unknown error'}`);
        }
      }
      
      
      showQuizResults(summary) {
        const quizContainer = this.querySelector('#quiz-container');
        if (!quizContainer) return;
        
        const answeredPercent = Math.round((summary.answered_questions / summary.total_questions) * 100);
        const accuracyPercent = summary.answered_questions > 0 
          ? Math.round((summary.correct_answers / summary.answered_questions) * 100) 
          : 0;
        
        quizContainer.innerHTML = `
          <article class="results-container">
            <h2>Quiz Complete!</h2>
            
            <p class="final-score">
              Your score: <strong>${summary.total_points}</strong> points
            </p>
            
            <div class="percentage">
              ${accuracyPercent}%
            </div>
            
            <div class="stats-summary">
              <p><strong>Questions:</strong> ${summary.answered_questions}/${summary.total_questions} (${answeredPercent}% completed)</p>
              <p><strong>Correct answers:</strong> ${summary.correct_answers}/${summary.answered_questions}</p>
              <p><strong>Incorrect answers:</strong> ${summary.incorrect_answers}</p>
            </div>
            
            <div class="results-actions">
              <a href="/home" class="home-btn" data-link>Back to Home</a>
            </div>
          </article>
        `;
      }
      
      showError(message) {
        const quizContainer = this.querySelector('#quiz-container');
        if (quizContainer) {
          quizContainer.innerHTML = `
            <div class="error-container">
              <p class="error-message">${message}</p>
              <a href="/home" class="home-btn" data-link>Back to Home</a>
            </div>
          `;
        }
      }
    }

    customElements.define('football-quiz-view', FootballQuizView);


    export default FootballQuizView;