import AbstractView from "./AbstractView.js";
import authService from "../services/auth.service.js";
import quizService from "../services/quiz.service.js";
import categoryService from "../services/category.service.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
        this.categories = [];
        this.quizzes = [];
    }

    async getHtml() {
        return `
            <section class="hero">
                <article class="container">
                    <header class="hero-content">
                        <h2>Test Your Football Knowledge</h2>
                        <p>Choose from a variety of quizzes and compete with players worldwide</p>
                    </header>
                </article>
            </section>

            <section class="quiz-selection">
                <article class="container">
                    <header class="section-header">
                        <h2>Available Quizzes</h2>
                        <nav class="filters" aria-label="Quiz filters">
                            <select id="category-filter">
                                <option value="">All Categories</option>
                                <!-- Categories will be loaded dynamically -->
                            </select>
                        </nav>
                    </header>
                    
                    <main class="quiz-grid" id="quiz-grid">
                        <!-- Quizzes will be loaded dynamically -->
                        <p class="loading-message">Loading quizzes...</p>
                    </main>
                </article>
            </section>

            <section class="leaderboard-preview">
                <article class="container">
                    <header class="section-header">
                        <h2>Top Players</h2>
                        <nav>
                            <button class="btn btn-text" id="view-leaderboard-btn">
                                View Full Leaderboard
                            </button>
                        </nav>
                    </header>
                    
                    <figure class="leaderboard-table-container">
                        <table class="leaderboard-table">
                            <thead>
                                <tr>
                                    <th scope="col">Rank</th>
                                    <th scope="col">Player</th>
                                    <th scope="col">ELO</th>
                                    <th scope="col">Quizzes</th>
                                </tr>
                            </thead>
                            <tbody id="leaderboard-body">
                                <!-- Leaderboard data will be added here -->
                                <tr><td colspan="4">Loading leaderboard data...</td></tr>
                            </tbody>
                        </table>
                    </figure>
                </article>
            </section>

            <!-- Full Leaderboard Modal -->
            <section class="leaderboard-modal" id="leaderboard-modal">
                <div class="modal-content">
                    <button class="modal-close" id="close-leaderboard-modal">
                        &times;
                    </button>
                    <h2>Full Leaderboard</h2>
                    <table class="leaderboard-table full">
                        <thead>
                            <tr>
                                <th scope="col">Rank</th>
                                <th scope="col">Player</th>
                                <th scope="col">ELO</th>
                                <th scope="col">Quizzes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Full leaderboard data will be added here -->
                            <tr><td colspan="4">Loading full leaderboard data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        `;
    }

    async mount() {
        const isAuthenticated = await authService.checkAuthentication();
        if (!isAuthenticated) {
            window.location.href = '/';
            return;
        }

        this.updateHeader();
        
        await this.loadCategories();
        await this.loadQuizzes();
        
        this.setupEventListeners();
        
        this.loadPlaceholderLeaderboard();
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
                    usernameDisplay.textContent = user.username || 'User';
                }
            }
            
            const adminLink = document.querySelector('.admin-link');
            if (adminLink) {
                if (authService.isQuizMaster()) {
                    adminLink.classList.remove('hidden');
                } else {
                    adminLink.classList.add('hidden');
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

    async loadCategories() {
        try {
            const categories = await categoryService.getAllCategories();
            this.categories = categories;
            
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter) {
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.category_id;
                    option.textContent = category.category_name;
                    categoryFilter.appendChild(option);
                });
                
                categoryFilter.addEventListener('change', () => {
                    this.filterQuizzes(categoryFilter.value);
                });
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async loadQuizzes() {
        try {
            const quizGrid = document.getElementById('quiz-grid');
            if (!quizGrid) return;
            
            const quizzes = await quizService.getValidQuizzes();
            this.quizzes = quizzes;
            
            if (quizzes.length === 0) {
                quizGrid.innerHTML = '<p>No quizzes available. Check back later!</p>';
                return;
            }
            
            quizGrid.innerHTML = quizzes.map(quiz => this.renderQuizCard(quiz)).join('');
            
            document.querySelectorAll('.quiz-card .btn-primary').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const quizId = button.getAttribute('data-quiz-id');
                    if (quizId) {
                        // Store selected quiz ID for quiz view
                        localStorage.setItem('selected_quiz_id', quizId);
                        window.location.href = '/quiz';
                    }
                });
            });
        } catch (error) {
            console.error('Error loading quizzes:', error);
            const quizGrid = document.getElementById('quiz-grid');
            if (quizGrid) {
                quizGrid.innerHTML = '<p>Error loading quizzes. Please try again later.</p>';
            }
        }
    }

    renderQuizCard(quiz) {
        const category = this.categories.find(cat => cat.category_id === quiz.category_id);
        const categoryName = category ? category.category_name : 'Uncategorized';
        
        return `
            <article class="quiz-card" data-category="${quiz.category_id}">
                <header class="quiz-card-header">
                    <p class="category"><strong>${categoryName}</strong></p>
                </header>
                
                <section class="quiz-card-body">
                    <h3>${quiz.quiz_title}</h3>
                    <p>${quiz.quiz_description || 'No description available.'}</p>
                    
                    <footer class="quiz-meta">
                        <p><small>${quiz.question_count || 0} questions</small></p>
                        <p><small>${this.estimateQuizTime(quiz.question_count || 0)}</small></p>
                    </footer>
                </section>
                
                <nav class="quiz-card-footer">
                    <a href="/quiz" class="btn btn-primary" data-quiz-id="${quiz.quiz_id}">Start Quiz</a>
                </nav>
            </article>
        `;
    }

    estimateQuizTime(questionCount) {
        const totalSeconds = questionCount * 20;
        
        if (totalSeconds < 60) {
            return `${totalSeconds} sec`;
        }
        
        const minutes = Math.ceil(totalSeconds / 60);
        return `${minutes} min`;
    }

    filterQuizzes(categoryId) {
        const quizCards = document.querySelectorAll('.quiz-card');
        
        quizCards.forEach(card => {
            if (!categoryId || card.dataset.category === categoryId) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    setupEventListeners() {
        const viewLeaderboardBtn = document.getElementById('view-leaderboard-modal');
        const leaderboardModal = document.getElementById('leaderboard-modal');
        const closeModalBtn = document.getElementById('close-leaderboard-modal');
        
        if (viewLeaderboardBtn) {
            viewLeaderboardBtn.addEventListener('click', () => {
                if (leaderboardModal) {
                    leaderboardModal.classList.add('show');
                }
            });
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                if (leaderboardModal) {
                    leaderboardModal.classList.remove('show');
                }
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === leaderboardModal) {
                leaderboardModal.classList.remove('show');
            }
        });
    }

    loadPlaceholderLeaderboard() {
        const leaderboardData = [
            { rank: 1, name: "FootballMaster", elo: 1845, quizzes: 42 },
            { rank: 2, name: "SoccerQueen", elo: 1788, quizzes: 38 },
            { rank: 3, name: "GoalMachine", elo: 1756, quizzes: 45 },
            { rank: 4, name: "FootballFan22", elo: 1702, quizzes: 36 },
            { rank: 5, name: "KickingKing", elo: 1689, quizzes: 31 }
        ];
        
        const leaderboardBody = document.getElementById('leaderboard-body');
        
        if (leaderboardBody) {
            leaderboardBody.innerHTML = leaderboardData.map(player => `
                <tr>
                    <td>${player.rank}</td>
                    <td>${player.name}</td>
                    <td>${player.elo}</td>
                    <td>${player.quizzes}</td>
                </tr>
            `).join('');
        }
        
        const fullLeaderboardBody = document.querySelector('.leaderboard-modal .leaderboard-table tbody');
        
        if (fullLeaderboardBody) {
            fullLeaderboardBody.innerHTML = leaderboardData.map(player => `
                <tr>
                    <td>${player.rank}</td>
                    <td>${player.name}</td>
                    <td>${player.elo}</td>
                    <td>${player.quizzes}</td>
                </tr>
            `).join('');
        }
    }
}