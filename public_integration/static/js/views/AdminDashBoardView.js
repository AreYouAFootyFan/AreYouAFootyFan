import AbstractView from "./AbstractView.js";
import authService from "../services/auth.service.js";
import quizService from "../services/quiz.service.js";
import categoryService from "../services/category.service.js";

export default class AdminDashboardView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Admin Dashboard");
    }

    async getHtml() {
        return `
            <section class="admin-page">
                <article class="admin-main">
                    <section class="admin-sidebar">
                        <article class="admin-nav">
                            <ul>
                                <li><a href="/admin" class="admin-nav-link active" data-admin-page="dashboard">Dashboard</a></li>
                                <li><a href="/create-quiz" class="admin-nav-link" data-link data-admin-page="create-quiz">Create Quiz</a></li>
                            </ul>
                        </article>
                    </section>

                    <section class="admin-content" id="admin-content">
                        <section class="page-header">
                            <h1>Admin Dashboard</h1>
                            <div class="header-actions">
                                <a href="/create-quiz" class="btn btn-primary" data-link>Create New Quiz</a>
                            </div>
                        </section>

                        <!-- Dashboard Stats -->
                        <section class="dashboard-stats" aria-labelledby="dashboard-stats-heading">
                            <h2 id="dashboard-stats-heading" class="visually-hidden">Quiz Platform Statistics</h2>
                            
                            <article class="stat-card" aria-labelledby="active-quizzes-stat">
                                <h1 class="stat-value" id="active-quizzes-stat" aria-label="Active quizzes">0</h1>
                                <p class="stat-label">Active Quizzes</p>
                                <p class="stat-change positive">
                                    <span class="visually-hidden">Change: </span>
                                    <span aria-hidden="true">↑</span> Loading...
                                </p>
                            </article>
                            
                            <article class="stat-card" aria-labelledby="registered-players-stat">
                                <h1 class="stat-value" id="registered-players-stat" aria-label="Registered players">0</h1>
                                <p class="stat-label">Registered Players</p>
                                <p class="stat-change positive">
                                    <span class="visually-hidden">Change: </span>
                                    <span aria-hidden="true">↑</span> Loading...
                                </p>
                            </article>
                            
                            <article class="stat-card" aria-labelledby="quizzes-completed-stat">
                                <h1 class="stat-value" id="quizzes-completed-stat" aria-label="Quizzes completed">0</h1>
                                <p class="stat-label">Quizzes Completed</p>
                                <p class="stat-change positive">
                                    <span class="visually-hidden">Change: </span>
                                    <span aria-hidden="true">↑</span> Loading...
                                </p>
                            </article>
                            
                            <article class="stat-card" aria-labelledby="questions-answered-stat">
                                <h1 class="stat-value" id="questions-answered-stat" aria-label="Questions answered">0</h1>
                                <p class="stat-label">Questions Answered</p>
                                <p class="stat-change positive">
                                    <span class="visually-hidden">Change: </span>
                                    <span aria-hidden="true">↑</span> Loading...
                                </p>
                            </article>
                        </section>

                        <!-- Dashboard Cards -->
                        <div class="dashboard-grid">
                            <!-- Recent Quizzes Card -->
                            <section class="dashboard-card">
                                <header class="card-header">
                                    <h2>Your Quizzes</h2>
                                    <a href="/create-quiz" class="btn btn-text" data-link>Create New</a>
                                </header>
                                <section class="card-content" id="recent-quizzes">
                                    <p>Loading quizzes...</p>
                                </section>
                            </section>

                            <!-- Categories Card -->
                            <section class="dashboard-card">
                                <header class="card-header">
                                    <h2>Categories</h2>
                                    <button class="btn btn-text" id="add-category-btn">Add New</button>
                                </header>
                                <section class="card-content" id="categories-list">
                                    <p>Loading categories...</p>
                                </section>
                            </section>
                        </div>
                    </section>
                </article>
            </section>

            <!-- Add Category Modal -->
            <div id="add-category-modal" class="modal hidden">
                <div class="modal-content">
                    <header class="modal-header">
                        <h2>Add New Category</h2>
                        <button class="close-modal" id="close-category-modal">&times;</button>
                    </header>
                    <form id="add-category-form" class="modal-body">
                        <div class="form-group">
                            <label for="category-name">Category Name</label>
                            <input type="text" id="category-name" required maxlength="32">
                        </div>
                        <div class="form-group">
                            <label for="category-description">Description</label>
                            <input type="text" id="category-description" maxlength="64">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" id="cancel-category">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Category</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    async mount() {
        const isAuthenticated = await authService.checkAuthentication();
        if (!isAuthenticated) {
            window.location.href = '/';
            return;
        }

        if (!authService.isQuizMaster()) {
            window.location.href = '/home';
            return;
        }

        this.updateHeader();
        
        this.loadQuizzes();
        this.loadCategories();
        this.loadPlaceholderStats();
        
        this.setupEventListeners();
    }

    updateHeader() {
        const user = authService.getUser();
        const loginLink = document.querySelector('.user-menu .btn');
        const userDropdown = document.getElementById('user-dropdown');
        const usernameDisplay = document.getElementById('username-display');
        
        if (user) {
            if (loginLink) loginLink.classList.add('hidden');
            if (userDropdown) {
                userDropdown.classList.remove('hidden');
                if (usernameDisplay) {
                    usernameDisplay.textContent = user.username || 'Admin';
                }
            }
            
            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    authService.logout();
                });
            }
        }
    }

    async loadQuizzes() {
        try {
            const recentQuizzesContainer = document.getElementById('recent-quizzes');
            if (!recentQuizzesContainer) return;
            
            const quizzes = await quizService.getAllQuizzes();
            
            if (quizzes.length === 0) {
                recentQuizzesContainer.innerHTML = '<p>No quizzes found. Create your first quiz!</p>';
                return;
            }
            
            const quizzesTable = document.createElement('table');
            quizzesTable.className = 'admin-table';
            quizzesTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Quiz Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${quizzes.map(quiz => this.renderQuizRow(quiz)).join('')}
                </tbody>
            `;
            
            recentQuizzesContainer.innerHTML = '';
            recentQuizzesContainer.appendChild(quizzesTable);
            
            document.querySelectorAll('.view-quiz-questions').forEach(button => {
                button.addEventListener('click', (e) => {
                    const quizId = e.target.dataset.id;
                    const quizTitle = e.target.dataset.title;
                    this.handleViewQuestions(quizId, quizTitle);
                });
            });
            
            document.querySelectorAll('.delete-quiz').forEach(button => {
                button.addEventListener('click', (e) => {
                    const quizId = e.target.dataset.id;
                    this.handleDeleteQuiz(quizId);
                });
            });
        } catch (error) {
            console.error('Error loading quizzes:', error);
            const recentQuizzesContainer = document.getElementById('recent-quizzes');
            if (recentQuizzesContainer) {
                recentQuizzesContainer.innerHTML = '<p>Error loading quizzes. Please try again later.</p>';
            }
        }
    }

    renderQuizRow(quiz) {
        let statusClass = 'invalid-status';
        let statusText = 'Not Ready';
        if (quiz.question_count >= 5) {
            statusClass = 'valid-status';
            statusText = 'Ready';
        }
        
        return `
            <tr>
                <td>${quiz.quiz_title}</td>
                <td>${quiz.category_name || 'Uncategorized'}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-icon view-quiz-questions" 
                                data-id="${quiz.quiz_id}" 
                                data-title="${quiz.quiz_title}" 
                                title="Manage Questions">📝</button>
                        <button class="btn btn-icon delete-quiz" 
                                data-id="${quiz.quiz_id}" 
                                title="Delete Quiz">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }

    async loadCategories() {
        try {
            const categoriesContainer = document.getElementById('categories-list');
            if (!categoriesContainer) return;
            
            const categories = await categoryService.getAllCategories();
            
            if (categories.length === 0) {
                categoriesContainer.innerHTML = '<p>No categories found. Add your first category!</p>';
                return;
            }
            
            const categoriesTable = document.createElement('table');
            categoriesTable.className = 'admin-table';
            categoriesTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories.map(category => `
                        <tr>
                            <td>${category.category_name}</td>
                            <td>${category.category_description || 'No description'}</td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn btn-icon delete-category" 
                                            data-id="${category.category_id}" 
                                            title="Delete Category">🗑️</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            
            categoriesContainer.innerHTML = '';
            categoriesContainer.appendChild(categoriesTable);
            
            document.querySelectorAll('.delete-category').forEach(button => {
                button.addEventListener('click', (e) => {
                    const categoryId = e.target.dataset.id;
                    this.handleDeleteCategory(categoryId);
                });
            });
        } catch (error) {
            console.error('Error loading categories:', error);
            const categoriesContainer = document.getElementById('categories-list');
            if (categoriesContainer) {
                categoriesContainer.innerHTML = '<p>Error loading categories. Please try again later.</p>';
            }
        }
    }

    loadPlaceholderStats() {
        document.getElementById('active-quizzes-stat').textContent = '24';
        document.getElementById('registered-players-stat').textContent = '156';
        document.getElementById('quizzes-completed-stat').textContent = '1,245';
        document.getElementById('questions-answered-stat').textContent = '18,672';
    }

    setupEventListeners() {
        const addCategoryBtn = document.getElementById('add-category-btn');
        const categoryModal = document.getElementById('add-category-modal');
        const closeCategoryModal = document.getElementById('close-category-modal');
        const cancelCategory = document.getElementById('cancel-category');
        const categoryForm = document.getElementById('add-category-form');
        
        if (addCategoryBtn && categoryModal) {
            addCategoryBtn.addEventListener('click', () => {
                categoryModal.classList.remove('hidden');
            });
        }
        
        if (closeCategoryModal && categoryModal) {
            closeCategoryModal.addEventListener('click', () => {
                categoryModal.classList.add('hidden');
            });
        }
        
        if (cancelCategory && categoryModal) {
            cancelCategory.addEventListener('click', () => {
                categoryModal.classList.add('hidden');
            });
        }
        
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddCategory();
            });
        }
    }

    async handleAddCategory() {
        const nameInput = document.getElementById('category-name');
        const descInput = document.getElementById('category-description');
        
        if (!nameInput) return;
        
        const name = nameInput.value.trim();
        const description = descInput ? descInput.value.trim() : '';
        
        if (!name) {
            alert('Category name is required!');
            return;
        }
        
        try {
            await categoryService.createCategory({
                category_name: name,
                category_description: description || undefined
            });
            
            const categoryModal = document.getElementById('add-category-modal');
            if (categoryModal) {
                categoryModal.classList.add('hidden');
            }
            
            if (nameInput) nameInput.value = '';
            if (descInput) descInput.value = '';
            
            this.loadCategories();
            
            alert('Category created successfully!');
        } catch (error) {
            console.error('Error creating category:', error);
            alert(`Failed to create category: ${error.message}`);
        }
    }

    async handleDeleteCategory(categoryId) {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryService.deleteCategory(categoryId);
                alert('Category deleted successfully!');
                this.loadCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert(`Failed to delete category: ${error.message}`);
            }
        }
    }

    handleViewQuestions(quizId, quizTitle) {
        localStorage.setItem('selected_quiz_id', quizId);
        localStorage.setItem('selected_quiz_title', quizTitle);
        
        window.location.href = '/create-quiz';
    }

    async handleDeleteQuiz(quizId) {
        if (confirm('Are you sure you want to delete this quiz?')) {
            try {
                await quizService.deleteQuiz(quizId);
                alert('Quiz deleted successfully!');
                this.loadQuizzes();
            } catch (error) {
                console.error('Error deleting quiz:', error);
                alert(`Failed to delete quiz: ${error.message}`);
            }
        }
    }
}