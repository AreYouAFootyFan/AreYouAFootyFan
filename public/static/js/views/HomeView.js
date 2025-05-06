import AbstractView from "./AbstractView.js";
import { appState } from "../index.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
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
                            <a href="#/leaderboard" class="btn btn-text" data-page="leaderboard">View Full Leaderboard</a>
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
        `;
    }

    renderQuizCards() {
        return appState.quizzes.map(quiz => {
            // Find the category display name for this quiz
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

    async afterRender() {
        document.getElementById('category-filter').addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            this.filterQuizzes(selectedCategory);
        });
    }

    filterQuizzes(category) {
        const quizCards = document.querySelectorAll('.quiz-card');
        
        quizCards.forEach(card => {
            if (!category || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}