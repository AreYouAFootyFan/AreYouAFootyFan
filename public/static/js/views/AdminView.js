import AbstractView from "./AbstractView.js";
import LeaderboardComponent from "../components/Leaderboard.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Admin");
        this.setStyles(['./static/css/admin-styles.css']);
    }

    async onInit(){
        const leaderboard = document.querySelector("leader-board");

        leaderboard.setData([
        { name: "Alice", elo: 1820, quizzes: 35, accuracy: 92 },
        { name: "Bob", elo: 1750, quizzes: 42, accuracy: 89 },
        { name: "Charlie", elo: 1690, quizzes: 31, accuracy: 85 }
        ]);
    }

    async getHtml(){
        return `
                <div class="admin-page">
                <div class="admin-main">
                    <div class="admin-content" id="admin-content">
                    <!-- Admin content will be dynamically loaded here based on the selected admin page -->
                    <div id="admin-dashboard" class="admin-page-content active">
                        <div class="page-header">
                        <h1>Admin Dashboard</h1>
                        <div class="header-actions">
                            <a href="#/admin/create-quiz" class="btn btn-primary" data-admin-page="create-quiz">Create New Quiz</a>
                        </div>
                        </div>

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

                        <div class="dashboard-grid">
                        <section class="dashboard-card">
                            <div class="card-header">
                            <h2>Recent Quizzes</h2>
                            <a href="#/admin/quizzes" class="btn btn-text" data-admin-page="quizzes">View All</a>
                            </div>
                            <div class="card-content">
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
                                    <div class="table-actions">
                                        <a href="#/admin/edit-quiz/2" class="btn btn-icon" title="Edit">✏️</a>
                                        <button class="btn btn-icon" title="Delete">🗑️</button>
                                    </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Champions League Trivia</td>
                                    <td>Champions League</td>
                                    <td>76</td>
                                    <td>5 days ago</td>
                                    <td>
                                    <div class="table-actions">
                                        <a href="#/admin/edit-quiz/3" class="btn btn-icon" title="Edit">✏️</a>
                                        <button class="btn btn-icon" title="Delete">🗑️</button>
                                    </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                        </section>

                        <section class="dashboard-card">
                            <div class="card-header">
                            <h2>Top Players</h2>
                            <a href="#/admin/players" class="btn btn-text" data-admin-page="players">View All</a>
                            </div>
                            <div class="card-content">
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
                                    <div class="table-actions">
                                        <a href="#/admin/view-player/1" class="btn btn-icon" title="View">👁️</a>
                                        <button class="btn btn-icon" title="Delete">🗑️</button>
                                    </div>
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
                                    <div class="table-actions">
                                        <a href="#/admin/view-player/2" class="btn btn-icon" title="View">👁️</a>
                                        <button class="btn btn-icon" title="Delete">🗑️</button>
                                    </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                        </section>
                        </div>
                    </div>
                    </div>
                </div>
                    <leader-board></leader-board>
                </div>

        `;;
    }
}