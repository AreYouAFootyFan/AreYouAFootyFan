// filepath: d:\AreYouAFootyFan\public\static\js\views\QuizView.js
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.setTitle("Quiz");
        this.setStyles(['./static/css/quiz.css']);
        this.quizId = params.id;
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 12;
        this.timer = null;
        this.questions = [];
        this.selectedAnswer = null;
        this.answerSubmitted = false;
        this.isActive = false; // Flag to track if view is active
    }

    async getQuestions() {
        try {
            // Fetch questions from our JSON file
            const response = await fetch('/static/data/questions.json');
            if (!response.ok) {
                throw new Error('Failed to load quiz questions');
            }
            this.questions = await response.json();
            this.totalQuestions = this.questions.length;
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            // Fallback to a simple question if fetch fails
            this.questions = [
                {
                    id: 1,
                    text: "Which team won the UEFA Champions League in 2023?",
                    category: "Recent History",
                    difficulty: "MEDIUM",
                    answers: [
                        { id: 'A', text: "Real Madrid", isCorrect: true },
                        { id: 'B', text: "Manchester City", isCorrect: false },
                        { id: 'C', text: "Bayern Munich", isCorrect: false },
                        { id: 'D', text: "Inter Milan", isCorrect: false }
                    ]
                }
            ];
            this.totalQuestions = 1;
        }
    }

    // Called when view is mounted
    mount() {
        this.isActive = true;
        
        // Initialize and start the quiz
        this.renderQuestion();
        this.startTimer();
        
        // Add event listener to handle page visibility changes
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Add event listener to clean up when navigating away
        window.addEventListener('beforeunload', this.cleanup.bind(this));
        window.addEventListener('popstate', this.cleanup.bind(this));
        
        // Add listener for any link click for navigation
        document.body.addEventListener('click', this.handleNavigation.bind(this));
    }
    
    // Clean up resources when view is unmounted
    cleanup() {
        if (this.isActive) {
            this.isActive = false;
            this.clearTimer();
            document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
            window.removeEventListener('beforeunload', this.cleanup.bind(this));
            window.removeEventListener('popstate', this.cleanup.bind(this));
            document.body.removeEventListener('click', this.handleNavigation.bind(this));
        }
    }
    
    // Handle navigation away from quiz
    handleNavigation(event) {
        if (event.target.matches('[data-link]')) {
            this.cleanup();
        }
    }
    
    // Handle tab visibility changes
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden (user switched tabs)
            this.clearTimer();
        } else if (this.isActive && !this.answerSubmitted) {
            // Page is visible again and quiz is still active
            this.startTimer();
        }
    }

    startTimer() {
        // Always clear any existing timer first to prevent duplicates
        this.clearTimer();
        
        if (!this.isActive || this.answerSubmitted) return;
        
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            if (this.timeLeft <= 0) {
                this.clearTimer();
                this.handleTimeUp();
                return;
            }
            
            this.timeLeft -= 1;
            this.updateTimerDisplay();
        }, 1000);
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer-value');
        if (timerElement) {
            timerElement.textContent = `${this.timeLeft}s`;
        }
        
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const percentage = (this.timeLeft / 12) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    handleTimeUp() {
        if (!this.isActive || this.answerSubmitted) return;
        
        // Mark the question as timed out
        this.answerSubmitted = true;
        
        // Show the correct answer
        const currentQuestion = this.questions[this.currentQuestion];
        const correctOption = currentQuestion.answers.find(a => a.isCorrect);
        if (correctOption) {
            const element = document.querySelector(`#option-${correctOption.id}`);
            if (element) {
                element.classList.add('correct-answer');
            }
        }
        
        // Update buttons
        this.updateActionButtons();
    }

    selectAnswer(selectedAnswer) {
        if (!this.isActive || this.answerSubmitted) return;
        
        // Clear previous selection
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected-answer');
        });
        
        // Highlight new selection
        const optionButton = document.querySelector(`#option-${selectedAnswer}`);
        if (optionButton) {
            optionButton.classList.add('selected-answer');
            this.selectedAnswer = selectedAnswer;
        }
        
        // Enable the submit button
        const submitButton = document.getElementById('submit-btn');
        if (submitButton) {
            submitButton.disabled = false;
        }
    }

    submitAnswer() {
        if (!this.isActive || !this.selectedAnswer || this.answerSubmitted) return;
        
        this.answerSubmitted = true;
        this.clearTimer(); // Stop the timer
        
        const currentQuestion = this.questions[this.currentQuestion];
        const selectedOption = currentQuestion.answers.find(a => a.id === this.selectedAnswer);
        
        if (selectedOption && selectedOption.isCorrect) {
            this.score += 1;
            document.querySelector(`#option-${this.selectedAnswer}`).classList.add('correct-answer');
        } else {
            document.querySelector(`#option-${this.selectedAnswer}`).classList.add('wrong-answer');
            // Highlight the correct answer
            const correctOption = currentQuestion.answers.find(a => a.isCorrect);
            if (correctOption) {
                document.querySelector(`#option-${correctOption.id}`).classList.add('correct-answer');
            }
        }
        
        // Update score display
        const scoreElement = document.querySelector('.score');
        if (scoreElement) {
            scoreElement.textContent = `Score ${this.score}`;
        }
        
        // Update buttons
        this.updateActionButtons();
    }

    updateActionButtons() {
        const actionButtons = document.querySelector('.action-buttons');
        if (!actionButtons) return;
        
        // Clear existing buttons
        while (actionButtons.firstChild) {
            actionButtons.removeChild(actionButtons.firstChild);
        }
        
        if (this.answerSubmitted) {
            // Show Next or See Results button
            if (this.currentQuestion < this.questions.length - 1) {
            const nextButton = document.createElement('button');
            nextButton.id = 'next-btn';
            nextButton.className = 'next-btn';
            nextButton.textContent = 'Next Question';
            nextButton.addEventListener('click', () => this.moveToNextQuestion(), { once: true });
            actionButtons.appendChild(nextButton);
            } else {
            const resultsButton = document.createElement('button');
            resultsButton.id = 'results-btn';
            resultsButton.className = 'results-btn';
            resultsButton.textContent = 'See Results';
            resultsButton.addEventListener('click', () => this.showResults(), { once: true });
            actionButtons.appendChild(resultsButton);
            }
        } else {
            // Show Submit button (disabled until an answer is selected)
            const submitButton = document.createElement('button');
            submitButton.id = 'submit-btn';
            submitButton.className = 'submit-btn';
            submitButton.textContent = 'Submit Answer';
            submitButton.disabled = true;
            submitButton.addEventListener('click', () => this.submitAnswer(), { once: true });
            actionButtons.appendChild(submitButton);
        }
    }

    moveToNextQuestion() {
        if (!this.isActive) return;
        
        this.clearTimer();
        this.currentQuestion += 1;
        this.selectedAnswer = null;
        this.answerSubmitted = false;
        this.timeLeft = 12;
        
        // Render the next question
        this.renderQuestion();
        this.startTimer();
    }

    showResults() {
        if (!this.isActive) return;
        
        this.clearTimer();
        
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            // Clear existing content
            quizContainer.textContent = '';
            
            // Create results container
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'results-container';
            
            // Create heading
            const heading = document.createElement('h2');
            heading.textContent = 'Quiz Complete!';
            resultsContainer.appendChild(heading);
            
            // Create final score element
            const finalScore = document.createElement('div');
            finalScore.className = 'final-score';
            finalScore.textContent = `Your score: ${this.score}/${this.totalQuestions}`;
            resultsContainer.appendChild(finalScore);
            
            // Create percentage element
            const percentage = document.createElement('div');
            percentage.className = 'percentage';
            percentage.textContent = `${Math.round((this.score / this.totalQuestions) * 100)}%`;
            resultsContainer.appendChild(percentage);
            
            // Create actions container
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'results-actions';
            
            // Create restart button
            const restartBtn = document.createElement('button');
            restartBtn.id = 'restart-btn';
            restartBtn.className = 'restart-btn';
            restartBtn.textContent = 'Try Again';
            actionsDiv.appendChild(restartBtn);
            
            // Create home link
            const homeLink = document.createElement('a');
            homeLink.href = '/';
            homeLink.className = 'home-btn';
            homeLink.setAttribute('data-link', '');
            homeLink.textContent = 'Back to Home';
            actionsDiv.appendChild(homeLink);
            
            // Add actions to results container
            resultsContainer.appendChild(actionsDiv);
            
            // Add results container to quiz container
            quizContainer.appendChild(resultsContainer);
            
            const restartButton = document.getElementById('restart-btn');
            if (restartButton) {
                restartButton.addEventListener('click', () => {
                    // Reset quiz state and restart
                    this.currentQuestion = 0;
                    this.score = 0;
                    this.selectedAnswer = null;
                    this.answerSubmitted = false;
                    this.timeLeft = 12;
                    
                    this.renderQuestion();
                    this.startTimer();
                }, { once: true });
            }
        }
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionContainer = document.getElementById('quiz-container');
        
        if (questionContainer && question) {
            // Clear existing content
            while (questionContainer.firstChild) {
                questionContainer.removeChild(questionContainer.firstChild);
            }
            
            // Create elements using DOM methods
            const header = document.createElement('header');
            header.className = 'question-header';
            
            // Question info section
            const infoSection = document.createElement('section');
            infoSection.className = 'question-info';
            
            const questionNumber = document.createElement('p');
            questionNumber.className = 'question-number';
            questionNumber.textContent = `Question ${this.currentQuestion + 1}/${this.totalQuestions}`;
            
            const scoreElement = document.createElement('p');
            scoreElement.className = 'score';
            scoreElement.textContent = `Score ${this.score}`;
            
            infoSection.appendChild(questionNumber);
            infoSection.appendChild(scoreElement);
            
            // Question type section
            const typeSection = document.createElement('section');
            typeSection.className = 'question-type';
            
            const typeLabel = document.createElement('p');
            typeLabel.textContent = 'Type';
            
            const typeValue = document.createElement('p');
            typeValue.className = 'type-value';
            typeValue.textContent = 'Multiple Choice';
            
            typeSection.appendChild(typeLabel);
            typeSection.appendChild(typeValue);
            
            // Timer section
            const timerSection = document.createElement('section');
            timerSection.className = 'timer';
            
            const timerLabel = document.createElement('p');
            timerLabel.textContent = 'Time';
            
            const timerValue = document.createElement('p');
            timerValue.id = 'timer-value';
            timerValue.textContent = `${this.timeLeft}s`;
            
            timerSection.appendChild(timerLabel);
            timerSection.appendChild(timerValue);
            
            header.appendChild(infoSection);
            header.appendChild(typeSection);
            header.appendChild(timerSection);
            
            // Progress bar
            const progressBar = document.createElement('progress');
            progressBar.className = 'progress-bar';
            progressBar.value = this.timeLeft;
            progressBar.max = 12;
            
            // Main content
            const main = document.createElement('main');
            main.className = 'question-content';
            
            const categoryInfo = document.createElement('aside');
            categoryInfo.className = 'category-info';
            
            const categorySpan = document.createElement('span');
            categorySpan.textContent = `${question.category} • ${question.difficulty}`;
            categoryInfo.appendChild(categorySpan);
            
            const questionText = document.createElement('h2');
            questionText.className = 'question-text';
            questionText.textContent = question.text;
            
            const answerGrid = document.createElement('fieldset');
            answerGrid.className = 'answer-grid';
            
            // Create answer options
            question.answers.forEach(answer => {
                const optionButton = document.createElement('button');
                optionButton.id = `option-${answer.id}`;
                optionButton.className = 'answer-option';
                optionButton.dataset.option = answer.id;
                
                const optionLetter = document.createElement('span');
                optionLetter.className = 'option-letter';
                optionLetter.textContent = answer.id;
                
                const optionText = document.createElement('span');
                optionText.className = 'option-text';
                optionText.textContent = answer.text;
                
                optionButton.appendChild(optionLetter);
                optionButton.appendChild(optionText);
                answerGrid.appendChild(optionButton);
            });
            
            main.appendChild(categoryInfo);
            main.appendChild(questionText);
            main.appendChild(answerGrid);
            
            // Footer for action buttons
            const footer = document.createElement('footer');
            footer.className = 'action-buttons';
            
            // Append all elements to the question container
            questionContainer.appendChild(header);
            questionContainer.appendChild(progressBar);
            questionContainer.appendChild(main);
            questionContainer.appendChild(footer);
            
            // Add event listeners to answer buttons
            document.querySelectorAll('.answer-option').forEach(button => {
                button.addEventListener('click', (e) => {
                    const selectedAnswer = e.currentTarget.dataset.option;
                    this.selectAnswer(selectedAnswer);
                });
            });
            
            // Add submit button
            this.updateActionButtons();
        }
    }

    getQuestionHtml(question) {
        return `
            <header class="question-header">
                <section class="question-info">
                    <p class="question-number">Question ${this.currentQuestion + 1}/${this.totalQuestions}</p>
                    <p class="score">Score ${this.score}</p>
                </section>
                <section class="question-type">
                    <p>Type</p>
                    <p class="type-value">Multiple Choice</p>
                </section>
                <section class="timer">
                    <p>Time</p>
                    <p id="timer-value">${this.timeLeft}s</p>
                </section>
            </header>
            
            <progress class="progress-bar" value="${this.timeLeft}" max="12"></progress>
            
            <main class="question-content">
                <aside class="category-info">
                    <span>${question.category} • ${question.difficulty}</span>
                </aside>
                <h2 class="question-text">${question.text}</h2>
                
                <fieldset class="answer-grid">
                    ${question.answers.map(answer => `
                    <button id="option-${answer.id}" class="answer-option" data-option="${answer.id}">
                        <span class="option-letter">${answer.id}</span>
                        <span class="option-text">${answer.text}</span>
                    </button>
                    `).join('')}
                </fieldset>
            </main>
            
            <footer class="action-buttons">
                <!-- Buttons will be rendered by updateActionButtons() -->
            </footer>
        `;
    }

    async getHtml() {
        await this.getQuestions();
        
        const html = `
            <section class="quiz-page">
                <article id="quiz-container" class="quiz-container" aria-live="polite" aria-atomic="true">
                    <!-- Question will be rendered here by renderQuestion() -->
                </article>
            </section>
        `;
        
        // We'll initialize the quiz in the mount method instead of using setTimeout
        return html;
    }
}