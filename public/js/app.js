import { initCategoryManagement } from './modules/categories.js';
import { initDifficultyManagement } from './modules/difficulties.js';
import { initQuizManagement } from './modules/quizzes.js';
import { initQuestionManagement } from './modules/questions.js';
import { initAnswerManagement } from './modules/answers.js';
import { initQuizTaking } from './modules/quiz-taking.js';

export const state = {
  currentQuizId: null,
  currentQuestionId: null
};

document.addEventListener('DOMContentLoaded', () => {
  initCategoryManagement();
  initDifficultyManagement();
  initQuizManagement();
  initQuestionManagement();
  initAnswerManagement();
  initQuizTaking();
  
  const categoryModule = window.modules.categories;
  const difficultyModule = window.modules.difficulties;
  const quizModule = window.modules.quizzes;
  const quizTakingModule = window.modules.quizTaking;
  
  categoryModule.fetchCategories();
  difficultyModule.fetchDifficultyLevels();
  quizModule.fetchQuizzes();
  quizTakingModule.loadAvailableQuizzes();
});