import AbstractView from "./AbstractView.js";

export default class AdminDashboardView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Admin Dashboard");
    }

    async getHtml() {
        return `
            <section class="admin-page">
                <article class="admin-main">
                    ${this.getSidebar()}
                    <section class="admin-content" id="admin-content">
                        ${this.getDashboardContent()}
                    </section>
                </article>
            </section>
        `;
    }

    getSidebar() {
        return `
            <section class="admin-sidebar">
                <article class="admin-nav">
                    <ul>
                        <li><a href="/admin" class="admin-nav-link active" data-admin-page="dashboard">Dashboard</a></li>
                        <li><a href="/create-quiz" class="admin-nav-link" data-admin-page="create-quiz">Create Quiz</a></li>
                    </ul>
                </article>
            </section>
        `;
    }

    getDashboardContent() {
        return `
            <main id="admin-dashboard" class="admin-page-content active">
                <section class="page-header">
                    <h1>Admin Dashboard</h1>
                    <div class="header-actions">
                        <a href="/admin/create-quiz" class="btn btn-primary" data-admin-page="create-quiz">Create New Quiz</a>
                    </div>
                </section>

                ${this.getDashboardStats()}
                ${this.getDashboardGrid()}
            </main>
        `;
    }

    getDashboardStats() {
        return `
            <section class="dashboard-stats" aria-labelledby="dashboard-stats-heading">
                <h2 id="dashboard-stats-heading" class="visually-hidden">Quiz Platform Statistics</h2>
                
                <article class="stat-card" aria-labelledby="active-quizzes-stat">
                    <h1 class="stat-value" id="active-quizzes-stat" aria-label="Active quizzes">24</h1>
                    <p class="stat-label">Active Quizzes</p>
                    <p class="stat-change positive">
                        <span class="visually-hidden">Change: </span>
                        <span aria-hidden="true">↑</span> +3 this week
                    </p>
                </article>
                
                <article class="stat-card" aria-labelledby="registered-players-stat">
                    <h1 class="stat-value" id="registered-players-stat" aria-label="Registered players">156</h1>
                    <p class="stat-label">Registered Players</p>
                    <p class="stat-change positive">
                        <span class="visually-hidden">Change: </span>
                        <span aria-hidden="true">↑</span> +12 this week
                    </p>
                </article>
                
                <article class="stat-card" aria-labelledby="quizzes-completed-stat">
                    <h1 class="stat-value" id="quizzes-completed-stat" aria-label="Quizzes completed">1,245</h1>
                    <p class="stat-label">Quizzes Completed</p>
                    <p class="stat-change positive">
                        <span class="visually-hidden">Change: </span>
                        <span aria-hidden="true">↑</span> +89 this week
                    </p>
                </article>
                
                <article class="stat-card" aria-labelledby="questions-answered-stat">
                    <h1 class="stat-value" id="questions-answered-stat" aria-label="Questions answered">18,672</h1>
                    <p class="stat-label">Questions Answered</p>
                    <p class="stat-change positive">
                        <span class="visually-hidden">Change: </span>
                        <span aria-hidden="true">↑</span> +1,342 this week
                    </p>
                </article>
            </section>
        `;
    }

    getDashboardGrid() {
        return `
            <div class="dashboard-grid">
                <section class="dashboard-card">
                    <header class="card-header">
                        <h2>Recent Quizzes</h2>
                        <a href="#/admin/quizzes" class="btn btn-text" data-admin-page="quizzes">View All</a>
                    </header>
                    <section class="card-content">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Quiz Name</th>
                                    <th>Category</th>
                                    <th>Plays</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Premier League Legends</td>
                                    <td>Premier League</td>
                                    <td>98</td>
                                    <td>3 days ago</td>
                                    <td>
                                        <section class="table-actions">
                                            <a href="#/admin/edit-quiz/2" class="btn btn-icon" title="Edit">✏️</a>
                                            <button class="btn btn-icon delete-quiz" data-quiz-id="2" title="Delete">🗑️</button>
                                        </section>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Champions League Trivia</td>
                                    <td>Champions League</td>
                                    <td>76</td>
                                    <td>5 days ago</td>
                                    <td>
                                        <section class="table-actions">
                                            <a href="#/admin/edit-quiz/3" class="btn btn-icon" title="Edit">✏️</a>
                                            <button class="btn btn-icon delete-quiz" data-quiz-id="3" title="Delete">🗑️</button>
                                        </section>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </section>

                <section class="dashboard-card">
                    <header class="card-header">
                        <h2>Top Players</h2>
                        <a href="#/admin/players" class="btn btn-text" data-admin-page="players">View All</a>
                    </header>
                    <main class="card-content">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>ELO</th>
                                    <th>Quizzes</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="player-info">
                                            <span>FootballMaster</span>
                                        </div>
                                    </td>
                                    <td>1845</td>
                                    <td>42</td>
                                    <td>
                                        <section class="table-actions">
                                            <a href="#/admin/view-player/1" class="btn btn-icon" title="View">👁️</a>
                                            <button class="btn btn-icon delete-player" data-player-id="1" title="Delete">🗑️</button>
                                        </section>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="player-info">
                                            <span>SoccerQueen</span>
                                        </div>
                                    </td>
                                    <td>1788</td>
                                    <td>38</td>
                                    <td>
                                        <section class="table-actions">
                                            <a href="#/admin/view-player/2" class="btn btn-icon" title="View">👁️</a>
                                            <button class="btn btn-icon delete-player" data-player-id="2" title="Delete">🗑️</button>
                                        </section>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </main>
                </section>
            </div>
        `;
    }

    // After the view is mounted to the DOM
    async afterRender() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Setup delete buttons for quizzes
        document.querySelectorAll('.delete-quiz').forEach(button => {
            button.addEventListener('click', (e) => {
                const quizId = e.target.getAttribute('data-quiz-id');
                this.deleteQuiz(quizId);
            });
        });

        // Setup delete buttons for players
        document.querySelectorAll('.delete-player').forEach(button => {
            button.addEventListener('click', (e) => {
                const playerId = e.target.getAttribute('data-player-id');
                this.deletePlayer(playerId);
            });
        });

        // Navigation event listeners can be handled in a parent router class
    }

    deleteQuiz(quizId) {
        if (confirm(`Are you sure you want to delete quiz #${quizId}?`)) {
            // In a real app, this would make an API call to delete the quiz
            console.log(`Deleting quiz #${quizId}`);
            alert('Quiz deleted successfully');
            // Normally you'd refresh data here
        }
    }

    deletePlayer(playerId) {
        if (confirm(`Are you sure you want to delete player #${playerId}?`)) {
            // In a real app, this would make an API call to delete the player
            console.log(`Deleting player #${playerId}`);
            alert('Player deleted successfully');
            // Normally you'd refresh data here
        }
    }
}