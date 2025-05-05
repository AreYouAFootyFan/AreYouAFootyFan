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
      <div class="container">
        <div class="hero-content">
          <h2>Test Your Football Knowledge</h2>
          <p>Choose from a variety of quizzes and compete with players worldwide</p>
        </div>
      </div>
    </section>

    <section class="quiz-selection">
      <div class="container">
        <header class="section-header">
          <h2>Available Quizzes</h2>
          <div class="filters">
            <select id="category-filter">
              <option value="">All Categories</option>
              ${appState.categories.map(category => `
                <option value="${category.id}">${category.name}</option>
              `).join('')}
            </select>
          </div>
        </header>
        
        <div class="quiz-grid" id="quiz-grid">
          ${this.renderQuizCards()}
        </div>
      </div>
    </section>

    <section class="leaderboard-preview">
      <div class="container">
        <header class="section-header">
          <h2>Top Players</h2>
          <a href="#/leaderboard" class="btn btn-text" data-page="leaderboard">View Full Leaderboard</a>
        </header>
        
        <div class="leaderboard-table-container">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>ELO</th>
                <th>Quizzes</th>
              </tr>
            </thead>
            <tbody id="leaderboard-body">
              ${this.renderLeaderboardRows()}
            </tbody>
          </table>
        </div>
      </div>
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
                <div class="quiz-card-header">
                    <span class="category">${categoryDisplay}</span>
                </div>
                <div class="quiz-card-body">
                    <h3>${quiz.title}</h3>
                    <p>${quiz.description}</p>
                    <div class="quiz-meta">
                        <span>${quiz.questions} questions</span>
                        <span>${quiz.timeEstimate}</span>
                    </div>
                </div>
                <div class="quiz-card-footer">
                    <a href="#/quiz/${quiz.id}" class="btn btn-primary" data-quiz-id="${quiz.id}">Start Quiz</a>
                </div>
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