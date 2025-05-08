import "./AdminSidebar.js";
import "./AdminStats.js";
import "./AdminTable.js";
import "./AdminModal.js";
import "./AdminCard.js";
import "./AdminNotification.js";

class AdminDashboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.quizzes = [];
        this.categories = [];
        this.viewMode = 'dashboard';
        
        this.changeView = this.changeView.bind(this);
        this.showCategoryModal = this.showCategoryModal.bind(this);
        this.handleCategorySubmit = this.handleCategorySubmit.bind(this);
        this.confirmDeleteCategory = this.confirmDeleteCategory.bind(this);
        this.confirmDeleteQuiz = this.confirmDeleteQuiz.bind(this);
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        
        this.checkAuthorization();
    }
    
    async checkAuthorization() {
        const authService = window.authService;
        
        try {
            const isAuthenticated = await authService.checkAuthentication();
            if (!isAuthenticated) {
                window.location.href = '/login';
                return;
            }

            if (!authService.isQuizMaster()) {
                window.location.href = '/home';
                return;
            }
            
            this.loadInitialData();
            
        } catch (error) {
            console.error('Error checking authentication:', error);
            window.location.href = '/login';
        }
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .admin-page {
                    width: 100%;
                    min-height: calc(100vh - 8rem);
                    background-color: var(--gray-100);
                }
                
                .admin-container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                }
                
                .admin-content {
                    flex: 1;
                    padding: 2rem;
                    overflow-x: auto;
                }
                
                .admin-view {
                    width: 100%;
                }
                
                .admin-view.hidden {
                    display: none;
                }
                
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .admin-header h1 {
                    margin: 0;
                    font-size: 1.75rem;
                }
                
                .admin-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.5rem 1rem;
                    border-radius: 0.25rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    text-decoration: none;
                    font-family: inherit;
                }
                
                .primary-btn {
                    background-color: var(--primary);
                    color: white;
                }
                
                .primary-btn:hover {
                    background-color: var(--primary-dark);
                }
                
                .secondary-btn {
                    background-color: var(--gray-200);
                    color: var(--gray-700);
                }
                
                .secondary-btn:hover {
                    background-color: var(--gray-300);
                }
                
                .danger-btn {
                    background-color: var(--error);
                    color: white;
                }
                
                .danger-btn:hover {
                    background-color: var(--error-dark);
                }
                
                .loading-text {
                    color: var(--gray-500);
                    text-align: center;
                    margin: 1rem 0;
                }
                
                .empty-message {
                    color: var(--gray-600);
                    text-align: center;
                    margin: 2rem 0;
                }
                
                .error-message {
                    color: var(--error);
                    text-align: center;
                    margin: 2rem 0;
                }
            </style>
            
            <main class="admin-page">
                <section class="admin-container">
                    <admin-sidebar active-view="${this.viewMode}" @change-view="${this.changeView}"></admin-sidebar>
                    
                    <section class="admin-content">
                        <section id="dashboard-view" class="admin-view ${this.viewMode === 'dashboard' ? '' : 'hidden'}">
                            <header class="admin-header">
                                <h1>Admin Dashboard</h1>
                                <section class="admin-actions">
                                    <a href="/create-quiz" class="admin-btn primary-btn" data-link>Create New Quiz</a>
                                </section>
                            </header>
                            
                            <admin-stats id="admin-stats"></admin-stats>
                            
                            <section class="admin-cards">
                                <admin-card title="Recently Created Quizzes" action="View All" action-view="quizzes">
                                    <p class="loading-text" slot="content">Loading quizzes...</p>
                                </admin-card>
                                
                                <admin-card title="Categories" action="View All" action-view="categories">
                                    <p class="loading-text" slot="content">Loading categories...</p>
                                </admin-card>
                            </section>
                        </section>
                        
                        <section id="quizzes-view" class="admin-view ${this.viewMode === 'quizzes' ? '' : 'hidden'}">
                            <header class="admin-header">
                                <h1>Quiz Management</h1>
                                <section class="admin-actions">
                                    <a href="/create-quiz" class="admin-btn primary-btn" data-link>Create New Quiz</a>
                                </section>
                            </header>
                            
                            <admin-card full-width>
                                <p class="loading-text" slot="content" id="quizzes-list">Loading quizzes...</p>
                            </admin-card>
                        </section>
                        
                        <section id="categories-view" class="admin-view ${this.viewMode === 'categories' ? '' : 'hidden'}">
                            <header class="admin-header">
                                <h1>Category Management</h1>
                                <section class="admin-actions">
                                    <button id="add-category-btn" class="admin-btn primary-btn">Add Category</button>
                                </section>
                            </header>
                            
                            <admin-card full-width>
                                <p class="loading-text" slot="content" id="categories-list">Loading categories...</p>
                            </admin-card>
                        </section>
                    </section>
                </section>
            </main>
            
            <admin-modal id="category-modal" title="Add New Category">
                <form id="category-form" slot="content">
                    <input type="hidden" id="category-id" value="">
                    <section class="form-group">
                        <label for="category-name">Category Name</label>
                        <input type="text" id="category-name" required maxlength="32">
                    </section>
                    <section class="form-group">
                        <label for="category-description">Description</label>
                        <input type="text" id="category-description" maxlength="64">
                    </section>
                    <section class="form-actions">
                        <button type="button" class="admin-btn secondary-btn" id="cancel-category">Cancel</button>
                        <button type="submit" class="admin-btn primary-btn">Save Category</button>
                    </section>
                </form>
            </admin-modal>
            
            <admin-modal id="confirm-modal" title="Confirm Action">
                <section slot="content">
                    <p id="confirm-message">Are you sure you want to proceed?</p>
                    <section class="form-actions">
                        <button class="admin-btn secondary-btn" id="cancel-confirm">Cancel</button>
                        <button class="admin-btn primary-btn danger-btn" id="confirm-action">Confirm</button>
                    </section>
                </section>
            </admin-modal>
            
            <admin-notification id="notification-toast"></admin-notification>
        `;
    }
    
    setupEventListeners() {
        const sidebar = this.shadowRoot.querySelector('admin-sidebar');
        if (sidebar) {
            sidebar.addEventListener('change-view', (e) => {
                this.changeView(e.detail.view);
            });
        }
        
        const cards = this.shadowRoot.querySelectorAll('admin-card');
        cards.forEach(card => {
            card.addEventListener('action-click', (e) => {
                this.changeView(e.detail.view);
            });
        });
        
        const addCategoryBtn = this.shadowRoot.querySelector('#add-category-btn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', this.showCategoryModal);
        }
        
        const categoryForm = this.shadowRoot.querySelector('#category-form');
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCategorySubmit();
            });
        }
        
        const cancelCategoryBtn = this.shadowRoot.querySelector('#cancel-category');
        if (cancelCategoryBtn) {
            cancelCategoryBtn.addEventListener('click', () => {
                const categoryModal = this.shadowRoot.querySelector('#category-modal');
                if (categoryModal) categoryModal.hide();
            });
        }
        
        const cancelConfirmBtn = this.shadowRoot.querySelector('#cancel-confirm');
        if (cancelConfirmBtn) {
            cancelConfirmBtn.addEventListener('click', () => {
                const confirmModal = this.shadowRoot.querySelector('#confirm-modal');
                if (confirmModal) confirmModal.hide();
            });
        }
        
        const links = this.shadowRoot.querySelectorAll('[data-link]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.pushState(null, null, link.getAttribute('href'));
                window.dispatchEvent(new PopStateEvent('popstate'));
            });
        });
    }
    
    loadInitialData() {
        setTimeout(() => {
            this.loadStats();
            this.loadQuizzes();
            this.loadCategories();
            setTimeout(() => {
                this.loadRecentQuizzes();
                this.loadRecentCategories();
            }, 300);
        }, 100);
    }
    
    changeView(viewName) {
        this.viewMode = viewName;
        
        const sidebar = this.shadowRoot.querySelector('admin-sidebar');
        if (sidebar) {
            sidebar.setAttribute('active-view', viewName);
        }
        
        const views = this.shadowRoot.querySelectorAll('.admin-view');
        views.forEach(view => {
            view.classList.add('hidden');
        });
        
        const activeView = this.shadowRoot.querySelector(`#${viewName}-view`);
        if (activeView) {
            activeView.classList.remove('hidden');
        }
        
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
        const statsComponent = this.shadowRoot.querySelector('#admin-stats');
        if (!statsComponent) return;
        
        try {
            const statsService = window.statsService;
            if (statsService) {
                const stats = await statsService.getDashboardStats();
                statsComponent.setStats(stats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            statsComponent.setError(error);
        }
    }
    
    async loadQuizzes() {
        try {
            const quizzesContainer = this.shadowRoot.querySelector('#quizzes-list');
            if (!quizzesContainer) return;
            
            quizzesContainer.innerHTML = '<p class="loading-text">Loading quizzes...</p>';
            
            if (!window.quizService || !window.quizValidatorService) {
                throw new Error('Quiz services not available');
            }
            
            this.quizzes = await window.quizService.getAllQuizzes();
            for (let i = 0; i < this.quizzes.length; i++) {
                const quiz = this.quizzes[i];
                try {
                    const validation = await window.quizValidatorService.validateQuiz(quiz.quiz_id);
                    
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
            
            const table = document.createElement('admin-table');
            table.columns = [
                { key: 'quiz_title', title: 'Quiz Name' },
                { key: 'category_name', title: 'Category' },
                { key: 'status', title: 'Status' },
                { key: 'question_count', title: 'Questions' },
                { key: 'actions', title: 'Actions' }
            ];
            
            table.data = this.quizzes.map(quiz => {
                const isValid = quiz.is_valid;
                const statusClass = isValid ? 'valid-status' : 'invalid-status';
                const statusText = isValid ? 'Ready' : `Not Ready (${quiz.valid_questions}/5)`;
                
                return {
                    quiz_title: quiz.quiz_title,
                    category_name: quiz.category_name || 'Uncategorized',
                    status: {
                        type: 'badge',
                        value: statusText,
                        class: statusClass
                    },
                    question_count: quiz.question_count || 0,
                    actions: {
                        type: 'actions',
                        items: [
                            {
                                type: 'button',
                                icon: '📝',
                                title: 'Manage Questions',
                                action: 'manage-questions',
                                data: {
                                    id: quiz.quiz_id,
                                    title: quiz.quiz_title
                                }
                            },
                            {
                                type: 'button',
                                icon: '🗑️',
                                title: 'Delete Quiz',
                                action: 'delete-quiz',
                                data: {
                                    id: quiz.quiz_id,
                                    title: quiz.quiz_title
                                }
                            }
                        ]
                    }
                };
            });
            
            table.addEventListener('action', (e) => {
                const { action, data } = e.detail;
                
                if (action === 'manage-questions') {
                    this.handleManageQuestions(data.id, data.title);
                } else if (action === 'delete-quiz') {
                    this.confirmDeleteQuiz(data.id, data.title);
                }
            });
            
            quizzesContainer.innerHTML = '';
            quizzesContainer.appendChild(table);
            
        } catch (error) {
            console.error('Error loading quizzes:', error);
            const quizzesContainer = this.shadowRoot.querySelector('#quizzes-list');
            if (quizzesContainer) {
                quizzesContainer.innerHTML = '<p class="error-message">Error loading quizzes. Please try again later.</p>';
            }
        }
    }
    
    async loadRecentQuizzes() {
        try {
            const dashboardView = this.shadowRoot.querySelector('#dashboard-view');
            if (!dashboardView) return;
            
            const quizzesCard = dashboardView.querySelector('admin-card:first-of-type');
            const contentSlot = quizzesCard.querySelector('[slot="content"]');
            
            contentSlot.innerHTML = '<p class="loading-text">Loading quizzes...</p>';
            
            if (this.quizzes.length === 0 && window.quizService) {
                this.quizzes = await window.quizService.getAllQuizzes();
            }
            
            if (this.quizzes.length === 0) {
                contentSlot.innerHTML = '<p class="empty-message">No quizzes found. Create your first quiz!</p>';
                return;
            }
            
            const recentQuizzes = this.quizzes.slice(0, 5);
            
            const table = document.createElement('admin-table');
            table.columns = [
                { key: 'quiz_title', title: 'Quiz Name' },
                { key: 'status', title: 'Status' },
                { key: 'actions', title: 'Actions' }
            ];
            
            table.data = recentQuizzes.map(quiz => {
                const hasEnoughQuestions = (quiz.question_count || 0) >= 5;
                
                return {
                    quiz_title: quiz.quiz_title,
                    status: {
                        type: 'badge',
                        value: hasEnoughQuestions ? 'Ready' : 'Not Ready',
                        class: hasEnoughQuestions ? 'valid-status' : 'invalid-status'
                    },
                    actions: {
                        type: 'actions',
                        items: [
                            {
                                type: 'button',
                                icon: '📝',
                                title: 'Manage Questions',
                                action: 'manage-questions',
                                data: {
                                    id: quiz.quiz_id,
                                    title: quiz.quiz_title
                                }
                            }
                        ]
                    }
                };
            });
            
            table.addEventListener('action', (e) => {
                const { action, data } = e.detail;
                
                if (action === 'manage-questions') {
                    this.handleManageQuestions(data.id, data.title);
                }
            });
            
            contentSlot.innerHTML = '';
            contentSlot.appendChild(table);
            
        } catch (error) {
            console.error('Error loading recent quizzes:', error);
            const dashboardView = this.shadowRoot.querySelector('#dashboard-view');
            if (dashboardView) {
                const quizzesCard = dashboardView.querySelector('admin-card:first-of-type');
                const contentSlot = quizzesCard.querySelector('[slot="content"]');
                contentSlot.innerHTML = '<p class="error-message">Error loading quizzes. Please try again later.</p>';
            }
        }
    }
    
    async loadCategories() {
        try {
            const categoriesContainer = this.shadowRoot.querySelector('#categories-list');
            if (!categoriesContainer) return;
            
            categoriesContainer.innerHTML = '<p class="loading-text">Loading categories...</p>';
            
            if (!window.categoryService) {
                throw new Error('Category service not available');
            }
            
            this.categories = await window.categoryService.getAllCategories();
            
            if (this.categories.length === 0) {
                categoriesContainer.innerHTML = '<p class="empty-message">No categories found. Add your first category!</p>';
                return;
            }
            
            const table = document.createElement('admin-table');
            table.columns = [
                { key: 'category_name', title: 'Category Name' },
                { key: 'category_description', title: 'Description' },
                { key: 'actions', title: 'Actions' }
            ];
            
            table.data = this.categories.map(category => {
                return {
                    category_name: category.category_name,
                    category_description: category.category_description || 'No description',
                    actions: {
                        type: 'actions',
                        items: [
                            {
                                type: 'button',
                                icon: '✏️',
                                title: 'Edit Category',
                                action: 'edit-category',
                                data: {
                                    id: category.category_id
                                }
                            },
                            {
                                type: 'button',
                                icon: '🗑️',
                                title: 'Delete Category',
                                action: 'delete-category',
                                data: {
                                    id: category.category_id,
                                    name: category.category_name
                                }
                            }
                        ]
                    }
                };
            });
            
            table.addEventListener('action', (e) => {
                const { action, data } = e.detail;
                
                if (action === 'edit-category') {
                    this.handleEditCategory(data.id);
                } else if (action === 'delete-category') {
                    this.confirmDeleteCategory(data.id, data.name);
                }
            });
            
            categoriesContainer.innerHTML = '';
            categoriesContainer.appendChild(table);
            
        } catch (error) {
            console.error('Error loading categories:', error);
            const categoriesContainer = this.shadowRoot.querySelector('#categories-list');
            if (categoriesContainer) {
                categoriesContainer.innerHTML = '<p class="error-message">Error loading categories. Please try again later.</p>';
            }
        }
    }
    
    async loadRecentCategories() {
        try {
            const dashboardView = this.shadowRoot.querySelector('#dashboard-view');
            if (!dashboardView) return;
            
            const categoriesCard = dashboardView.querySelector('admin-card:nth-of-type(2)');
            const contentSlot = categoriesCard.querySelector('[slot="content"]');
            
            contentSlot.innerHTML = '<p class="loading-text">Loading categories...</p>';
            
            if (this.categories.length === 0 && window.categoryService) {
                this.categories = await window.categoryService.getAllCategories();
            }
            
            if (this.categories.length === 0) {
                contentSlot.innerHTML = '<p class="empty-message">No categories found. Add your first category!</p>';
                return;
            }
            
            const recentCategories = this.categories.slice(0, 5);
            
            const table = document.createElement('admin-table');
            table.columns = [
                { key: 'category_name', title: 'Category Name' },
                { key: 'category_description', title: 'Description' }
            ];
            
            table.data = recentCategories.map(category => {
                return {
                    category_name: category.category_name,
                    category_description: category.category_description || 'No description'
                };
            });
            
            contentSlot.innerHTML = '';
            contentSlot.appendChild(table);
            
        } catch (error) {
            console.error('Error loading recent categories:', error);
            const dashboardView = this.shadowRoot.querySelector('#dashboard-view');
            if (dashboardView) {
                const categoriesCard = dashboardView.querySelector('admin-card:nth-of-type(2)');
                const contentSlot = categoriesCard.querySelector('[slot="content"]');
                contentSlot.innerHTML = '<p class="error-message">Error loading categories. Please try again later.</p>';
            }
        }
    }
    
    handleManageQuestions(quizId, quizTitle) {
        localStorage.setItem('selected_quiz_id', quizId);
        localStorage.setItem('selected_quiz_title', quizTitle);
        window.location.href = '/create-quiz';
    }
    
    confirmDeleteQuiz(quizId, quizTitle) {
        const confirmModal = this.shadowRoot.querySelector('#confirm-modal');
        const confirmMessage = this.shadowRoot.querySelector('#confirm-message');
        const confirmAction = this.shadowRoot.querySelector('#confirm-action');
        
        if (!confirmModal || !confirmMessage || !confirmAction) return;
        
        confirmMessage.textContent = `Are you sure you want to delete the quiz "${quizTitle}"?`;
        
        confirmAction.onclick = () => this.handleDeleteQuiz(quizId);
        
        confirmModal.show();
    }
    
    async handleDeleteQuiz(quizId) {
        try {
            if (!window.quizService) {
                throw new Error('Quiz service not available');
            }
            
            await window.quizService.deleteQuiz(quizId);
            
            this.showNotification('Quiz deleted successfully');
            
            this.loadQuizzes();
            if (this.viewMode === 'dashboard') {
                this.loadRecentQuizzes();
            }
            
            const confirmModal = this.shadowRoot.querySelector('#confirm-modal');
            if (confirmModal) confirmModal.hide();
        } catch (error) {
            console.error('Error deleting quiz:', error);
            this.showNotification('Failed to delete quiz: ' + (error.message || 'Unknown error'), 'error');
            
            const confirmModal = this.shadowRoot.querySelector('#confirm-modal');
            if (confirmModal) confirmModal.hide();
        }
    }
    
    handleEditCategory(categoryId) {
        const category = this.categories.find(c => c.category_id == categoryId);
        if (!category) return;
        
        const categoryModal = this.shadowRoot.querySelector('#category-modal');
        const modalTitle = categoryModal.querySelector('h2') || categoryModal.shadowRoot.querySelector('h2');
        const categoryIdInput = this.shadowRoot.querySelector('#category-id');
        const categoryNameInput = this.shadowRoot.querySelector('#category-name');
        const categoryDescriptionInput = this.shadowRoot.querySelector('#category-description');
        
        if (modalTitle) modalTitle.textContent = 'Edit Category';
        if (categoryIdInput) categoryIdInput.value = category.category_id;
        if (categoryNameInput) categoryNameInput.value = category.category_name;
        if (categoryDescriptionInput) categoryDescriptionInput.value = category.category_description || '';
        
        categoryModal.show();
    }
    
    confirmDeleteCategory(categoryId, categoryName) {
        const confirmModal = this.shadowRoot.querySelector('#confirm-modal');
        const confirmMessage = this.shadowRoot.querySelector('#confirm-message');
        const confirmAction = this.shadowRoot.querySelector('#confirm-action');
        
        if (!confirmModal || !confirmMessage || !confirmAction) return;
        
        confirmMessage.textContent = `Are you sure you want to delete the category "${categoryName}"?`;
        
        confirmAction.onclick = () => this.handleDeleteCategory(categoryId);
        
        confirmModal.show();
    }
    
    async handleDeleteCategory(categoryId) {
        try {
            if (!window.categoryService) {
                throw new Error('Category service not available');
            }
            
            await window.categoryService.deleteCategory(categoryId);
            
            this.showNotification('Category deleted successfully');
            
            this.loadCategories();
            if (this.viewMode === 'dashboard') {
                this.loadRecentCategories();
            }
            
            const confirmModal = this.shadowRoot.querySelector('#confirm-modal');
            if (confirmModal) confirmModal.hide();
        } catch (error) {
            console.error('Error deleting category:', error);
            this.showNotification('Failed to delete category: ' + (error.message || 'Unknown error'), 'error');
            
            const confirmModal = this.shadowRoot.querySelector('#confirm-modal');
            if (confirmModal) confirmModal.hide();
        }
    }
    
    showCategoryModal() {
        const categoryModal = this.shadowRoot.querySelector('#category-modal');
        const modalTitle = categoryModal.querySelector('h2') || categoryModal.shadowRoot.querySelector('h2');
        const categoryIdInput = this.shadowRoot.querySelector('#category-id');
        const categoryNameInput = this.shadowRoot.querySelector('#category-name');
        const categoryDescriptionInput = this.shadowRoot.querySelector('#category-description');
        
        if (modalTitle) modalTitle.textContent = 'Add New Category';
        if (categoryIdInput) categoryIdInput.value = '';
        if (categoryNameInput) categoryNameInput.value = '';
        if (categoryDescriptionInput) categoryDescriptionInput.value = '';
        
        categoryModal.show();
    }
    
    async handleCategorySubmit() {
        const categoryIdInput = this.shadowRoot.querySelector('#category-id');
        const categoryNameInput = this.shadowRoot.querySelector('#category-name');
        const categoryDescriptionInput = this.shadowRoot.querySelector('#category-description');
        
        if (!categoryNameInput) return;
        
        const categoryId = categoryIdInput.value;
        const categoryName = categoryNameInput.value.trim();
        const categoryDescription = categoryDescriptionInput.value.trim();
        
        if (!categoryName) {
            this.showNotification('Category name is required', 'error');
            return;
        }
        
        try {
            if (!window.categoryService) {
                throw new Error('Category service not available');
            }
            
            if (categoryId) {
                await window.categoryService.updateCategory(categoryId, {
                    category_name: categoryName,
                    category_description: categoryDescription
                });
                this.showNotification('Category updated successfully');
            } else {
                await window.categoryService.createCategory({
                    category_name: categoryName,
                    category_description: categoryDescription
                });
                this.showNotification('Category created successfully');
            }
            
            this.loadCategories();
            if (this.viewMode === 'dashboard') {
                this.loadRecentCategories();
            }
            
            const categoryModal = this.shadowRoot.querySelector('#category-modal');
            if (categoryModal) categoryModal.hide();
        } catch (error) {
            console.error('Error saving category:', error);
            this.showNotification('Failed to save category: ' + (error.message || 'Unknown error'), 'error');
        }
    }
    
    showNotification(message, type = 'success') {
        const toast = this.shadowRoot.querySelector('#notification-toast');
        if (toast) {
            toast.show(message, type);
        }
    }
}

customElements.define('admin-dashboard', AdminDashboard);

export default AdminDashboard;