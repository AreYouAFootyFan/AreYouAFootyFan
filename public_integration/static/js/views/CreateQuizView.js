import AbstractView from "./AbstractView.js";
import authService from "../services/auth.service.js";
import quizService from "../services/quiz.service.js";
import categoryService from "../services/category.service.js";
import questionService from "../services/question.service.js";
import difficultyService from "../services/difficulty.service.js";
import answerService from "../services/answer.service.js";

export default class CreateQuizView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Create Quiz");
    
    this.quizId = localStorage.getItem('selected_quiz_id');
    this.quizTitle = localStorage.getItem('selected_quiz_title');
    this.isEditing = !!this.quizId;
    
    this.currentQuestionId = localStorage.getItem('current_question_id') || null;
    
    if (this.isEditing) {
      this.setTitle(`Edit Quiz: ${this.quizTitle}`);
    }
    
    this.categories = [];
    this.difficulties = [];
    this.questions = [];
    this.viewMode = this.isEditing ? 'questions' : 'quiz';
  }

  async getHtml() {
    return `
      <main class="quiz-creator">
        <div class="creator-container">
          <aside class="creator-sidebar">
            <div class="step-indicator ${this.viewMode === 'quiz' ? 'active' : this.isEditing ? 'completed' : ''}">
              <div class="step-number">1</div>
              <div class="step-label">Quiz Details</div>
            </div>
            <div class="step-connector"></div>
            <div class="step-indicator ${this.viewMode === 'questions' ? 'active' : ''}">
              <div class="step-number">2</div>
              <div class="step-label">Manage Questions</div>
            </div>
            <div class="step-connector"></div>
            <div class="step-indicator ${this.viewMode === 'question-form' || this.viewMode === 'answers' ? 'active' : ''}">
              <div class="step-number">3</div>
              <div class="step-label">Question Details</div>
            </div>
            
            <div class="sidebar-actions">
              <a href="/admin" class="creator-btn secondary-btn" data-link>Back to Dashboard</a>
            </div>
          </aside>

          <section class="creator-content">
            <div id="quiz-form-container" class="creator-view ${this.viewMode === 'quiz' ? '' : 'hidden'}">
              <header class="creator-header">
                <h1>${this.isEditing ? 'Edit Quiz' : 'Create New Quiz'}</h1>
              </header>
              
              <form id="quiz-form" class="creator-form">
                <div class="form-group">
                  <label for="quiz-title">Quiz Title</label>
                  <input type="text" id="quiz-title" required placeholder="e.g. World Cup History" maxlength="64">
                  <div class="form-help">Maximum 64 characters</div>
                </div>
                
                <div class="form-group">
                  <label for="quiz-category">Category</label>
                  <select id="quiz-category">
                    <option value="">-- Select a category --</option>
                    <!-- Categories will be loaded dynamically -->
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="quiz-description">Description</label>
                  <textarea id="quiz-description" rows="3" placeholder="Describe what this quiz is about" maxlength="128"></textarea>
                  <div class="form-help">Maximum 128 characters</div>
                </div>
                
                <div class="form-actions">
                  <a href="/admin" class="creator-btn secondary-btn" data-link>Cancel</a>
                  <button type="submit" class="creator-btn primary-btn">${this.isEditing ? 'Save Changes' : 'Create Quiz'}</button>
                </div>
              </form>
            </div>
            
            <div id="questions-container" class="creator-view ${this.viewMode === 'questions' ? '' : 'hidden'}">
              <header class="creator-header">
                <h1>Questions for <span id="current-quiz-title">${this.quizTitle || 'Quiz'}</span></h1>
                <div class="quiz-status" id="quiz-status"></div>
              </header>
              
              <div class="questions-info">
                <p>Add at least 5 questions with 4 answer options each (1 correct) to make the quiz playable.</p>
              </div>
              
              <div class="action-bar">
                <button id="add-question-btn" class="creator-btn primary-btn">Add Question</button>
              </div>
              
              <div id="questions-list" class="questions-list">
                <p class="loading-text">Loading questions...</p>
              </div>
              
              <div class="navigation-actions">
                <button id="back-to-quiz-btn" class="creator-btn secondary-btn">Back to Quiz Details</button>
                <a href="/admin" class="creator-btn primary-btn" data-link>Back to Dashboard</a>
              </div>
            </div>
            
            <div id="question-form-container" class="creator-view ${this.viewMode === 'question-form' ? '' : 'hidden'}">
              <header class="creator-header">
                <h1>${this.currentQuestionId ? 'Edit Question' : 'Add Question'}</h1>
              </header>
              
              <form id="question-form" class="creator-form">
                <div class="form-group">
                  <label for="question-text">Question Text</label>
                  <textarea id="question-text" rows="2" required placeholder="Enter your question" maxlength="256"></textarea>
                  <div class="form-help">Maximum 256 characters</div>
                </div>
                
                <div class="form-group">
                  <label for="question-difficulty">Difficulty Level</label>
                  <select id="question-difficulty" required>
                    <option value="">-- Select difficulty --</option>
                    <!-- Difficulties will be loaded dynamically -->
                  </select>
                </div>
                
                <div class="form-actions">
                  <button type="button" id="cancel-question-btn" class="creator-btn secondary-btn">Cancel</button>
                  <button type="submit" class="creator-btn primary-btn">Continue to Add Answers</button>
                </div>
              </form>
            </div>
            
            <div id="answers-container" class="creator-view ${this.viewMode === 'answers' ? '' : 'hidden'}">
              <header class="creator-header">
                <h1>Answers for Question</h1>
                <div id="answer-status" class="answer-status"></div>
              </header>
              
              <div class="question-preview">
                <h2 id="current-question-text"></h2>
              </div>
              
              <div id="answers-list" class="answers-list">
                <p class="loading-text">Loading answers...</p>
              </div>
              
              <div id="answer-form" class="answer-form ${this.getAnswerFormVisible() ? '' : 'hidden'}">
                <h3>Add Answer Option</h3>
                <form id="add-answer-form">
                  <div class="form-group">
                    <label for="answer-text">Answer Text</label>
                    <input type="text" id="answer-text" required placeholder="Enter answer option" maxlength="128">
                    <div class="form-help">Maximum 128 characters</div>
                  </div>
                  
                  <div class="form-check">
                    <input type="checkbox" id="answer-correct">
                    <label for="answer-correct">Mark as correct answer</label>
                  </div>
                  
                  <div class="form-actions">
                    <button type="button" id="cancel-answer-btn" class="creator-btn secondary-btn">Cancel</button>
                    <button type="submit" class="creator-btn primary-btn">Save Answer</button>
                  </div>
                </form>
              </div>
              
              <div class="navigation-actions">
                <button id="back-to-questions-btn" class="creator-btn secondary-btn">Back to Questions</button>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <div id="notification-toast" class="toast hidden">
        <span id="notification-message"></span>
        <button class="close-toast">&times;</button>
      </div>
      
      <div id="confirm-modal" class="modal">
        <div class="modal-content">
          <header class="modal-header">
            <h2>Confirm Action</h2>
            <button class="close-modal">&times;</button>
          </header>
          <div class="modal-body">
            <p id="confirm-message">Are you sure you want to proceed?</p>
            <div class="form-actions">
              <button class="creator-btn secondary-btn" id="cancel-confirm">Cancel</button>
              <button class="creator-btn primary-btn danger-btn" id="confirm-action">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  getAnswerFormVisible() {
    // This is a helper method to determine if the answer form should be initially visible
    return false;
  }

  async mount() {
    
    const isAuthenticated = await authService.checkAuthentication();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (!authService.isQuizMaster()) {
      window.location.href = '/home';
      return;
    }

    this.clearCurrentQuestion();
    
    await this.loadCategories();
    await this.loadDifficulties();
    
    if (this.isEditing) {
      await this.loadQuizData();
      if (this.viewMode === 'questions') {
        await this.loadQuestions();
      }
    }
    
    this.setupEventListeners();
  }
  
  clearCurrentQuestion() {
    this.currentQuestionId = null;
    
    localStorage.removeItem('current_question_id');
    localStorage.removeItem('current_question_text');

    
    const textInput = document.getElementById('question-text');
    const difficultySelect = document.getElementById('question-difficulty');
    
    if (textInput) textInput.value = '';
    if (difficultySelect && difficultySelect.options.length > 0) {
      difficultySelect.selectedIndex = 0;
    }
  }
  
  setupEventListeners() {
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
      quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleQuizSubmit();
      });
    }
    
    const addQuestionBtn = document.getElementById('add-question-btn');
    if (addQuestionBtn) {
      addQuestionBtn.addEventListener('click', () => this.showQuestionForm());
    }
    
    const backToQuizBtn = document.getElementById('back-to-quiz-btn');
    if (backToQuizBtn) {
      backToQuizBtn.addEventListener('click', () => this.showQuizForm());
    }
    
    const questionForm = document.getElementById('question-form');
    if (questionForm) {
      questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleQuestionSubmit();
      });
    }
    
    const cancelQuestionBtn = document.getElementById('cancel-question-btn');
    if (cancelQuestionBtn) {
      cancelQuestionBtn.addEventListener('click', () => this.showQuestionsView());
    }
    
    const backToQuestionsBtn = document.getElementById('back-to-questions-btn');
    if (backToQuestionsBtn) {
      backToQuestionsBtn.addEventListener('click', () => this.showQuestionsView());
    }
    
    const answerForm = document.getElementById('add-answer-form');
    if (answerForm) {
      answerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAnswerSubmit();
      });
    }
    
    const cancelAnswerBtn = document.getElementById('cancel-answer-btn');
    if (cancelAnswerBtn) {
      cancelAnswerBtn.addEventListener('click', () => this.hideAnswerForm());
    }
    
    document.querySelectorAll('.close-modal').forEach(button => {
      button.addEventListener('click', () => this.closeConfirmModal());
    });
    
    const cancelConfirmBtn = document.getElementById('cancel-confirm');
    if (cancelConfirmBtn) {
      cancelConfirmBtn.addEventListener('click', () => this.closeConfirmModal());
    }
    
    const closeToastBtn = document.querySelector('.close-toast');
    if (closeToastBtn) {
      closeToastBtn.addEventListener('click', () => this.hideNotification());
    }
    
    window.addEventListener('click', (e) => {
      const confirmModal = document.getElementById('confirm-modal');
      
      if (e.target === confirmModal) {
        this.closeConfirmModal();
      }
    });
  }
  
  async loadCategories() {
    try {
      this.categories = await categoryService.getAllCategories();
      
      const categorySelect = document.getElementById('quiz-category');
      if (categorySelect) {
        categorySelect.innerHTML = '<option value="">-- Select a category --</option>';
        
        this.categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.category_id;
          option.textContent = category.category_name;
          categorySelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      this.showNotification('Failed to load categories. Please try again.', 'error');
    }
  }
  
  async loadDifficulties() {
    try {
      this.difficulties = await difficultyService.getAllDifficultyLevels();
      
      const difficultySelect = document.getElementById('question-difficulty');
      if (difficultySelect) {
        difficultySelect.innerHTML = '<option value="">-- Select difficulty --</option>';
        
        this.difficulties.forEach(difficulty => {
          const option = document.createElement('option');
          option.value = difficulty.difficulty_id;
          option.textContent = `${difficulty.difficulty_level} (${difficulty.time_limit_seconds}s, +${difficulty.points_on_correct}/${difficulty.points_on_incorrect})`;
          difficultySelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error loading difficulties:', error);
      this.showNotification('Failed to load difficulty levels. Please try again.', 'error');
    }
  }
  
  async loadQuizData() {
    if (!this.quizId) return;
    
    try {
      const quiz = await quizService.getQuizById(this.quizId);
      
      const titleInput = document.getElementById('quiz-title');
      const categorySelect = document.getElementById('quiz-category');
      const descriptionInput = document.getElementById('quiz-description');
      const quizTitleElement = document.getElementById('current-quiz-title');
      
      if (titleInput) titleInput.value = quiz.quiz_title;
      if (categorySelect) categorySelect.value = quiz.category_id || '';
      if (descriptionInput) descriptionInput.value = quiz.quiz_description || '';
      if (quizTitleElement) quizTitleElement.textContent = quiz.quiz_title;
      
      this.quizTitle = quiz.quiz_title;
      localStorage.setItem('selected_quiz_title', this.quizTitle);
    } catch (error) {
      console.error('Error loading quiz data:', error);
      this.showNotification('Failed to load quiz data. Please try again.', 'error');
    }
  }
  
  async loadQuestions() {
    if (!this.quizId) return;
    
    try {
      const questionsContainer = document.getElementById('questions-list');
      if (!questionsContainer) return;
      
      questionsContainer.innerHTML = '<p class="loading-text">Loading questions...</p>';
      
      this.questions = await questionService.getQuestionsByQuizId(this.quizId);
      
      for (let i = 0; i < this.questions.length; i++) {
        const question = this.questions[i];
        try {
          const answers = await answerService.getAnswersByQuestionId(question.question_id);
          question.answer_count = answers.length;
          question.correct_answer_count = answers.filter(a => a.is_correct).length;
        } catch (error) {
          console.error(`Error validating question ${question.question_id}:`, error);
        }
      }
      
      this.updateQuizStatus();
      
      if (this.questions.length === 0) {
        questionsContainer.innerHTML = '<p class="empty-message">No questions found. Add your first question!</p>';
        return;
      }
      
      questionsContainer.innerHTML = '';
      
      this.questions.forEach((question, index) => {
        const questionCard = this.createQuestionCard(question, index);
        questionsContainer.appendChild(questionCard);
      });
    } catch (error) {
      console.error('Error loading questions:', error);
      const questionsContainer = document.getElementById('questions-list');
      if (questionsContainer) {
        questionsContainer.innerHTML = '<p class="error-message">Error loading questions. Please try again later.</p>';
      }
    }
  }
  
  createQuestionCard(question, index) {
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    questionCard.dataset.id = question.question_id;
    
    const isValid = question.answer_count === 4 && question.correct_answer_count === 1;
    const statusClass = isValid ? 'status-valid' : 'status-invalid';
    const statusText = isValid 
      ? 'Valid: 4 answers with 1 correct' 
      : `Incomplete: ${question.answer_count}/4 answers, ${question.correct_answer_count}/1 correct`;
    
    questionCard.innerHTML = `
      <div class="card-header">
        <h3>Question ${index + 1}</h3>
        <div class="question-actions">
          <button type="button" class="action-btn edit-question" title="Edit Question">
            <span class="action-icon">✏️</span>
          </button>
          <button type="button" class="action-btn delete-question" title="Delete Question">
            <span class="action-icon">🗑️</span>
          </button>
        </div>
      </div>
      <div class="card-content">
        <p class="question-text">${question.question_text}</p>
        <div class="question-meta">
          <span class="difficulty-badge">${question.difficulty_level}</span>
          <span class="question-status ${statusClass}">${statusText}</span>
        </div>
      </div>
      <div class="card-footer">
        <button type="button" class="creator-btn secondary-btn manage-answers">Manage Answers</button>
      </div>
    `;
    
    const editBtn = questionCard.querySelector('.edit-question');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.handleEditQuestion(question.question_id));
    }
    
    const deleteBtn = questionCard.querySelector('.delete-question');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this.confirmDeleteQuestion(question.question_id));
    }
    
    const manageAnswersBtn = questionCard.querySelector('.manage-answers');
    if (manageAnswersBtn) {
      manageAnswersBtn.addEventListener('click', () => this.handleManageAnswers(question.question_id, question.question_text));
    }
    
    return questionCard;
  }
  
  updateQuizStatus() {
    const statusContainer = document.getElementById('quiz-status');
    if (!statusContainer) return;
    
    const validQuestions = this.questions.filter(q => {
      return q.answer_count === 4 && q.correct_answer_count === 1;
    });
    
    const isValid = validQuestions.length >= 5;
    
    statusContainer.innerHTML = `
      <div class="status-badge ${isValid ? 'valid-status' : 'invalid-status'}">
        ${isValid ? 'Quiz Ready' : `Quiz Not Ready (${validQuestions.length}/5 valid questions)`}
      </div>
    `;
  }
  
  async loadAnswers(questionId) {
    try {
      const answersContainer = document.getElementById('answers-list');
      if (!answersContainer) return;
      
      answersContainer.innerHTML = '<p class="loading-text">Loading answers...</p>';
      
      let question = this.questions.find(q => q.question_id == questionId);
      
      if (!question) {
        question = await questionService.getQuestionById(questionId);
      }
      
      const answers = await answerService.getAnswersByQuestionId(questionId);
      
      const questionTextElement = document.getElementById('current-question-text');
      if (questionTextElement) {
        questionTextElement.textContent = question.question_text;
      }
      
      const correctAnswersCount = answers.filter(a => a.is_correct).length;
      
      const answerStatus = document.getElementById('answer-status');
      if (answerStatus) {
        const isValid = answers.length === 4 && correctAnswersCount === 1;
        const statusClass = isValid ? 'status-valid' : 'status-invalid';
        const statusText = isValid 
          ? 'Valid: 4 answers with 1 correct' 
          : `Incomplete: ${answers.length}/4 answers, ${correctAnswersCount}/1 correct`;
        
        answerStatus.innerHTML = `<div class="status-badge ${statusClass}">${statusText}</div>`;
      }
      
      if (answers.length === 0) {
        answersContainer.innerHTML = '<p class="empty-message">No answers found. Add answer options below.</p>';
      } else {
        answersContainer.innerHTML = '';
        
        answers.forEach(answer => {
          const answerCard = this.createAnswerCard(answer);
          answersContainer.appendChild(answerCard);
        });
      }
      
      if (answers.length < 4) {
        this.showAnswerForm();
      } else {
        this.hideAnswerForm();
      }
      
    } catch (error) {
      console.error('Error loading answers:', error);
      const answersContainer = document.getElementById('answers-list');
      if (answersContainer) {
        answersContainer.innerHTML = '<p class="error-message">Error loading answers. Please try again later.</p>';
      }
    }
  }
  
  createAnswerCard(answer) {
    const answerCard = document.createElement('div');
    answerCard.className = 'answer-card';
    answerCard.dataset.id = answer.answer_id;
    answerCard.classList.toggle('correct', answer.is_correct);
    
    answerCard.innerHTML = `
      <div class="answer-content">
        <div class="answer-marker">${answer.is_correct ? '✓' : ''}</div>
        <p class="answer-text">${answer.answer_text}</p>
      </div>
      <div class="answer-actions">
        ${!answer.is_correct ? `<button class="action-btn mark-correct" title="Mark as Correct">
          <span class="action-icon">✓</span>
        </button>` : ''}
        <button class="action-btn delete-answer" title="Delete Answer">
          <span class="action-icon">🗑️</span>
        </button>
      </div>
    `;
    
    const markCorrectBtn = answerCard.querySelector('.mark-correct');
    if (markCorrectBtn) {
      markCorrectBtn.addEventListener('click', () => this.handleMarkCorrect(answer.answer_id));
    }
    
    const deleteBtn = answerCard.querySelector('.delete-answer');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this.confirmDeleteAnswer(answer.answer_id, answer.answer_text));
    }
    
    return answerCard;
  }
  
  async handleQuizSubmit() {
    const titleInput = document.getElementById('quiz-title');
    const categorySelect = document.getElementById('quiz-category');
    const descriptionInput = document.getElementById('quiz-description');
    
    if (!titleInput) return;
    
    const title = titleInput.value.trim();
    const categoryId = categorySelect ? categorySelect.value : '';
    const description = descriptionInput ? descriptionInput.value.trim() : '';
    
    if (!title) {
      this.showNotification('Quiz title is required', 'error');
      return;
    }
    
    try {
      if (this.isEditing) {
        await quizService.updateQuiz(this.quizId, {
          quiz_title: title,
          quiz_description: description || undefined,
          category_id: categoryId || null
        });
        
        localStorage.setItem('selected_quiz_title', title);
        this.quizTitle = title;
        
        this.showNotification('Quiz updated successfully');
      } else {
        const quiz = await quizService.createQuiz({
          quiz_title: title,
          quiz_description: description || undefined,
          category_id: categoryId || null
        });
        
        this.quizId = quiz.quiz_id;
        this.quizTitle = quiz.quiz_title;
        localStorage.setItem('selected_quiz_id', this.quizId);
        localStorage.setItem('selected_quiz_title', this.quizTitle);
        
        this.isEditing = true;
        
        this.showNotification('Quiz created successfully! Now you can add questions.');
      }
      
      this.showQuestionsView();
      
    } catch (error) {
      console.error('Error saving quiz:', error);
      this.showNotification('Failed to save quiz: ' + (error.message || 'Unknown error'), 'error');
    }
  }
  
  async handleQuestionSubmit() {
    const textInput = document.getElementById('question-text');
    const difficultySelect = document.getElementById('question-difficulty');
    
    if (!textInput || !difficultySelect) return;
    
    const text = textInput.value.trim();
    const difficultyId = difficultySelect.value;
    
    if (!text) {
      this.showNotification('Question text is required', 'error');
      return;
    }
    
    if (!difficultyId) {
      this.showNotification('Difficulty level is required', 'error');
      return;
    }
    
    try {
      if (this.currentQuestionId) {
        await questionService.updateQuestion(this.currentQuestionId, {
          question_text: text,
          difficulty_id: difficultyId
        });
        
        this.showNotification('Question updated successfully');
      } else {
        const question = await questionService.createQuestion({
          quiz_id: this.quizId,
          question_text: text,
          difficulty_id: difficultyId
        });
        
        this.currentQuestionId = question.question_id;
        this.showNotification('Question created successfully');
      }
      
      this.showAnswersView(this.currentQuestionId);
      
    } catch (error) {
      console.error('Error saving question:', error);
      this.showNotification('Failed to save question: ' + (error.message || 'Unknown error'), 'error');
    }
  }
  
  async handleAnswerSubmit() {
    const textInput = document.getElementById('answer-text');
    const correctCheckbox = document.getElementById('answer-correct');
    
    if (!textInput || !correctCheckbox || !this.currentQuestionId) return;
    
    const text = textInput.value.trim();
    const isCorrect = correctCheckbox.checked;
    
    if (!text) {
      this.showNotification('Answer text is required', 'error');
      return;
    }
    
    try {
      await answerService.createAnswer({
        question_id: this.currentQuestionId,
        answer_text: text,
        is_correct: isCorrect
      });
      
      textInput.value = '';
      correctCheckbox.checked = false;
      
      this.showNotification('Answer added successfully');
      
      this.loadAnswers(this.currentQuestionId);
      
    } catch (error) {
      console.error('Error creating answer:', error);
      this.showNotification('Failed to create answer: ' + (error.message || 'Unknown error'), 'error');
    }
  }
  
  async handleEditQuestion(questionId) {
    const question = this.questions.find(q => q.question_id == questionId) || 
                    await questionService.getQuestionById(questionId);
    
    if (!question) {
      this.showNotification('Question not found', 'error');
      return;
    }
    
    this.currentQuestionId = question.question_id;
    
    const textInput = document.getElementById('question-text');
    const difficultySelect = document.getElementById('question-difficulty');
    
    if (textInput) textInput.value = question.question_text;
    if (difficultySelect) difficultySelect.value = question.difficulty_id;
    
    this.showQuestionForm();
  }
  
  confirmDeleteQuestion(questionId) {
    const question = this.questions.find(q => q.question_id == questionId);
    
    if (!question) {
      this.showNotification('Question not found', 'error');
      return;
    }
    
    const confirmMessage = document.getElementById('confirm-message');
    confirmMessage.textContent = `Are you sure you want to delete this question? All associated answers will be deleted as well.`;
    
    const confirmAction = document.getElementById('confirm-action');
    confirmAction.onclick = () => this.handleDeleteQuestion(questionId);
    
    this.showConfirmModal();
  }
  
  async handleDeleteQuestion(questionId) {
    try {
      await questionService.deleteQuestion(questionId);
      
      this.showNotification('Question deleted successfully');
      
      await this.loadQuestions();
      
      this.closeConfirmModal();
    } catch (error) {
      console.error('Error deleting question:', error);
      this.showNotification('Failed to delete question: ' + (error.message || 'Unknown error'), 'error');
      this.closeConfirmModal();
    }
  }
  
  handleManageAnswers(questionId, questionText) {
    this.currentQuestionId = questionId;
    localStorage.setItem('current_question_id', questionId);
    if (questionText) {
      localStorage.setItem('current_question_text', questionText);
    }
    
    this.showAnswersView(questionId);
  }
  
  confirmDeleteAnswer(answerId, answerText) {
    const confirmMessage = document.getElementById('confirm-message');
    confirmMessage.textContent = `Are you sure you want to delete this answer?`;
    
    const confirmAction = document.getElementById('confirm-action');
    confirmAction.onclick = () => this.handleDeleteAnswer(answerId);
    
    this.showConfirmModal();
  }
  
  async handleDeleteAnswer(answerId) {
    try {
      await answerService.deleteAnswer(answerId);
      
      this.showNotification('Answer deleted successfully');
      
      this.loadAnswers(this.currentQuestionId);
      
      this.closeConfirmModal();
    } catch (error) {
      console.error('Error deleting answer:', error);
      this.showNotification('Failed to delete answer: ' + (error.message || 'Unknown error'), 'error');
      this.closeConfirmModal();
    }
  }
  
  async handleMarkCorrect(answerId) {
    try {
      await answerService.markAsCorrect(answerId);
      
      this.showNotification('Answer marked as correct');
      
      this.loadAnswers(this.currentQuestionId);
    } catch (error) {
      console.error('Error marking answer as correct:', error);
      this.showNotification('Failed to mark answer as correct: ' + (error.message || 'Unknown error'), 'error');
    }
  }
  
  showQuizForm() {
    this.viewMode = 'quiz';
    
    document.querySelectorAll('.creator-view').forEach(view => {
      view.classList.add('hidden');
    });
    
    const quizFormContainer = document.getElementById('quiz-form-container');
    if (quizFormContainer) {
      quizFormContainer.classList.remove('hidden');
    }
    
    this.updateStepIndicators();
  }
  
  showQuestionsView() {
    this.viewMode = 'questions';
    
    document.querySelectorAll('.creator-view').forEach(view => {
      view.classList.add('hidden');
    });
    
    const questionsContainer = document.getElementById('questions-container');
    if (questionsContainer) {
      questionsContainer.classList.remove('hidden');
    }
    
    const quizTitleElement = document.getElementById('current-quiz-title');
    if (quizTitleElement) {
      quizTitleElement.textContent = this.quizTitle;
    }
    
    this.loadQuestions();
    this.updateStepIndicators();
  }
  
  showQuestionForm() {
    this.viewMode = 'question-form';
    
    document.querySelectorAll('.creator-view').forEach(view => {
      view.classList.add('hidden');
    });
    
    const questionFormContainer = document.getElementById('question-form-container');
    if (questionFormContainer) {
      questionFormContainer.classList.remove('hidden');
    }
    
    this.updateStepIndicators();
  }
  
  showAnswersView(questionId) {
    this.viewMode = 'answers';
    
    document.querySelectorAll('.creator-view').forEach(view => {
      view.classList.add('hidden');
    });
    
    const answersContainer = document.getElementById('answers-container');
    if (answersContainer) {
      answersContainer.classList.remove('hidden');
    }
    
    this.loadAnswers(questionId);
    this.updateStepIndicators();
  }
  
  showAnswerForm() {
    const answerForm = document.getElementById('answer-form');
    if (answerForm) {
      answerForm.classList.remove('hidden');
    }
  }
  
  hideAnswerForm() {
    const answerForm = document.getElementById('answer-form');
    if (answerForm) {
      answerForm.classList.add('hidden');
    }
  }
  
  updateStepIndicators() {
    document.querySelectorAll('.step-indicator').forEach((step, index) => {
      step.classList.remove('active', 'completed');
      
      if (index === 0) { // Quiz Details
        if (this.viewMode === 'quiz') {
          step.classList.add('active');
        } else if (this.isEditing) {
          step.classList.add('completed');
        }
      } else if (index === 1) { // Manage Questions
        if (this.viewMode === 'questions') {
          step.classList.add('active');
        } else if (this.viewMode === 'question-form' || this.viewMode === 'answers') {
          step.classList.add('completed');
        }
      } else if (index === 2) { // Question Details
        if (this.viewMode === 'question-form' || this.viewMode === 'answers') {
          step.classList.add('active');
        }
      }
    });
  }
  
  showConfirmModal() {
    const confirmModal = document.getElementById('confirm-modal');
    confirmModal.classList.add('visible');
  }
  
  closeConfirmModal() {
    const confirmModal = document.getElementById('confirm-modal');
    confirmModal.classList.remove('visible');
  }
  
  showNotification(message, type = 'success') {
    const toast = document.getElementById('notification-toast');
    const messageEl = document.getElementById('notification-message');
    
    toast.className = 'toast';
    toast.classList.add(type);
    messageEl.textContent = message;
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }
  
  hideNotification() {
    const toast = document.getElementById('notification-toast');
    toast.classList.add('hidden');
  }
  
  cleanup() {
    localStorage.removeItem('current_question_id');
    localStorage.removeItem('current_question_text');

    this.quizId = localStorage.removeItem('selected_quiz_id');
    this.quizTitle = localStorage.removeItem('selected_quiz_title');
    
    const backToQuestionsBtn = document.getElementById('back-to-questions-btn');
    if (backToQuestionsBtn) {
      backToQuestionsBtn.removeEventListener('click', this.showQuestionsView);
    }
    
    const cancelAnswerBtn = document.getElementById('cancel-answer-btn');
    if (cancelAnswerBtn) {
      cancelAnswerBtn.removeEventListener('click', this.hideAnswerForm);
    }
    
    const dashboardLinks = document.querySelectorAll('a[href="/admin"]');
    dashboardLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.clearCurrentQuestion();
      });
    });
  }
}