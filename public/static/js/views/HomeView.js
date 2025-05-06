import AbstractView from "./AbstractView.js";
import { appState } from "../index.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml() {
        // Injecting a <script> tag directly inside the HTML to handle modal logic
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
                            <select id="category-filter" onchange="filterQuizzes(this.value)">
                                <option value="">All Categories</option>
                                ${appState.categories.map(category => `
                                    <option value="${category.id}">${category.name}</option>
                                `).join('')}
                            </select>
                        </nav>
                    </header>
                    
                    <main class="quiz-grid" id="quiz-grid">
                        ${this.renderQuizCards()}
                    </main>
                </article>
            </section>

            <section class="leaderboard-preview">
                <article class="container">
                    <header class="section-header">
                        <h2>Top Players</h2>
                        <nav>
                            <button class="btn btn-text" onclick="document.getElementById('leaderboard-modal').classList.add('show')">
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
                                ${this.renderLeaderboardRows()}
                            </tbody>
                        </table>
                    </figure>
                </article>
            </section>

            <!-- Full Leaderboard Modal -->
            <section class="leaderboard-modal" id="leaderboard-modal">
                <div class="modal-content">
                    <button class="modal-close" onclick="document.getElementById('leaderboard-modal').classList.remove('show')">
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
                            ${this.renderLeaderboardRows()}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
    }

     filterQuizzes(category) {
        const cards = document.querySelectorAll('.quiz-card');
        cards.forEach(card => {
            card.style.display = (!category || card.dataset.category === category) ? 'block' : 'none';
        });

        const modal = document.getElementById('leaderboard-modal');
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    renderQuizCards() {
        return appState.quizzes.map(quiz => {
            const category = appState.categories.find(cat => cat.id === quiz.category);
            const categoryDisplay = category ? category.name : quiz.category;

            return `
            <article class="quiz-card" data-category="${quiz.category}">
                <header class="quiz-card-header">
                    <p class="category"><strong>${categoryDisplay}</strong></p>
                </header>
                
                <section class="quiz-card-body">
                    <h3>${quiz.title}</h3>
                    <p>${quiz.description}</p>
                    
                    <footer class="quiz-meta">
                        <p><small>${quiz.questions} questions</small></p>
                        <p><small>${quiz.timeEstimate}</small></p>
                    </footer>
                </section>
                
                <nav class="quiz-card-footer">
                    <a href="/quiz" class="btn btn-primary" data-quiz-id="${quiz.id}">Start Quiz</a>
                </nav>
            </article>
            `;
        }).join('');
    }

    renderLeaderboardRows() {
        return appState.leaderboardData.map(player => `
            <tr>
                <td>${player.rank}</td>
                <td>${player.name}</td>
                <td>${player.elo}</td>
                <td>${player.quizzes}</td>
            </tr>
        `).join('');
    }
}
