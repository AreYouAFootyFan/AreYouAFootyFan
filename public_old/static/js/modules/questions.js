import { apiRequest, showElement } from './utils.js';
import { state } from '../app.js';

window.modules = window.modules || {};

let elements = {};
let publicMethods = {};

/**
 * Initialize the question management module
 */
export function initQuestionManagement() {
  elements = {
    questionFormContainer: document.getElementById('question-form-container'),
    questionsListContainer: document.getElementById('questions-list-container'),
    selectedQuizTitle: document.getElementById('selected-quiz-title'),
    questionsQuizTitle: document.getElementById('questions-quiz-title'),
    questionForm: document.getElementById('question-form'),
    questionQuizIdInput: document.getElementById('question-quiz-id'),
    questionTextInput: document.getElementById('question-text'),
    questionDifficultySelect: document.getElementById('question-difficulty'),
    questionsResult: document.getElementById('questions-result'),
    backToQuizzesButton: document.getElementById('back-to-quizzes'),
    addNewQuestionButton: document.getElementById('add-new-question'),
    backFromQuestionsButton: document.getElementById('back-from-questions'),
    answerFormContainer: document.getElementById('answer-form-container'),
    answersListContainer: document.getElementById('answers-list-container')
  };

  elements.questionForm.addEventListener('submit', handleQuestionSubmit);
  elements.backToQuizzesButton.addEventListener('click', handleBackToQuizzes);
  elements.addNewQuestionButton.addEventListener('click', handleAddNewQuestion);
  elements.backFromQuestionsButton.addEventListener('click', handleBackToQuizzes);
  
  publicMethods = {
    fetchQuestionsByQuizId,
    handleManageAnswers
  };
  
  window.modules.questions = publicMethods;
  
  return publicMethods;
}

/**
 * Fetch and display questions for a quiz
 */
