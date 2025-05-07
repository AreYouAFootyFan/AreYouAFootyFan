import AbstractView from "./AbstractView.js";
import authService from "../services/auth.service.js";
import quizService from "../services/quiz.service.js";
import categoryService from "../services/category.service.js";
import quizValidatorService from "../services/quiz-validator.service.js";

export default class AdminDashboardView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Admin Dashboard");
    this.quizzes = [];
    this.categories = [];
    this.viewMode = 'dashboard'; 
  }

  async getHtml() {
    return `
      <main class="admin-page">
        <div class="admin-container">
          <aside class="admin-sidebar">
            <nav class="admin-nav">
              <ul>
                <li><button data-view="dashboard" class="admin-nav-link active">Dashboard</button></li>
                <li><button data-view="quizzes" class="admin-nav-link">Quizzes</button></li>
                <li><button data-view="categories" class="admin-nav-link">Categories</button></li>
                <li><a href="/create-quiz" class="admin-nav-link" data-link>Create Quiz</a></li>
              </ul>
            </nav>
          </aside>

          <section class="admin-content">
            <div id="dashboard-view" class="admin-view">
              <header class="admin-header">
                <h1>Admin Dashboard</h1>
                <div class="admin-actions">
                  <a href="/create-quiz" class="admin-btn primary-btn" data-link>Create New Quiz</a>
                </div>
              </header>

              <div class="admin-stats">
                <div class="stat-card">
                  <h2 class="stat-value" id="active-quizzes-stat">0</h2>
                  <p class="stat-label">Active Quizzes</p>
                </div>
                
                <div class="stat-card">
                  <h2 class="stat-value" id="registered-players-stat">0</h2>
                  <p class="stat-label">Registered Players</p>
                </div>
                
                <div class="stat-card">
                  <h2 class="stat-value" id="quizzes-completed-stat">0</h2>
                  <p class="stat-label">Quizzes Completed</p>
                </div>
                
                <div class="stat-card">
                  <h2 class="stat-value" id="questions-answered-stat">0</h2>
                  <p class="stat-label">Questions Answered</p>
                </div>
              </div>

              <div class="admin-cards">
                <div class="admin-card">
                  <header class="card-header">
                    <h2>Recent Quizzes</h2>
                    <button data-view="quizzes" class="text-btn">View All</button>
                  </header>
                  <div class="card-content" id="recent-quizzes">
                    <p class="loading-text">Loading quizzes...</p>
                  </div>
                </div>

                <div class="admin-card">
                  <header class="card-header">
                    <h2>Categories</h2>
                    <button data-view="categories" class="text-btn">View All</button>
                  </header>
                  <div class="card-content" id="recent-categories">
                    <p class="loading-text">Loading categories...</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="quizzes-view" class="admin-view hidden">
              <header class="admin-header">
                <h1>Quiz Management</h1>
                <div class="admin-actions">
                  <a href="/create-quiz" class="admin-btn primary-btn" data-link>Create New Quiz</a>
                </div>
              </header>

              <div class="admin-card full-width">
                <div class="card-content" id="quizzes-list">
                  <p class="loading-text">Loading quizzes...</p>
                </div>
              </div>
            </div>

            <div id="categories-view" class="admin-view hidden">
              <header class="admin-header">
                <h1>Category Management</h1>
                <div class="admin-actions">
                  <button id="add-category-btn" class="admin-btn primary-btn">Add Category</button>
                </div>
              </header>

              <div class="admin-card full-width">
                <div class="card-content" id="categories-list">
                  <p class="loading-text">Loading categories...</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div id="category-modal" class="modal">
        <div class="modal-content">
          <header class="modal-header">
            <h2 id="category-modal-title">Add New Category</h2>
            <button class="close-modal">&times;</button>
          </header>
          <form id="category-form" class="modal-body">
            <input type="hidden" id="category-id" value="">
            <div class="form-group">
              <label for="category-name">Category Name</label>
              <input type="text" id="category-name" required maxlength="32">
            </div>
            <div class="form-group">
              <label for="category-description">Description</label>
              <input type="text" id="category-description" maxlength="64">
            </div>
            <div class="form-actions">
              <button type="button" class="admin-btn secondary-btn" id="cancel-category">Cancel</button>
              <button type="submit" class="admin-btn primary-btn">Save Category</button>
            </div>
          </form>
        </div>
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
              <button class="admin-btn secondary-btn" id="cancel-confirm">Cancel</button>
              <button class="admin-btn primary-btn danger-btn" id="confirm-action">Confirm</button>
            </div>
          </div>
        </div>
      </div>
      
      <div id="notification-toast" class="toast hidden">
        <span id="notification-message"></span>
        <button class="close-toast">&times;</button>
      </div>
    `;
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

    this.setupEventListeners();
    
    await this.loadQuizzes();
    await this.loadCategories();
    this.loadStats();
    
    this.loadRecentQuizzes();
    this.loadRecentCategories();
  }
  
  setupEventListeners() {
    document.querySelectorAll('[data-view]').forEach(button => {
      button.addEventListener('click', (e) => {
        this.changeView(e.target.dataset.view);
      });
    });
    
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
      addCategoryBtn.addEventListener('click', () => this.showCategoryModal());
    }
    
    document.querySelectorAll('.close-modal').forEach(button => {
      button.addEventListener('click', () => this.closeAllModals());
    });
    
    const closeToastBtn = document.querySelector('.close-toast');
    if (closeToastBtn) {
      closeToastBtn.addEventListener('click', () => this.hideNotification());
    }
    
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
      categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCategorySubmit();
      });
    }
    
    const cancelCategoryBtn = document.getElementById('cancel-category');
    if (cancelCategoryBtn) {
      cancelCategoryBtn.addEventListener('click', () => this.closeCategoryModal());
    }
    
    const cancelConfirmBtn = document.getElementById('cancel-confirm');
    if (cancelConfirmBtn) {
      cancelConfirmBtn.addEventListener('click', () => this.closeConfirmModal());
    }
    
    window.addEventListener('click', (e) => {
      const categoryModal = document.getElementById('category-modal');
      const confirmModal = document.getElementById('confirm-modal');
      
      if (e.target === categoryModal) {
        this.closeCategoryModal();
      }
      
      if (e.target === confirmModal) {
        this.closeConfirmModal();
      }
    });
  }
  
  loadInitialData() {
    this.loadStats();
    this.loadQuizzes();
    this.loadCategories();
  }
  
  changeView(viewName) {
    document.querySelectorAll('.admin-nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    document.querySelectorAll('.admin-view').forEach(view => {
      view.classList.add('hidden');
    });
    
    document.getElementById(`${viewName}-view`).classList.remove('hidden');
    
    this.viewMode = viewName;
    
    if (viewName === 'dashboard') {
      this.loadStats();
      this.loadRecentQuizzes();
      this.loadRecentCategories();
    } else if (viewName === 'quizzes') {
      this.loadQuizzes();
    } else if (viewName === 'categories') {
      this.loadCategories();
    }
  }
  
  async loadStats() {
    document.getElementById('active-quizzes-stat').textContent = '24';
    document.getElementById('registered-players-stat').textContent = '156';
    document.getElementById('quizzes-completed-stat').textContent = '1,245';
    document.getElementById('questions-answered-stat').textContent = '18,672';
  }
  
  async loadQuizzes() {
    try {
      const quizzesContainer = document.getElementById('quizzes-list');
      if (!quizzesContainer) return;
      
      quizzesContainer.innerHTML = '<p class="loading-text">Loading quizzes...</p>';
      
      this.quizzes = await quizService.getAllQuizzes();
      
      for (let i = 0; i < this.quizzes.length; i++) {
        const quiz = this.quizzes[i];
        try {
          const validation = await quizValidatorService.validateQuiz(quiz.quiz_id);
          
          quiz.valid_questions = validation.valid_questions;
          quiz.question_count = validation.total_questions;
          quiz.is_valid = validation.is_valid;
          quiz.validation_message = validation.validation_message;
        } catch (error) {
          console.error(`Error validating quiz ${quiz.quiz_id}:`, error);
          quiz.valid_questions = 0;
          quiz.question_count = 0;
          quiz.is_valid = false;
          quiz.validation_message = 'Unable to validate quiz';
        }
      }
      
      if (this.quizzes.length === 0) {
        quizzesContainer.innerHTML = '<p class="empty-message">No quizzes found. Create your first quiz!</p>';
        return;
      }
      
      quizzesContainer.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Questions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.quizzes.map(quiz => this.renderQuizRow(quiz)).join('')}
          </tbody>
        </table>
      `;
      
      document.querySelectorAll('.edit-quiz').forEach(button => {
        button.addEventListener('click', (e) => {
          const quizId = e.currentTarget.dataset.id;
          this.handleEditQuiz(quizId);
        });
      });
      
      document.querySelectorAll('.manage-questions').forEach(button => {
        button.addEventListener('click', (e) => {
          const quizId = e.currentTarget.dataset.id;
          const quizTitle = e.currentTarget.dataset.title;
          this.handleManageQuestions(quizId, quizTitle);
        });
      });
      
      document.querySelectorAll('.delete-quiz').forEach(button => {
        button.addEventListener('click', (e) => {
          const quizId = e.currentTarget.dataset.id;
          const quizTitle = e.currentTarget.dataset.title;
          this.confirmDeleteQuiz(quizId, quizTitle);
        });
      });
      
    } catch (error) {
      console.error('Error loading quizzes:', error);
      const quizzesContainer = document.getElementById('quizzes-list');
      if (quizzesContainer) {
        quizzesContainer.innerHTML = '<p class="error-message">Error loading quizzes. Please try again later.</p>';
      }
    }
  }
  
  async loadRecentQuizzes() {
    try {
      const recentQuizzesContainer = document.getElementById('recent-quizzes');
      if (!recentQuizzesContainer) return;
      
      recentQuizzesContainer.innerHTML = '<p class="loading-text">Loading quizzes...</p>';
      
      if (this.quizzes.length === 0) {
        this.quizzes = await quizService.getAllQuizzes();
      }
      
      if (this.quizzes.length === 0) {
        recentQuizzesContainer.innerHTML = '<p class="empty-message">No quizzes found. Create your first quiz!</p>';
        return;
      }
      
      const recentQuizzes = this.quizzes.slice(0, 5);
      
      recentQuizzesContainer.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${recentQuizzes.map(quiz => `
              <tr>
                <td>${quiz.quiz_title}</td>
                <td>
                  <span class="status-badge ${quiz.question_count >= 5 ? 'valid-status' : 'invalid-status'}">
                    ${quiz.question_count >= 5 ? 'Ready' : 'Not Ready'}
                  </span>
                </td>
                <td>
                  <div class="table-actions">
                    <button class="action-btn manage-questions" data-id="${quiz.quiz_id}" data-title="${quiz.quiz_title}" title="Manage Questions">
                      <span class="action-icon">📝</span>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      document.querySelectorAll('.manage-questions').forEach(button => {
        button.addEventListener('click', (e) => {
          const quizId = e.currentTarget.dataset.id;
          const quizTitle = e.currentTarget.dataset.title;
          this.handleManageQuestions(quizId, quizTitle);
        });
      });
      
    } catch (error) {
      console.error('Error loading recent quizzes:', error);
      const recentQuizzesContainer = document.getElementById('recent-quizzes');
      if (recentQuizzesContainer) {
        recentQuizzesContainer.innerHTML = '<p class="error-message">Error loading quizzes. Please try again later.</p>';
      }
    }
  }
  
  async loadCategories() {
    try {
      const categoriesContainer = document.getElementById('categories-list');
      if (!categoriesContainer) return;
      
      categoriesContainer.innerHTML = '<p class="loading-text">Loading categories...</p>';
      
      this.categories = await categoryService.getAllCategories();
      
      if (this.categories.length === 0) {
        categoriesContainer.innerHTML = '<p class="empty-message">No categories found. Add your first category!</p>';
        return;
      }
      
      categoriesContainer.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.categories.map(category => `
              <tr>
                <td>${category.category_name}</td>
                <td>${category.category_description || 'No description'}</td>
                <td>
                  <div class="table-actions">
                    <button class="action-btn edit-category" data-id="${category.category_id}" title="Edit Category">
                      <span class="action-icon">✏️</span>
                    </button>
                    <button class="action-btn delete-category" data-id="${category.category_id}" data-name="${category.category_name}" title="Delete Category">
                      <span class="action-icon">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      document.querySelectorAll('.edit-category').forEach(button => {
        button.addEventListener('click', (e) => {
          const categoryId = e.currentTarget.dataset.id;
          this.handleEditCategory(categoryId);
        });
      });
      
      document.querySelectorAll('.delete-category').forEach(button => {
        button.addEventListener('click', (e) => {
          const categoryId = e.currentTarget.dataset.id;
          const categoryName = e.currentTarget.dataset.name;
          this.confirmDeleteCategory(categoryId, categoryName);
        });
      });
      
    } catch (error) {
      console.error('Error loading categories:', error);
      const categoriesContainer = document.getElementById('categories-list');
      if (categoriesContainer) {
        categoriesContainer.innerHTML = '<p class="error-message">Error loading categories. Please try again later.</p>';
      }
    }
  }
  
  async loadRecentCategories() {
    try {
      const recentCategoriesContainer = document.getElementById('recent-categories');
      if (!recentCategoriesContainer) return;
      
      recentCategoriesContainer.innerHTML = '<p class="loading-text">Loading categories...</p>';
      
      if (this.categories.length === 0) {
        this.categories = await categoryService.getAllCategories();
      }
      
      if (this.categories.length === 0) {
        recentCategoriesContainer.innerHTML = '<p class="empty-message">No categories found. Add your first category!</p>';
        return;
      }
      
      const recentCategories = this.categories.slice(0, 5);
      
      recentCategoriesContainer.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${recentCategories.map(category => `
              <tr>
                <td>${category.category_name}</td>
                <td>${category.category_description || 'No description'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
    } catch (error) {
      console.error('Error loading recent categories:', error);
      const recentCategoriesContainer = document.getElementById('recent-categories');
      if (recentCategoriesContainer) {
        recentCategoriesContainer.innerHTML = '<p class="error-message">Error loading categories. Please try again later.</p>';
      }
    }
  }
  
  renderQuizRow(quiz) {
    const isValid = quiz.is_valid;
    const statusClass = isValid ? 'valid-status' : 'invalid-status';
    const statusText = isValid ? 'Ready' : `Not Ready (${quiz.valid_questions}/5)`;
    
    return `
      <tr>
        <td>${quiz.quiz_title}</td>
        <td>${quiz.category_name || 'Uncategorized'}</td>
        <td>
          <span class="status-badge ${statusClass}">
            ${statusText}
          </span>
        </td>
        <td>${quiz.question_count || 0}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn manage-questions" data-id="${quiz.quiz_id}" data-title="${quiz.quiz_title}" title="Manage Questions">
              <span class="action-icon">📝</span>
            </button>
            <button class="action-btn delete-quiz" data-id="${quiz.quiz_id}" data-title="${quiz.quiz_title}" title="Delete Quiz">
              <span class="action-icon">🗑️</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }
  
  handleEditQuiz(quizId) {
    localStorage.setItem('selected_quiz_id', quizId);
    window.location.href = '/create-quiz';
  }
  
  handleManageQuestions(quizId, quizTitle) {
    localStorage.setItem('selected_quiz_id', quizId);
    localStorage.setItem('selected_quiz_title', quizTitle);
    window.location.href = '/create-quiz';
  }
  
  confirmDeleteQuiz(quizId, quizTitle) {
    const confirmMessage = document.getElementById('confirm-message');
    confirmMessage.textContent = `Are you sure you want to delete the quiz "${quizTitle}"?`;
    
    const confirmAction = document.getElementById('confirm-action');
    confirmAction.onclick = () => this.handleDeleteQuiz(quizId);
    
    this.showConfirmModal();
  }
  
  async handleDeleteQuiz(quizId) {
    try {
      await quizService.deleteQuiz(quizId);
      this.showNotification('Quiz deleted successfully');
      
      this.loadQuizzes();
      if (this.viewMode === 'dashboard') {
        this.loadRecentQuizzes();
      }
      
      this.closeConfirmModal();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      this.showNotification('Failed to delete quiz: ' + (error.message || 'Unknown error'), 'error');
      this.closeConfirmModal();
    }
  }
  
  handleEditCategory(categoryId) {
    const category = this.categories.find(c => c.category_id == categoryId);
    if (!category) return;
    
    document.getElementById('category-modal-title').textContent = 'Edit Category';
    document.getElementById('category-id').value = category.category_id;
    document.getElementById('category-name').value = category.category_name;
    document.getElementById('category-description').value = category.category_description || '';
    
    this.showCategoryModal();
  }
  
  confirmDeleteCategory(categoryId, categoryName) {
    const confirmMessage = document.getElementById('confirm-message');
    confirmMessage.textContent = `Are you sure you want to delete the category "${categoryName}"?`;
    
    const confirmAction = document.getElementById('confirm-action');
    confirmAction.onclick = () => this.handleDeleteCategory(categoryId);
    
    this.showConfirmModal();
  }
  
  async handleDeleteCategory(categoryId) {
    try {
      await categoryService.deleteCategory(categoryId);
      this.showNotification('Category deleted successfully');
      
      this.loadCategories();
      if (this.viewMode === 'dashboard') {
        this.loadRecentCategories();
      }
      
      this.closeConfirmModal();
    } catch (error) {
      console.error('Error deleting category:', error);
      this.showNotification('Failed to delete category: ' + (error.message || 'Unknown error'), 'error');
      this.closeConfirmModal();
    }
  }
  
  async handleCategorySubmit() {
    const categoryId = document.getElementById('category-id').value;
    const categoryName = document.getElementById('category-name').value;
    const categoryDescription = document.getElementById('category-description').value;
    
    if (!categoryName) {
      this.showNotification('Category name is required', 'error');
      return;
    }
    
    try {
      if (categoryId) {
        await categoryService.updateCategory(categoryId, {
          category_name: categoryName,
          category_description: categoryDescription
        });
        this.showNotification('Category updated successfully');
      } else {
        await categoryService.createCategory({
          category_name: categoryName,
          category_description: categoryDescription
        });
        this.showNotification('Category created successfully');
      }
      
      this.loadCategories();
      if (this.viewMode === 'dashboard') {
        this.loadRecentCategories();
      }
      
      this.closeCategoryModal();
    } catch (error) {
      console.error('Error saving category:', error);
      this.showNotification('Failed to save category: ' + (error.message || 'Unknown error'), 'error');
    }
  }
  
  showCategoryModal() {
    document.getElementById('category-modal-title').textContent = 'Add New Category';
    document.getElementById('category-id').value = '';
    document.getElementById('category-name').value = '';
    document.getElementById('category-description').value = '';
    
    const categoryModal = document.getElementById('category-modal');
    categoryModal.classList.add('visible');
  }
  
  closeCategoryModal() {
    const categoryModal = document.getElementById('category-modal');
    categoryModal.classList.remove('visible');
  }
  
  showConfirmModal() {
    const confirmModal = document.getElementById('confirm-modal');
    confirmModal.classList.add('visible');
  }
  
  closeConfirmModal() {
    const confirmModal = document.getElementById('confirm-modal');
    confirmModal.classList.remove('visible');
  }
  
  closeAllModals() {
    this.closeCategoryModal();
    this.closeConfirmModal();
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
  }
}