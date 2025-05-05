// game.js - Football Knowledge Challenge Game Logic

// Define initialization function in global scope so it can be called by the router
window.initializeGame = function() {
    console.log('Initializing game module');
    
    // Game state variables
    let gameState = 'intro'; // 'intro', 'playing', 'feedback', 'results'
    let currentQuestionIndex = 0;
    let selectedAnswer = null;
    let answerStatus = 'unanswered'; // 'unanswered', 'correct', 'incorrect'
    let score = 0;
    let timeLeft = 15;
    let timerInterval = null;
    let badges = [];
    let questions = [];

    // Initialize the game by first loading the questions
    loadQuestions();

    // Function to load questions from JSON file
    function loadQuestions() {
        fetch('data/questions.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                questions = data;
                renderGameState();
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                const gameContainer = document.getElementById('game-container');
                if (gameContainer) {
                    window.domUtils.clearElement(gameContainer);
                    
                    const errorMessage = window.domUtils.createElement('div', { className: 'error-message' }, [
                        window.domUtils.createElement('h2', {}, 'Error Loading Game'),
                        window.domUtils.createElement('p', {}, 'Unable to load questions. Please try again later.'),
                        window.domUtils.createElement('button', { 
                            className: 'btn btn-primary',
                            onclick: () => location.reload()
                        }, 'Reload')
                    ]);
                    
                    gameContainer.appendChild(errorMessage);
                }
            });
    }

    // Main render function
    function renderGameState() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) {
            console.error('Game container not found!');
            return;
        }
        
        window.domUtils.clearElement(gameContainer);

        switch(gameState) {
            case 'intro':
                renderIntroScreen(gameContainer);
                break;
            case 'playing':
            case 'feedback':
                renderGameScreen(gameContainer);
                break;
            case 'results':
                renderResultsScreen(gameContainer);
                break;
        }

        // Re-initialize Lucide icons after rendering new content
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Render the intro/welcome screen
    function renderIntroScreen(container) {
        const introContainer = window.domUtils.createElement('div', { className: 'game-intro' });
        
        // Create intro icon
        const introIcon = window.domUtils.createElement('div', { className: 'intro-icon' });
        introIcon.appendChild(window.domUtils.createIcon('trophy'));
        introContainer.appendChild(introIcon);
        
        // Create title and description
        introContainer.appendChild(window.domUtils.createElement('h1', { className: 'intro-title' }, 'Football Knowledge Challenge'));
        introContainer.appendChild(window.domUtils.createElement('p', { className: 'intro-description' }, 
            'Test your football knowledge against the clock. Answer questions correctly to earn badges and climb the global leaderboard!'
        ));
        
        // Create features section
        const featuresContainer = window.domUtils.createElement('div', { className: 'intro-features' });
        
        // Feature 1: Timed Rounds
        const feature1 = window.domUtils.createElement('div', { className: 'intro-feature' });
        const featureHeader1 = window.domUtils.createElement('div', { className: 'feature-header' });
        featureHeader1.appendChild(window.domUtils.createIcon('clock'));
        featureHeader1.appendChild(window.domUtils.createElement('h3', { className: 'feature-title' }, 'Timed Rounds'));
        feature1.appendChild(featureHeader1);
        feature1.appendChild(window.domUtils.createElement('p', { className: 'feature-description' }, 
            '15 seconds per question. Test your knowledge under pressure!'
        ));
        
        // Feature 2: Earn Badges
        const feature2 = window.domUtils.createElement('div', { className: 'intro-feature' });
        const featureHeader2 = window.domUtils.createElement('div', { className: 'feature-header' });
        featureHeader2.appendChild(window.domUtils.createIcon('award'));
        featureHeader2.appendChild(window.domUtils.createElement('h3', { className: 'feature-title' }, 'Earn Badges'));
        feature2.appendChild(featureHeader2);
        feature2.appendChild(window.domUtils.createElement('p', { className: 'feature-description' }, 
            'Unlock achievements based on your performance!'
        ));
        
        // Add features to container
        featuresContainer.appendChild(feature1);
        featuresContainer.appendChild(feature2);
        introContainer.appendChild(featuresContainer);
        
        // Add start button
        const startButton = window.domUtils.createElement('button', {
            id: 'start-game',
            className: 'btn btn-primary btn-lg',
            onclick: startGame
        }, 'Start Challenge');
        
        introContainer.appendChild(startButton);
        container.appendChild(introContainer);
    }

    // Render the main game screen (questions + answers)
    function renderGameScreen(container) {
        const currentQuestion = questions[currentQuestionIndex];
        
        // Create game HUD (heads-up display)
        const gameHud = window.domUtils.createElement('div', { className: 'game-hud' });
        
        // First stats group (Question number and Score)
        const statsGroup1 = window.domUtils.createElement('div', { className: 'game-stats-group' });
        
        // Question counter
        const questionStat = window.domUtils.createElement('div', { className: 'game-stat' });
        questionStat.appendChild(window.domUtils.createElement('div', { className: 'game-stat-label' }, 'Question'));
        questionStat.appendChild(window.domUtils.createElement('div', { className: 'game-stat-value' }, 
            `${currentQuestionIndex + 1}/${questions.length}`
        ));
        statsGroup1.appendChild(questionStat);
        
        // Score counter
        const scoreStat = window.domUtils.createElement('div', { className: 'game-stat' });
        scoreStat.appendChild(window.domUtils.createElement('div', { className: 'game-stat-label' }, 'Score'));
        scoreStat.appendChild(window.domUtils.createElement('div', { className: 'game-stat-value' }, score.toString()));
        statsGroup1.appendChild(scoreStat);
        
        gameHud.appendChild(statsGroup1);
        
        // Second stats group (Type and Timer)
        const statsGroup2 = window.domUtils.createElement('div', { className: 'game-stats-group' });
        
        // Question type
        const typeStat = window.domUtils.createElement('div', { className: 'game-stat' });
        typeStat.appendChild(window.domUtils.createElement('div', { className: 'game-stat-label' }, 'Type'));
        typeStat.appendChild(window.domUtils.createElement('div', { className: 'game-stat-value' }, 
            currentQuestion.type.replace("-", " ")
        ));
        statsGroup2.appendChild(typeStat);
        
        // Timer
        const timerStat = window.domUtils.createElement('div', { className: 'game-stat' });
        timerStat.appendChild(window.domUtils.createElement('div', { className: 'game-stat-label' }, 'Time'));
        const timerValue = window.domUtils.createElement('div', { 
            className: `game-stat-value ${timeLeft <= 5 ? 'time-low' : ''}` 
        }, `${timeLeft}s`);
        timerStat.appendChild(timerValue);
        statsGroup2.appendChild(timerStat);
        
        gameHud.appendChild(statsGroup2);
        
        // Add HUD to container
        container.appendChild(gameHud);
        
        // Create timer progress bar
        const progressContainer = window.domUtils.createElement('div', { className: 'progress-container' });
        const progressBar = window.domUtils.createElement('div', { 
            className: `progress-bar ${timeLeft <= 5 ? 'time-warning' : ''}`,
            style: { width: `${(timeLeft / 15) * 100}%` }
        });
        progressContainer.appendChild(progressBar);
        container.appendChild(progressContainer);
        
        // Create question card
        const card = window.domUtils.createElement('div', { className: 'card' });
        
        // Card header with question
        const cardHeader = window.domUtils.createElement('div', { className: 'card-header' });
        cardHeader.appendChild(window.domUtils.createElement('div', { className: 'card-description' }, 
            `${currentQuestion.category} • ${currentQuestion.difficulty.toUpperCase()}`
        ));
        cardHeader.appendChild(window.domUtils.createElement('div', { className: 'card-title' }, currentQuestion.question));
        card.appendChild(cardHeader);
        
        // Card content with answer options
        const cardContent = window.domUtils.createElement('div', { className: 'card-content' });
        const optionsGrid = window.domUtils.createElement('div', { className: 'options-grid' });
        
        // Create option buttons
        currentQuestion.options.forEach((option, index) => {
            let buttonClass = 'option-button';
            
            if (gameState === 'feedback') {
                if (index === currentQuestion.correctAnswer) {
                    buttonClass += ' correct';
                } else if (selectedAnswer === index) {
                    buttonClass += ' incorrect';
                }
            }
            
            const optionButton = window.domUtils.createElement('button', {
                className: buttonClass,
                dataset: { index: index.toString() },
                disabled: gameState === 'feedback'
            });
            
            // Option indicator (A, B, C, D or True/False)
            const optionIndicator = window.domUtils.createElement('div', { className: 'option-indicator' },
                currentQuestion.type === 'true-false' ? option : String.fromCharCode(65 + index)
            );
            optionButton.appendChild(optionIndicator);
            
            // For multiple choice, add the text
            if (currentQuestion.type === 'multiple-choice') {
                optionButton.appendChild(window.domUtils.createElement('div', { className: 'option-text' }, option));
            }
            
            // Add feedback icons if in feedback state
            if (gameState === 'feedback') {
                if (index === currentQuestion.correctAnswer) {
                    optionButton.appendChild(window.domUtils.createIcon('check-circle-2', { className: 'option-icon' }));
                } else if (selectedAnswer === index) {
                    optionButton.appendChild(window.domUtils.createIcon('x-circle', { className: 'option-icon' }));
                }
            }
            
            // Add click handler for playing state
            if (gameState === 'playing') {
                optionButton.addEventListener('click', function() {
                    handleAnswer(index);
                });
            }
            
            optionsGrid.appendChild(optionButton);
        });
        
        cardContent.appendChild(optionsGrid);
        card.appendChild(cardContent);
        
        // Add feedback if in feedback state
        if (gameState === 'feedback') {
            const cardFooter = window.domUtils.createElement('div', { className: 'card-footer' });
            
            // Feedback message
            const feedbackMessage = window.domUtils.createElement('div', { 
                className: `feedback-message ${answerStatus}` 
            });
            
            // Feedback header
            const feedbackHeader = window.domUtils.createElement('div', { className: 'feedback-header' });
            
            if (answerStatus === 'correct') {
                feedbackHeader.appendChild(window.domUtils.createIcon('check-circle-2'));
                feedbackHeader.appendChild(window.domUtils.createElement('div', { className: 'feedback-header-text' }, 'Correct!'));
                feedbackHeader.appendChild(window.domUtils.createElement('div', { className: 'points-badge' }, `+${currentQuestion.points} POINTS`));
            } else {
                feedbackHeader.appendChild(window.domUtils.createIcon('x-circle'));
                feedbackHeader.appendChild(window.domUtils.createElement('div', { className: 'feedback-header-text' }, 'Incorrect'));
            }
            
            feedbackMessage.appendChild(feedbackHeader);
            feedbackMessage.appendChild(window.domUtils.createElement('p', {}, currentQuestion.explanation));
            cardFooter.appendChild(feedbackMessage);
            
            // Next button
            const isLastQuestion = currentQuestionIndex >= questions.length - 1;
            const nextButton = window.domUtils.createElement('button', {
                id: 'next-button',
                className: 'btn btn-primary btn-with-icon',
                onclick: nextQuestion
            });
            
            if (isLastQuestion) {
                nextButton.appendChild(document.createTextNode('See Results '));
                nextButton.appendChild(window.domUtils.createIcon('trophy'));
            } else {
                nextButton.appendChild(document.createTextNode('Next Question '));
                nextButton.appendChild(window.domUtils.createIcon('arrow-right'));
            }
            
            cardFooter.appendChild(nextButton);
            card.appendChild(cardFooter);
        }
        
        container.appendChild(card);
    }

    // Render the results screen
    function renderResultsScreen(container) {
        // Calculate accuracy
        const accuracy = Math.round(
            (questions.filter((_, i) => {
                const wasAnswered = i < currentQuestionIndex;
                const wasCorrect = i === currentQuestionIndex - 1 ? answerStatus === 'correct' : true;
                return wasAnswered && wasCorrect;
            }).length / currentQuestionIndex) * 100
        );
        
        const resultsContainer = window.domUtils.createElement('div', { className: 'results-container' });
        
        // Results header
        const resultsIcon = window.domUtils.createElement('div', { className: 'results-icon' });
        resultsIcon.appendChild(window.domUtils.createIcon('trophy'));
        resultsContainer.appendChild(resultsIcon);
        
        resultsContainer.appendChild(window.domUtils.createElement('h1', { className: 'results-title' }, 'Challenge Complete!'));
        resultsContainer.appendChild(window.domUtils.createElement('p', { className: 'results-description' },
            'You\'ve completed the Football Knowledge Challenge. Here\'s how you did:'
        ));
        
        // Stats grid
        const statsGrid = window.domUtils.createElement('div', { className: 'stats-grid' });
        
        // Total Score stat
        const scoreStat = window.domUtils.createElement('div', { className: 'stat-card' });
        scoreStat.appendChild(window.domUtils.createElement('div', { className: 'stat-value' }, score.toString()));
        scoreStat.appendChild(window.domUtils.createElement('div', { className: 'stat-label' }, 'Total Score'));
        statsGrid.appendChild(scoreStat);
        
        // Accuracy stat
        const accuracyStat = window.domUtils.createElement('div', { className: 'stat-card' });
        accuracyStat.appendChild(window.domUtils.createElement('div', { className: 'stat-value' }, `${accuracy}%`));
        accuracyStat.appendChild(window.domUtils.createElement('div', { className: 'stat-label' }, 'Accuracy'));
        statsGrid.appendChild(accuracyStat);
        
        resultsContainer.appendChild(statsGrid);
        
        // Badges section (if any)
        if (badges.length > 0) {
            const badgesSection = window.domUtils.createElement('div', { className: 'badges-section' });
            badgesSection.appendChild(window.domUtils.createElement('h2', { className: 'badges-title' }, 'Badges Earned'));
            
            const badgesContainer = window.domUtils.createElement('div', { className: 'badges-container' });
            
            badges.forEach(badge => {
                const badgeElement = window.domUtils.createElement('div', { className: 'badge' });
                badgeElement.appendChild(window.domUtils.createIcon('award'));
                badgeElement.appendChild(window.domUtils.createElement('span', {}, badge));
                badgesContainer.appendChild(badgeElement);
            });
            
            badgesSection.appendChild(badgesContainer);
            resultsContainer.appendChild(badgesSection);
        }
        
        // Action buttons
        const actionButtons = window.domUtils.createElement('div', { className: 'action-buttons' });
        
        // Home button
        const homeButton = window.domUtils.createElement('a', {
            href: '#/',
            className: 'btn btn-outline btn-with-icon'
        });
        homeButton.appendChild(window.domUtils.createIcon('home'));
        homeButton.appendChild(document.createTextNode(' Back to Home'));
        actionButtons.appendChild(homeButton);
        
        // Play again button
        const playAgainButton = window.domUtils.createElement('button', {
            id: 'play-again',
            className: 'btn btn-primary btn-with-icon',
            onclick: startGame
        });
        playAgainButton.appendChild(window.domUtils.createIcon('trophy'));
        playAgainButton.appendChild(document.createTextNode(' Play Again'));
        actionButtons.appendChild(playAgainButton);
        
        // Leaderboard button
        const leaderboardButton = window.domUtils.createElement('a', {
            href: '#/leaderboard',
            className: 'btn btn-outline btn-with-icon'
        });
        leaderboardButton.appendChild(window.domUtils.createIcon('bar-chart-3'));
        leaderboardButton.appendChild(document.createTextNode(' View Leaderboard'));
        actionButtons.appendChild(leaderboardButton);
        
        resultsContainer.appendChild(actionButtons);
        container.appendChild(resultsContainer);
        
        // Update global state with game results
        if (window.appState) {
            window.appState.score += score;
            if (badges.length > 0) {
                window.appState.badges = [...window.appState.badges, ...badges];
            }
        }
    }

    // Game control functions
    function startGame() {
        gameState = 'playing';
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 15;
        badges = [];
        selectedAnswer = null;
        answerStatus = 'unanswered';
        
        renderGameState();
        startTimer();
    }

    function handleAnswer(answerIndex) {
        if (gameState !== 'playing' || answerStatus !== 'unanswered') return;

        stopTimer();
        selectedAnswer = answerIndex;
        
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answerIndex === currentQuestion.correctAnswer;

        if (isCorrect) {
            score += currentQuestion.points;
            answerStatus = 'correct';
        } else {
            answerStatus = 'incorrect';
        }

        gameState = 'feedback';
        renderGameState();
    }

    function nextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            selectedAnswer = null;
            answerStatus = 'unanswered';
            timeLeft = 15;
            gameState = 'playing';
            
            renderGameState();
            startTimer();
        } else {
            // Game over - award badges based on performance
            if (score > 500 && !badges.includes("Tactical Genius")) {
                badges.push("Tactical Genius");
            }

            if (score > 300 && !badges.includes("Football Scholar")) {
                badges.push("Football Scholar");
            }

            gameState = 'results';
            renderGameState();
        }
    }

    // Timer functions
    function startTimer() {
        stopTimer(); // Clear any existing timer
        timerInterval = setInterval(function() {
            timeLeft--;
            
            // Update timer display
            const timerElement = document.querySelector('.game-stat-value:last-child');
            if (timerElement) {
                timerElement.textContent = timeLeft + 's';
                if (timeLeft <= 5) {
                    timerElement.classList.add('time-low');
                }
            }
            
            // Update progress bar
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = `${(timeLeft / 15) * 100}%`;
                if (timeLeft <= 5) {
                    progressBar.classList.add('time-warning');
                }
            }
            
            if (timeLeft <= 0) {
                stopTimer();
                handleAnswer(-1); // Time's up, count as incorrect
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }
};

// Handle both direct page load and SPA routing
document.addEventListener('DOMContentLoaded', function() {
    // Only auto-initialize if we're directly on game.html
    if (window.location.pathname.includes('game.html')) {
        window.initializeGame();
    }
    
    // Otherwise, the router will call initializeGame when needed
});