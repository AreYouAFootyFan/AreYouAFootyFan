import { initCategoryManagement } from './modules/categories.js';
import { initDifficultyManagement } from './modules/difficulties.js';
import { initQuizManagement } from './modules/quizzes.js';
import { initQuestionManagement } from './modules/questions.js';
import { initAnswerManagement } from './modules/answers.js';
import { initQuizTaking } from './modules/quiz-taking.js';
import { auth } from './modules/auth.js';

export const state = {
  currentQuizId: null,
  currentQuestionId: null
};

document.addEventListener('DOMContentLoaded', () => {
  initializeModules();
});

function initializeModules() {
  initCategoryManagement();
  initDifficultyManagement();
  initQuizManagement();
  initQuestionManagement();
  initAnswerManagement();
  initQuizTaking();
}