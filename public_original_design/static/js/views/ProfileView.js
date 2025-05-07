import AbstractView from "./AbstractView.js";

export default class ProfileView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Profile");
    }

    async getHtml(){
        return `
   <main class="profile-page">
  <section class="container">
    <header class="page-header">
      <h1>My Profile</h1>
    </header>

    <main class="profile-grid">
      <section class="profile-card">
        <header class="profile-header">
          <div class="profile-info">
            <h2 id="profile-username">Username</h2>
            <p class="profile-rank">Elite Tactician</p>
            <p class="profile-elo">ELO: 1580</p>
          </div>
        </header>

        <form id="profile-form" class="profile-form">
          <fieldset>
            <legend>Edit Profile</legend>
            <label for="edit-username">Username</label>
            <input type="text" id="edit-username" value="FootballFan22">
          </fieldset>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </section>

      <section class="stats-card">
        <h2>My Statistics</h2>
        <dl class="stats-grid">
          <div class="stat-box">
            <dt>Quizzes Taken</dt>
            <dd>24</dd>
          </div>
          <div class="stat-box">
            <dt>Questions Answered</dt>
            <dd>342</dd>
          </div>
          <div class="stat-box">
            <dt>Accuracy</dt>
            <dd>78%</dd>
          </div>
          <div class="stat-box">
            <dt>Best Streak</dt>
            <dd>14</dd>
          </div>
          <div class="stat-box">
            <dt>Avg. Time per Question</dt>
            <dd>18s</dd>
          </div>
          <div class="stat-box">
            <dt>Rank</dt>
            <dd>#42</dd>
          </div>
        </dl>
      </section>

      <section class="badges-card">
        <h2>My Badges</h2>
        <ul class="badges-grid">
          <li class="badge">
            <span class="badge-icon">🏆</span>
            <div class="badge-info">
              <h3 class="badge-name">Quiz Master</h3>
              <p class="badge-desc">Complete 10 quizzes with 80%+ accuracy</p>
            </div>
          </li>
          <li class="badge">
            <span class="badge-icon">⚡</span>
            <div class="badge-info">
              <h3 class="badge-name">Speed Demon</h3>
              <p class="badge-desc">Answer 50 questions with 10+ seconds remaining</p>
            </div>
          </li>
          <li class="badge">
            <span class="badge-icon">🔥</span>
            <div class="badge-info">
              <h3 class="badge-name">On Fire</h3>
              <p class="badge-desc">Achieve a streak of 10+ correct answers</p>
            </div>
          </li>
          <li class="badge">
            <span class="badge-icon">🧠</span>
            <div class="badge-info">
              <h3 class="badge-name">Tactical Genius</h3>
              <p class="badge-desc">Reach 1500 ELO points</p>
            </div>
          </li>
          <li class="badge locked">
            <span class="badge-icon">👑</span>
            <div class="badge-info">
              <h3 class="badge-name">Champion</h3>
              <p class="badge-desc">Reach the #1 spot on the leaderboard</p>
            </div>
          </li>
        </ul>
      </section>

      <section class="recent-activity">
        <h2>Recent Activity</h2>
        <ul class="activity-list">
          <li class="activity-item">
            <span class="activity-icon quiz-complete">✓</span>
            <div class="activity-details">
              <h3 class="activity-title">Completed "Premier League Legends" Quiz</h3>
              <p class="activity-meta">Score: 780 | Accuracy: 80% | +35 ELO</p>
              <time class="activity-time" datetime="2025-05-04">2 days ago</time>
            </div>
          </li>
          <li class="activity-item">
            <span class="activity-icon badge-earned">🏆</span>
            <div class="activity-details">
              <h3 class="activity-title">Earned "Quiz Master" Badge</h3>
              <p class="activity-meta">Complete 10 quizzes with 80%+ accuracy</p>
              <time class="activity-time" datetime="2025-05-04">2 days ago</time>
            </div>
          </li>
          <li class="activity-item">
            <span class="activity-icon elo-gain">↑</span>
            <div class="activity-details">
              <h3 class="activity-title">Reached Elite Tactician Rank</h3>
              <p class="activity-meta">ELO increased to 1580</p>
              <time class="activity-time" datetime="2025-04-29">1 week ago</time>
            </div>
          </li>
          <li class="activity-item">
            <span class="activity-icon quiz-complete">✓</span>
            <div class="activity-details">
              <h3 class="activity-title">Completed "World Cup History" Quiz</h3>
              <p class="activity-meta">Score: 650 | Accuracy: 75% | +28 ELO</p>
              <time class="activity-time" datetime="2025-04-29">1 week ago</time>
            </div>
          </li>
        </ul>
      </section>
    </main>
  </section>
</main>

        `;
    }
}