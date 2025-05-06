import { apiRequest } from './utils.js';

window.modules = window.modules || {};

let elements = {};
let publicMethods = {};

/**
 * Initialize the difficulty level management module
 */
export function initDifficultyManagement() {
  elements = {
    getDifficultiesButton: document.getElementById('get-difficulties'),
    difficultiesResult: document.getElementById('difficulties-result'),
    difficultyForm: document.getElementById('difficulty-form'),
    difficultyLevelInput: document.getElementById('difficulty-level'),
    timeLimitInput: document.getElementById('time-limit'),
    pointsCorrectInput: document.getElementById('points-correct'),
    pointsIncorrectInput: document.getElementById('points-incorrect'),
    questionDifficultySelect: document.getElementById('question-difficulty')
  };

  elements.getDifficultiesButton.addEventListener('click', fetchDifficultyLevels);
  elements.difficultyForm.addEventListener('submit', handleDifficultySubmit);
  
  publicMethods = {
    fetchDifficultyLevels,
    populateDifficultyDropdown
  };
  
  window.modules.difficulties = publicMethods;
  
  return publicMethods;
}

/**
 * Fetch and display all difficulty levels
 */
async function fetchDifficultyLevels() {
  try {
    elements.difficultiesResult.innerHTML = 'Loading...';
    
    const data = await apiRequest('/api/difficulty-levels');
    
    if (Array.isArray(data)) {
      if (data.length === 0) {
        elements.difficultiesResult.innerHTML = '<p>No difficulty levels found.</p>';
      } else {
        const difficultyList = data.map(difficulty => 
          `<li data-id="${difficulty.difficulty_id}">
            <strong>${difficulty.difficulty_level}</strong>
            <ul>
              <li>Time limit: ${difficulty.time_limit_seconds} seconds</li>
              <li>Points on correct: ${difficulty.points_on_correct}</li>
              <li>Points on incorrect: ${difficulty.points_on_incorrect}</li>
            </ul>
            <button class="delete-difficulty" data-id="${difficulty.difficulty_id}">Delete</button>
          </li>`
        ).join('');
        
        elements.difficultiesResult.innerHTML = `<ul>${difficultyList}</ul>`;
        
        Array.from(document.getElementsByClassName('delete-difficulty')).forEach(button => {
          button.addEventListener('click', handleDeleteDifficulty);
        });
        
        populateDifficultyDropdown(data);
      }
    } else {
      elements.difficultiesResult.innerHTML = `<p>Error: Unexpected response format</p>`;
    }
  } catch (error) {
    elements.difficultiesResult.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

/**
 * Populate the difficulty dropdown in the question form
 */
function populateDifficultyDropdown(difficulties) {
  if (!elements.questionDifficultySelect) return;
  
  while (elements.questionDifficultySelect.options.length > 1) {
    elements.questionDifficultySelect.remove(1);
  }
  
  difficulties.forEach(difficulty => {
    const option = document.createElement('option');
    option.value = difficulty.difficulty_id;
    option.textContent = `${difficulty.difficulty_level} (${difficulty.time_limit_seconds}s, +${difficulty.points_on_correct}/-${Math.abs(difficulty.points_on_incorrect)})`;
    elements.questionDifficultySelect.appendChild(option);
  });
}

/**
 * Handle form submission to create a new difficulty level
 */
async function handleDifficultySubmit(event) {
  event.preventDefault();
  
  const level = elements.difficultyLevelInput.value.trim();
  const timeLimit = parseInt(elements.timeLimitInput.value);
  const pointsCorrect = parseInt(elements.pointsCorrectInput.value);
  const pointsIncorrect = parseInt(elements.pointsIncorrectInput.value);
  
  if (!level) {
    alert('Difficulty level name is required!');
    return;
  }
  
  if (isNaN(timeLimit) || timeLimit <= 0) {
    alert('Time limit must be a positive number!');
    return;
  }
  
  if (isNaN(pointsCorrect)) {
    alert('Points on correct must be a number!');
    return;
  }
  
  if (isNaN(pointsIncorrect)) {
    alert('Points on incorrect must be a number!');
    return;
  }
  
  try {
    await apiRequest('/api/difficulty-levels', {
      method: 'POST',
      body: JSON.stringify({
        difficulty_level: level,
        time_limit_seconds: timeLimit,
        points_on_correct: pointsCorrect,
        points_on_incorrect: pointsIncorrect
      })
    });
    
    alert('Difficulty level created successfully!');
    elements.difficultyLevelInput.value = '';
    elements.timeLimitInput.value = '';
    elements.pointsCorrectInput.value = '';
    elements.pointsIncorrectInput.value = '';
    fetchDifficultyLevels();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

/**
 * Handle delete button click for difficulty level
 */
async function handleDeleteDifficulty(event) {
  const difficultyId = event.target.getAttribute('data-id');
  
  if (confirm('Are you sure you want to delete this difficulty level?')) {
    try {
      await apiRequest(`/api/difficulty-levels/${difficultyId}`, {
        method: 'DELETE'
      });
      
      alert('Difficulty level deleted successfully!');
      fetchDifficultyLevels();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
}