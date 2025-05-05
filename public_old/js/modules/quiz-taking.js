import { apiRequest, showElement } from './utils.js';

window.modules = window.modules || {};

let elements = {};
let publicMethods = {};

let currentAttempt = null;
let currentQuestion = null;
let selectedAnswerId = null;
let questionIndex = 0;
let totalQuestions = 0;
let timerInterval = null;
let remainingTime = 0;

export function initQuizTaking() {
  elements = {
    quizListContainer: document.getElementById('quiz-list-container'),
    quizTakingContainer: document.getElementById('quiz-taking-container'),
    quizSummaryContainer: document.getElementById('quiz-summary-container'),
    availableQuizzesResult: document.getElementById('available-quizzes-result'),
    currentQuizTitle: document.getElementById('current-quiz-title'),
    currentQuizDescription: document.getElementById('current-quiz-description'),
    currentQuestionNumber: document.getElementById('current-question-number'),
    totalQuestions: document.getElementById('total-questions'),
    timerValue: document.getElementById('timer-value'),
    questionText: document.getElementById('question-text'),
    questionDifficulty: document.getElementById('question-difficulty'),
    answersContainer: document.getElementById('answers-container'),
    submitAnswerButton: document.getElementById('submit-answer'),
    nextQuestionButton: document.getElementById('next-question'),
    finishQuizButton: document.getElementById('finish-quiz'),
    backToQuizListButton: document.getElementById('back-to-quiz-list'),
    quizSummaryContent: document.getElementById('quiz-summary-content'),
    backToQuizListFromSummaryButton: document.getElementById('back-to-quiz-list-from-summary'),
    refreshQuizzesButton: document.getElementById('refresh-quizzes')
  };

  elements.availableQuizzesResult.addEventListener('click', handleQuizSelection);
  elements.submitAnswerButton.addEventListener('click', handleSubmitAnswer);
  elements.nextQuestionButton.addEventListener('click', handleNextQuestion);
  elements.finishQuizButton.addEventListener('click', handleFinishQuiz);
  elements.backToQuizListButton.addEventListener('click', handleBackToQuizList);
  elements.backToQuizListFromSummaryButton.addEventListener('click', handleBackToQuizList);
  elements.refreshQuizzesButton.addEventListener('click', loadAvailableQuizzes)
  
  publicMethods = {
    loadAvailableQuizzes,
    startQuiz
  };
  
  window.modules.quizTaking = publicMethods;
  
  return publicMethods;
}

/**
 * Load and display available quizzes
 */
async function loadAvailableQuizzes() {
  try {
    if (elements.refreshQuizzesButton) {
      elements.refreshQuizzesButton.disabled = true;
      elements.refreshQuizzesButton.textContent = 'Refreshing...';
    }
    
    elements.availableQuizzesResult.innerHTML = 'Loading quizzes...';
    
    const quizzes = await apiRequest('/api/quizzes?valid=true');
    
    if (Array.isArray(quizzes) && quizzes.length > 0) {
      const quizzesList = quizzes.map(quiz => 
        `<div class="quiz-item" data-id="${quiz.quiz_id}">
          <h4>${quiz.quiz_title}</h4>
          <p>${quiz.quiz_description || 'No description'}</p>
          <p>Category: ${quiz.category_name || 'Uncategorized'}</p>
          <p>Questions: ${quiz.question_count || 'Unknown'}</p>
          <button class="start-quiz-btn" data-id="${quiz.quiz_id}">Start Quiz</button>
        </div>`
      ).join('');
      
      elements.availableQuizzesResult.innerHTML = quizzesList;
    } else {
      elements.availableQuizzesResult.innerHTML = '<p>No quizzes available. Quizzes need at least 5 valid questions to be playable.</p>';
    }
  } catch (error) {
    elements.availableQuizzesResult.innerHTML = `<p>Error loading quizzes: ${error.message}</p>`;
  } finally {
    if (elements.refreshQuizzesButton) {
      elements.refreshQuizzesButton.disabled = false;
      elements.refreshQuizzesButton.textContent = 'Refresh Available Quizzes';
    }
  }
}

/**
 * Handle quiz selection
 */
function handleQuizSelection(event) {
  if (event.target.classList.contains('start-quiz-btn')) {
    const quizId = event.target.getAttribute('data-id');
    startQuiz(quizId);
  }
}

/**
 * Start a quiz
 */
