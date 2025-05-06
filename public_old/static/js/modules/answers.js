import { apiRequest, showElement } from './utils.js';
import { state } from '../app.js';

window.modules = window.modules || {};

let elements = {};
let publicMethods = {};

/**
 * Initialize the answer management module
 */
export function initAnswerManagement() {
  elements = {
    answerFormContainer: document.getElementById('answer-form-container'),
    answersListContainer: document.getElementById('answers-list-container'),
    selectedQuestionText: document.getElementById('selected-question-text'),
    answersQuestionText: document.getElementById('answers-question-text'),
    answerForm: document.getElementById('answer-form'),
    answerQuestionIdInput: document.getElementById('answer-question-id'),
    answerTextInput: document.getElementById('answer-text'),
    answerCorrectInput: document.getElementById('answer-correct'),
    answersResult: document.getElementById('answers-result'),
    answerStatus: document.getElementById('answer-status'),
    backToQuestionsButton: document.getElementById('back-to-questions'),
    addNewAnswerButton: document.getElementById('add-new-answer'),
    backFromAnswersButton: document.getElementById('back-from-answers'),
    questionsListContainer: document.getElementById('questions-list-container')
  };

  elements.answerForm.addEventListener('submit', handleAnswerSubmit);
  elements.backToQuestionsButton.addEventListener('click', handleBackToQuestions);
  elements.addNewAnswerButton.addEventListener('click', handleAddNewAnswer);
  elements.backFromAnswersButton.addEventListener('click', handleBackToQuestions);
  
  publicMethods = {
    fetchAnswersByQuestionId
  };
  
  window.modules.answers = publicMethods;
  
  return publicMethods;
}

/**
 * Fetch and display answers for a question
 */
async function fetchAnswersByQuestionId(questionId) {
  try {
    elements.answersResult.innerHTML = 'Loading...';
    
    const data = await apiRequest(`/api/answers/question/${questionId}`);
    
    const validationData = await apiRequest(`/api/questions/${questionId}/validate`);
   
    
    const statusClass = validationData.validation.isValid ? 'valid-status' : 'invalid-status';
    elements.answerStatus.innerHTML = `<p class="${statusClass}">${validationData.validation.message}</p>`;
    
    if (Array.isArray(data)) {
      if (data.length === 0) {
        elements.answersResult.innerHTML = '<p>No answers found for this question. Add exactly 4 answers with 1 marked as correct.</p>';
      } else {
        const answersList = data.map(answer => 
          `<li data-id="${answer.answer_id}">
            <div class="answer-item">
              ${answer.is_correct ? '<span class="correct-indicator">✓</span>' : '<span></span>'}
              <span>${answer.answer_text}</span>
              <div class="answer-actions">
                ${!answer.is_correct ? `<button class="mark-correct" data-id="${answer.answer_id}">Mark as Correct</button>` : ''}
                <button class="delete-answer" data-id="${answer.answer_id}">Delete</button>
              </div>
            </div>
          </li>`
        ).join('');
        
        elements.answersResult.innerHTML = `<ul>${answersList}</ul>`;
        
        Array.from(document.getElementsByClassName('mark-correct')).forEach(button => {
          button.addEventListener('click', handleMarkCorrect);
        });
        
        Array.from(document.getElementsByClassName('delete-answer')).forEach(button => {
          button.addEventListener('click', handleDeleteAnswer);
        });
      }
      
      if (data.length >= 4) {
        if (elements.addNewAnswerButton) {
          elements.addNewAnswerButton.style.display = 'none';
        }
      } else {
        if (elements.addNewAnswerButton) {
          elements.addNewAnswerButton.style.display = 'inline-block';
        }
      }
    } else {
      elements.answersResult.innerHTML = `<p>Error: Unexpected response format</p>`;
    }
  } catch (error) {
    elements.answersResult.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

/**
 * Handle form submission to create a new answer
 */
async function handleAnswerSubmit(event) {
  event.preventDefault();
  
  const questionId = elements.answerQuestionIdInput.value;
  const answerText = elements.answerTextInput.value.trim();
  const isCorrect = elements.answerCorrectInput.checked;
  
  if (!answerText) {
    alert('Answer text is required!');
    return;
  }
  
  try {
    await apiRequest('/api/answers', {
      method: 'POST',
      body: JSON.stringify({
        question_id: questionId,
        answer_text: answerText,
        is_correct: isCorrect
      })
    });
    
    alert('Answer added successfully!');
    
    showElement(
      elements.answersListContainer,
      [elements.answerFormContainer]
    );
    
    fetchAnswersByQuestionId(questionId);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

/**
 * Handle delete button click for answer
 */
async function handleDeleteAnswer(event) {
  const answerId = event.target.getAttribute('data-id');
  
  if (confirm('Are you sure you want to delete this answer?')) {
    try {
      await apiRequest(`/api/answers/${answerId}`, {
        method: 'DELETE'
      });
      
      alert('Answer deleted successfully!');
      fetchAnswersByQuestionId(state.currentQuestionId);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
}

/**
 * Handle mark as correct button click
 */
async function handleMarkCorrect(event) {
  const answerId = event.target.getAttribute('data-id');
  
  try {
    await apiRequest(`/api/answers/${answerId}/mark-correct`, {
      method: 'PUT'
    });
    
    alert('Answer marked as correct!');
    fetchAnswersByQuestionId(state.currentQuestionId);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

/**
 * Handle click on "Back to Questions" button
 */
async function handleBackToQuestions() {
  try {
    const currentQuizId = state.currentQuizId;
    state.currentQuestionId = null;
    
    showElement(
      elements.questionsListContainer,
      [elements.answerFormContainer, elements.answersListContainer]
    );
    
    const questionsModule = window.modules.questions;
    if (questionsModule && questionsModule.fetchQuestionsByQuizId) {
      await questionsModule.fetchQuestionsByQuizId(currentQuizId);
    }
  } catch (error) {
    console.error('Error returning to questions view:', error);
  }
}
/**
 * Handle click on "Add New Answer" button
 */
function handleAddNewAnswer() {
  elements.selectedQuestionText.textContent = elements.answersQuestionText.textContent;
  elements.answerQuestionIdInput.value = state.currentQuestionId;
  elements.answerTextInput.value = '';
  elements.answerCorrectInput.checked = false;
  
  showElement(
    elements.answerFormContainer,
    [elements.answersListContainer]
  );
}