async function fetchQuestionsByQuizId(quizId) {
  try {
    elements.questionsResult.innerHTML = 'Loading...';
    
    const data = await apiRequest(`/api/questions/quiz/${quizId}`);
    
    if (Array.isArray(data)) {
      if (data.length === 0) {
        elements.questionsResult.innerHTML = '<p>No questions found for this quiz. Add at least 5 questions.</p>';
      } else {
        const questionsList = data.map(question => {
          const isValid = question.answer_count == 4 && question.correct_answer_count == 1;
          const statusClass = isValid ? 'valid-status' : 'invalid-status';
          const statusText = isValid 
            ? 'Valid: 4 answers with 1 correct' 
            : `Invalid: ${question.answer_count}/4 answers, ${question.correct_answer_count}/1 correct answers`;
          
          return `<li data-id="${question.question_id}">
            <div class="question-details">
              <strong>${question.question_text}</strong>
              <p>Difficulty: ${question.difficulty_level} (${question.time_limit_seconds}s, +${question.points_on_correct}/-${Math.abs(question.points_on_incorrect)})</p>
              <p class="${statusClass}">${statusText}</p>
              <button class="manage-answers" data-id="${question.question_id}" data-text="${question.question_text}">Manage Answers</button>
              <button class="delete-question" data-id="${question.question_id}">Delete</button>
            </div>
          </li>`;
        }).join('');
        
        const validQuestionsCount = data.filter(q => q.answer_count == 4 && q.correct_answer_count == 1).length;
        const totalQuestionsCount = data.length;
        
        const quizStatus = totalQuestionsCount >= 5 && validQuestionsCount >= 5 
          ? '<p class="valid-status">Quiz is ready: Has 5+ valid questions</p>' 
          : `<p class="invalid-status">Quiz needs more questions: ${validQuestionsCount}/5 valid questions</p>`;
        
        elements.questionsResult.innerHTML = quizStatus + `<ul>${questionsList}</ul>`;
        
        Array.from(document.getElementsByClassName('manage-answers')).forEach(button => {
          button.addEventListener('click', handleManageAnswers);
        });
        
        Array.from(document.getElementsByClassName('delete-question')).forEach(button => {
          button.addEventListener('click', handleDeleteQuestion);
        });
      }
    } else {
      elements.questionsResult.innerHTML = `<p>Error: Unexpected response format</p>`;
    }
  } catch (error) {
    elements.questionsResult.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

/**
 * Handle form submission to create a new question
 */
async function handleQuestionSubmit(event) {
  event.preventDefault();
  
  const quizId = elements.questionQuizIdInput.value;
  const questionText = elements.questionTextInput.value.trim();
  const difficultyId = elements.questionDifficultySelect.value;
  
  if (!questionText) {
    alert('Question text is required!');
    return;
  }
  
  if (!difficultyId) {
    alert('Difficulty level is required!');
    return;
  }
  
  try {
    const data = await apiRequest('/api/questions', {
      method: 'POST',
      body: JSON.stringify({
        quiz_id: quizId,
        question_text: questionText,
        difficulty_id: difficultyId
      })
    });
    
    alert('Question created successfully! Now you can add answers to it.');
    
    state.currentQuestionId = data.question_id;
    
    const answersQuestionText = document.getElementById('answers-question-text');
    const answerQuestionIdInput = document.getElementById('answer-question-id');
    
    if (answersQuestionText) {
      answersQuestionText.textContent = data.question_text;
    }
    
    if (answerQuestionIdInput) {
      answerQuestionIdInput.value = data.question_id;
    }
    
    showElement(
      elements.answersListContainer,
      [elements.questionFormContainer, elements.questionsListContainer, elements.answerFormContainer]
    );
    
    const answersModule = window.modules.answers;
    if (answersModule && answersModule.fetchAnswersByQuestionId) {
      answersModule.fetchAnswersByQuestionId(data.question_id);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

/**
 * Handle delete button click for question
 */
async function handleDeleteQuestion(event) {
  const questionId = event.target.getAttribute('data-id');
  
  if (confirm('Are you sure you want to delete this question and all its answers?')) {
    try {
      await apiRequest(`/api/questions/${questionId}`, {
        method: 'DELETE'
      });
      
      alert('Question deleted successfully!');
      fetchQuestionsByQuizId(state.currentQuizId);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
}

async function handleManageAnswers(event) {
  try {
    const questionId = event.target.getAttribute('data-id');
    const questionText = event.target.getAttribute('data-text');
    
    state.currentQuestionId = questionId;
    
    const answersQuestionText = document.getElementById('answers-question-text');
    if (answersQuestionText) {
      answersQuestionText.textContent = questionText;
    }
    
    showElement(
      elements.answersListContainer,
      [elements.questionFormContainer, elements.questionsListContainer, elements.answerFormContainer]
    );
    
    const answersResult = document.getElementById('answers-result');
    if (answersResult) {
      answersResult.innerHTML = 'Loading...';
    }
    
    const addNewAnswerButton = document.getElementById('add-new-answer');
    if (addNewAnswerButton) {
      addNewAnswerButton.style.display = 'inline-block';
    }
    
    const answersModule = window.modules.answers;
    if (answersModule && answersModule.fetchAnswersByQuestionId) {
      await answersModule.fetchAnswersByQuestionId(questionId);
    }
  } catch (error) {
    console.error('Error managing answers:', error);
  }
}

/**
 * Handle click on "Back to Quizzes" button
 */
function handleBackToQuizzes() {
  state.currentQuizId = null;
  
  showElement(
    document.querySelector('body'), 
    [elements.questionFormContainer, elements.questionsListContainer]
  );
}

/**
 * Handle click on "Add New Question" button
 */
function handleAddNewQuestion() {
  elements.selectedQuizTitle.textContent = elements.questionsQuizTitle.textContent;
  elements.questionQuizIdInput.value = state.currentQuizId;
  elements.questionTextInput.value = '';
  if (elements.questionDifficultySelect) {
    elements.questionDifficultySelect.selectedIndex = 0;
  }
  
  showElement(
    elements.questionFormContainer,
    [elements.questionsListContainer]
  );
}