async function startQuiz(quizId) {
  try {
    currentAttempt = null;
    currentQuestion = null;
    selectedAnswerId = null;
    questionIndex = 0;
    
    const attempt = await apiRequest('/api/quiz-attempts/start', {
      method: 'POST',
      body: JSON.stringify({ quiz_id: quizId })
    });
    
    currentAttempt = attempt;
    totalQuestions = attempt.questions.length;
    
    elements.currentQuizTitle.textContent = attempt.quiz_title;
    elements.currentQuizDescription.textContent = attempt.quiz_description || '';
    elements.totalQuestions.textContent = totalQuestions;
    
    showElement(
      elements.quizTakingContainer,
      [elements.quizListContainer, elements.quizSummaryContainer]
    );
    
    loadNextQuestion();
  } catch (error) {
    alert(`Error starting quiz: ${error.message}`);
  }
}

/**
 * Load the next question
 */
async function loadNextQuestion() {
  try {
    if (currentAttempt && currentAttempt.questions && questionIndex < currentAttempt.questions.length) {
      currentQuestion = currentAttempt.questions[questionIndex];
      
      if (currentQuestion.response_id) {
        questionIndex++;
        if (questionIndex < currentAttempt.questions.length) {
          currentQuestion = currentAttempt.questions[questionIndex];
        } else {
          await handleFinishQuiz();
          return;
        }
      }
      
      elements.currentQuestionNumber.textContent = questionIndex + 1;
      elements.questionText.textContent = currentQuestion.question_text;
      elements.questionDifficulty.textContent = `Difficulty: ${currentQuestion.difficulty_level} (${currentQuestion.time_limit_seconds}s, +${currentQuestion.points_on_correct}/-${Math.abs(currentQuestion.points_on_incorrect)})`;
      
      selectedAnswerId = null;
      elements.submitAnswerButton.disabled = true;
      
      displayAnswers(currentQuestion.answers);
      
      startTimer(currentQuestion.time_limit_seconds);
      
      elements.submitAnswerButton.style.display = 'inline-block';
      elements.nextQuestionButton.style.display = 'none';
      elements.finishQuizButton.style.display = 'none';
    } else {
      await handleFinishQuiz();
    }
  } catch (error) {
    alert(`Error loading next question: ${error.message}`);
  }
}

/**
 * Display answer options for a question
 */
function displayAnswers(answers) {
  if (!answers || !Array.isArray(answers)) {
    elements.answersContainer.innerHTML = '<p>No answers available for this question.</p>';
    return;
  }
  
  const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);
  
  const answersHtml = shuffledAnswers.map(answer => 
    `<div class="answer-option" data-id="${answer.answer_id}">
      ${answer.answer_text}
    </div>`
  ).join('');
  
  elements.answersContainer.innerHTML = answersHtml;
  
  Array.from(document.getElementsByClassName('answer-option')).forEach(option => {
    option.addEventListener('click', handleAnswerSelection);
  });
}

/**
 * Handle answer selection
 */
function handleAnswerSelection(event) {
  Array.from(document.getElementsByClassName('answer-option')).forEach(option => {
    option.classList.remove('selected');
  });
  
  event.target.classList.add('selected');
  
  selectedAnswerId = event.target.getAttribute('data-id');
  
  elements.submitAnswerButton.disabled = false;
}

/**
 * Start timer for the current question
 */
function startTimer(seconds) {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  remainingTime = seconds;
  
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    remainingTime--;
    
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      handleTimeUp();
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

/**
 * Update timer display
 */
function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  
  elements.timerValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  if (remainingTime <= 5) {
    elements.timerValue.style.color = 'red';
  } else {
    elements.timerValue.style.color = 'black';
  }
}

/**
 * Handle when time runs out
 */
function handleTimeUp() {
  if (!selectedAnswerId) {
    alert('Time\'s up! Moving to the next question.');
    
    questionIndex++;
    loadNextQuestion();
  }
}

/**
 * Handle submit answer button click
 */
async function handleSubmitAnswer() {
  try {
    elements.submitAnswerButton.disabled = true;
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    if (!selectedAnswerId) {
      alert('Please select an answer.');
      elements.submitAnswerButton.disabled = false;
      return;
    }
    
    const response = await apiRequest('/api/user-responses/submit', {
      method: 'POST',
      body: JSON.stringify({
        attempt_id: currentAttempt.attempt_id,
        question_id: currentQuestion.question_id,
        answer_id: selectedAnswerId
      })
    });
    
    showAnswerFeedback(response);
    
    const questionInAttempt = currentAttempt.questions.find(q => q.question_id === currentQuestion.question_id);
    if (questionInAttempt) {
      questionInAttempt.response_id = response.response_id;
    }
    
    const isLastQuestion = questionIndex === totalQuestions - 1;
    
    elements.submitAnswerButton.style.display = 'none';
    
    if (isLastQuestion || response.quiz_completed) {
      elements.finishQuizButton.style.display = 'inline-block';
    } else {
      elements.nextQuestionButton.style.display = 'inline-block';
    }
  } catch (error) {
    alert(`Error submitting answer: ${error.message}`);
    elements.submitAnswerButton.disabled = false;
  }
}

