import { apiRequest, showElement } from './utils.js';
import { state } from '../app.js';

window.modules = window.modules || {};

let elements = {};
let publicMethods = {};

/**
 * Initialize the quiz management module
 */
export function initQuizManagement() {
  elements = {
    getQuizzesButton: document.getElementById('get-quizzes'),
    quizzesResult: document.getElementById('quizzes-result'),
    quizForm: document.getElementById('quiz-form'),
    quizTitleInput: document.getElementById('quiz-title'),
    quizDescriptionInput: document.getElementById('quiz-description'),
    quizCategorySelect: document.getElementById('quiz-category'),
    questionFormContainer: document.getElementById('question-form-container'),
    questionsListContainer: document.getElementById('questions-list-container')
  };

  elements.getQuizzesButton.addEventListener('click', fetchQuizzes);
  elements.quizForm.addEventListener('submit', handleQuizSubmit);
  
  publicMethods = {
    fetchQuizzes,
    handleViewQuizQuestions
  };
  
  window.modules.quizzes = publicMethods;
  
  return publicMethods;
}

/**
 * Fetch and display all quizzes
 */
async function fetchQuizzes() {
  try {
    elements.quizzesResult.innerHTML = 'Loading...';
    const quizzes = await apiRequest('/api/quizzes');    
    if (Array.isArray(quizzes)) {
      if (quizzes.length === 0) {
        elements.quizzesResult.innerHTML = '<p>No quizzes found.</p>';
      } else {
        const quizzesWithStatus = await Promise.all(quizzes.map(async (quiz) => {
          try {
            const statusResponse = await apiRequest(`/api/quizzes/${quiz.quiz_id}/status`);
            const status = await statusResponse.json();
            return {
              ...quiz,
              is_ready: status.is_ready,
              has_enough_questions: status.has_enough_questions
            };
          } catch {
            return {
              ...quiz,
              is_ready: false,
              has_enough_questions: false
            };
          }
        }));
        
        const quizzesList = quizzesWithStatus.map(quiz => {
          const statusClass = quiz.is_ready ? 'valid-status' : 'invalid-status';
          const statusText = quiz.is_ready 
            ? 'Ready to take' 
            : 'Not ready - needs valid questions';
            
          return `<li data-id="${quiz.quiz_id}">
            <strong>${quiz.quiz_title}</strong>
            <p>${quiz.quiz_description || 'No description'}</p>
            <p>Category: ${quiz.category_name || 'None'}</p>
            <p>Created: ${new Date(quiz.created_at).toLocaleString()}</p>
            <p class="${statusClass}">${statusText}</p>
            <button class="view-quiz-questions" data-id="${quiz.quiz_id}" data-title="${quiz.quiz_title}">Manage Questions</button>
            <button class="delete-quiz" data-id="${quiz.quiz_id}">Delete</button>
          </li>`;
        }).join('');
        
        elements.quizzesResult.innerHTML = `<ul>${quizzesList}</ul>`;
        
        Array.from(document.getElementsByClassName('view-quiz-questions')).forEach(button => {
          button.addEventListener('click', handleViewQuizQuestions);
        });
        
        Array.from(document.getElementsByClassName('delete-quiz')).forEach(button => {
          button.addEventListener('click', handleDeleteQuiz);
        });
      }
    } else {
      elements.quizzesResult.innerHTML = `<p>Error: Unexpected response format</p>`;
    }
  } catch (error) {
    elements.quizzesResult.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

/**
 * Handle form submission to create a new quiz
 */
async function handleQuizSubmit(event) {
  event.preventDefault();
  
  const title = elements.quizTitleInput.value.trim();
  const description = elements.quizDescriptionInput.value.trim();
  const categoryId = elements.quizCategorySelect.value;
  
  if (!title) {
    alert('Quiz title is required!');
    return;
  }
  
  try {
    await apiRequest('/api/quizzes', {
      method: 'POST',
      body: JSON.stringify({
        quiz_title: title,
        quiz_description: description || undefined,
        category_id: categoryId || undefined
      })
    });
    
    alert('Quiz created successfully! Now you can add questions to it.');
    elements.quizTitleInput.value = '';
    elements.quizDescriptionInput.value = '';
    elements.quizCategorySelect.selectedIndex = 0;
    fetchQuizzes();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

/**
 * Handle delete button click for quiz
 */
async function handleDeleteQuiz(event) {
  const quizId = event.target.getAttribute('data-id');
  
  if (confirm('Are you sure you want to delete this quiz?')) {
    try {
      await apiRequest(`/api/quizzes/${quizId}`, {
        method: 'DELETE'
      });
      
      alert('Quiz deleted successfully!');
      fetchQuizzes();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
}

/**
 * Handle click on "Manage Questions" button for a quiz
 */
function handleViewQuizQuestions(event) {
  const quizId = event.target.getAttribute('data-id');
  const quizTitle = event.target.getAttribute('data-title');
  
  state.currentQuizId = quizId;
  
  const questionsQuizTitle = document.getElementById('questions-quiz-title');
  if (questionsQuizTitle) {
    questionsQuizTitle.textContent = quizTitle;
  }
  
  showElement(
    elements.questionsListContainer, 
    [elements.questionFormContainer, document.getElementById('answer-form-container'), document.getElementById('answers-list-container')]
  );
  
  const questionsModule = window.modules.questions;
  if (questionsModule && questionsModule.fetchQuestionsByQuizId) {
    questionsModule.fetchQuestionsByQuizId(quizId);
  }
}