/**
 * Show feedback for submitted answer
 */
function showAnswerFeedback(response) {
    const answerOptions = document.getElementsByClassName('answer-option');
    
    Array.from(answerOptions).forEach(option => {
      const answerId = parseInt(option.getAttribute('data-id'));
      
      const answer = currentQuestion.answers.find(a => a.answer_id === answerId);
      
      if (answer.is_correct) {
        option.classList.add('correct');
      } else if (answerId === parseInt(response.answer_id) && !answer.is_correct) {
        option.classList.add('incorrect');
      }
    });
    
    const pointsMessage = document.createElement('p');
    pointsMessage.textContent = `Points earned: ${response.points_earned}`;
    pointsMessage.style.fontWeight = 'bold';
    
    if (response.points_earned > 0) {
      pointsMessage.style.color = 'green';
    } else {
      pointsMessage.style.color = 'red';
    }
    
    elements.answersContainer.appendChild(pointsMessage);
    
    Array.from(answerOptions).forEach(option => {
      option.removeEventListener('click', handleAnswerSelection);
      option.style.cursor = 'default';
    });
  }

/**
 * Handle next question button click
 */
function handleNextQuestion() {
  questionIndex++;
  
  loadNextQuestion();
}

/**
 * Handle finish quiz button click
 */
async function handleFinishQuiz() {
  try {
    const summary = await apiRequest(`/api/quiz-attempts/${currentAttempt.attempt_id}/complete`, {
      method: 'PUT'
    });
    
    const detailedSummary = await apiRequest(`/api/quiz-attempts/${currentAttempt.attempt_id}/summary`);
    
    showQuizSummary(detailedSummary);
  } catch (error) {
    alert(`Error completing quiz: ${error.message}`);
  }
}

/**
 * Show quiz summary
 */
function showQuizSummary(summary) {
  const answeredQuestionsPercent = Math.round((summary.answered_questions / summary.total_questions) * 100);
  const correctAnswersPercent = summary.answered_questions > 0 
    ? Math.round((summary.correct_answers / summary.answered_questions) * 100) 
    : 0;
  
  let summaryHtml = `
    <div class="quiz-summary-stat">
      <h3>${summary.quiz_title}</h3>
      <p>Total Score: <strong>${summary.total_points}</strong> points</p>
    </div>
    
    <div class="quiz-summary-section">
      <h4>Statistics</h4>
      <p>Questions Answered: ${summary.answered_questions} / ${summary.total_questions} (${answeredQuestionsPercent}%)</p>
      <p>Correct Answers: ${summary.correct_answers} / ${summary.answered_questions} (${correctAnswersPercent}%)</p>
      <p>Incorrect Answers: ${summary.incorrect_answers}</p>
    </div>
  `;
  
  if (summary.score_by_difficulty && Object.keys(summary.score_by_difficulty).length > 0) {
    summaryHtml += `
      <div class="quiz-summary-section">
        <h4>Score by Difficulty</h4>
        <div class="score-breakdown">
          <table>
            <thead>
              <tr>
                <th>Difficulty</th>
                <th>Questions</th>
                <th>Correct</th>
                <th>Incorrect</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    Object.entries(summary.score_by_difficulty).forEach(([difficulty, stats]) => {
      summaryHtml += `
        <tr>
          <td>${difficulty}</td>
          <td>${stats.total}</td>
          <td>${stats.correct}</td>
          <td>${stats.incorrect}</td>
          <td>${stats.points}</td>
        </tr>
      `;
    });
    
    summaryHtml += `
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  
  if (summary.start_time && summary.end_time) {
    const startTime = new Date(summary.start_time);
    const endTime = new Date(summary.end_time);
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    
    summaryHtml += `
      <div class="quiz-summary-section">
        <h4>Time</h4>
        <p>Start: ${startTime.toLocaleString()}</p>
        <p>End: ${endTime.toLocaleString()}</p>
        <p>Duration: ${minutes} minutes, ${seconds} seconds</p>
      </div>
    `;
  }
  
  elements.quizSummaryContent.innerHTML = summaryHtml;
  
  showElement(
    elements.quizSummaryContainer,
    [elements.quizTakingContainer, elements.quizListContainer]
  );
}

/**
 * Handle back to quiz list button click
 */
function handleBackToQuizList() {
  currentAttempt = null;
  currentQuestion = null;
  selectedAnswerId = null;
  questionIndex = 0;
  totalQuestions = 0;
  
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  showElement(
    elements.quizListContainer,
    [elements.quizTakingContainer, elements.quizSummaryContainer]
  );
  
  loadAvailableQuizzes();
}