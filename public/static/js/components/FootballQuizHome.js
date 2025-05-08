class FootballQuizHome extends HTMLElement {
    constructor() {
      super();
      this.quizzes = [];
      this.categories = [];
      this.leaderboardData = [];
      this.selectedCategory = '';
    }
  
    connectedCallback() {
      this.addStyles();
      this.render();
      this.loadData();
    }
  
    addStyles() {
      const styleId = 'football-quiz-home-styles';
      
      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        
        styleElement.textContent = `
          football-quiz-home {
            display: block;
            width: 100%;
          }
          
          .fq-hero {
            background-color: #3b82f6;
            color: white;
            text-align: center;
            padding: 4rem 1rem;
            margin-bottom: 2rem;
          }
          
          .fq-hero-content {
            max-width: 75rem;
            margin: 0 auto;
          }
          
          .fq-hero-title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
            color: #ffffff
          }
          
          .fq-hero-subtitle {
            font-size: 1.25rem;
            opacity: 0.9;
            max-width: 36rem;
            margin: 0 auto;
          }
          
          .fq-categories {
            max-width: 75rem;
            margin: 0 auto 2rem auto;
            padding: 0 1rem;
          }
          
          .fq-section-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }
          
          .fq-category-filter {
            margin-bottom: 2rem;
          }
          
          .fq-select {
            padding: 0.5rem 1rem;
            border: 0.0625rem solid #cbd5e1;
            border-radius: 0.25rem;
            background-color: white;
            font-size: 1rem;
            min-width: 12rem;
          }
          
          .fq-quiz-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          @supports (width: min(18rem, 100%)) {
            .fq-quiz-grid {
              grid-template-columns: repeat(auto-fill, minmax(min(18rem, 100%), 1fr));
            }
          }
          
          .fq-quiz-card {
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          
          .fq-quiz-card:hover {
            transform: translateY(-0.25rem);
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
          }
          
          .fq-quiz-header {
            padding: 1rem;
            border-bottom: 0.0625rem solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .fq-quiz-category {
            font-size: 0.875rem;
            font-weight: 600;
          }
          
          .fq-easy {
            background-color: #d1fae5;
            color: #065f46;
          }
          
          .fq-medium {
            background-color: #fef3c7;
            color: #92400e;
          }
          
          .fq-hard {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          
          .fq-quiz-body {
            padding: 1rem;
            flex: 1;
          }
          
          .fq-quiz-title {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
            font-weight: 600;
          }
          
          .fq-quiz-description {
            color: #4b5563;
            margin-bottom: 1rem;
            font-size: 0.875rem;
          }
          
          .fq-quiz-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.75rem;
            color: #6b7280;
          }
          
          .fq-quiz-footer {
            padding: 1rem;
            border-top: 0.0625rem solid #e2e8f0;
            text-align: right;
          }
          
          .fq-quiz-btn {
            display: inline-block;
            padding: 0.5rem 1rem;
            background-color: #3b82f6;
            color: white;
            border-radius: 0.25rem;
            font-weight: 500;
            text-decoration: none;
            border: none;
            cursor: pointer;
            font-size: 0.875rem;
          }
          
          .fq-quiz-btn:hover {
            background-color: #2563eb;
          }
          
          .fq-leaderboard {
            background-color: white;
            padding: 3rem 1rem;
            margin-top: 2rem;
          }
          
          .fq-leaderboard-inner {
            max-width: 75rem;
            margin: 0 auto;
          }
          
          .fq-section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .fq-view-all {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.875rem;
          }
          
          .fq-view-all:hover {
            text-decoration: underline;
          }
          
          .fq-table-container {
            overflow-x: auto;
            margin-bottom: 1rem;
          }
          
          .fq-leaderboard-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .fq-leaderboard-table th,
          .fq-leaderboard-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 0.0625rem solid #e2e8f0;
          }
          
          .fq-leaderboard-table th {
            font-weight: 600;
            color: #4b5563;
            background-color: #f8fafc;
          }
          
          .fq-rank {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            background-color: #e5e7eb;
            font-weight: 600;
            font-size: 0.75rem;
            margin-right: 0.5rem;
          }
          
          .fq-rank-1 {
            background-color: #fcd34d;
            color: #92400e;
          }
          
          .fq-rank-2 {
            background-color: #cbd5e1;
            color: #334155;
          }
          
          .fq-rank-3 {
            background-color: #d8b4fe;
            color: #6b21a8;
          }
          
          .fq-empty-state {
            text-align: center;
            padding: 3rem 1rem;
            background-color: #f8fafc;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
          }
          
          .fq-empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #94a3b8;
          }
          
          .fq-empty-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #334155;
          }
          
          .fq-empty-message {
            color: #64748b;
            max-width: 24rem;
            margin: 0 auto;
          }
          
          .fq-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
          }
          
          .fq-modal.fq-visible {
            opacity: 1;
            visibility: visible;
          }
          
          .fq-modal-content {
            background-color: white;
            border-radius: 0.5rem;
            width: 100%;
            max-width: 28rem;
            padding: 1.5rem;
            position: relative;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
          }
          
          .fq-modal-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1e293b;
          }
          
          .fq-modal-message {
            margin-bottom: 1.5rem;
            color: #475569;
          }
          
          .fq-modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
          }
          
          .fq-btn-secondary {
            padding: 0.5rem 1rem;
            background-color: white;
            color: #475569;
            border: 0.0625rem solid #cbd5e1;
            border-radius: 0.25rem;
            font-weight: 500;
            cursor: pointer;
          }
          
          .fq-btn-secondary:hover {
            background-color: #f8fafc;
          }
  
          .fq-full-leaderboard-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
          }
          
          .fq-full-leaderboard-modal.fq-visible {
            opacity: 1;
            visibility: visible;
          }
          
          .fq-full-leaderboard-content {
            background-color: white;
            border-radius: 0.5rem;
            width: 100%;
            max-width: 40rem;
            padding: 1.5rem;
            position: relative;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .fq-close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            font-size: 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            color: #64748b;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
          
          .fq-close-btn:hover {
            background-color: #f1f5f9;
            color: #0f172a;
          }
          .fq-notification {
            width: 100%;
            max-width: 73rem;
            justify-self: center;
            background-color: #fff7ed;
            border-left: 0.25rem solid #f97316;
            padding: 1rem;
            margin-bottom: 2rem;
            border-radius: 0 0.25rem 0.25rem 0;
          }
          
          .fq-notification-title {
            color: #9a3412;
            font-weight: 600;
            margin-bottom: 0.25rem;
          }
          
          .fq-notification-message {
            color: #7c2d12;
            font-size: 0.875rem;
          }
          
          .fq-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            color: #64748b;
          }
          
          .fq-loading-spinner {
            display: inline-block;
            width: 1.5rem;
            height: 1.5rem;
            border: 0.125rem solid currentColor;
            border-right-color: transparent;
            border-radius: 50%;
            margin-right: 0.5rem;
            animation: fq-spin 0.75s linear infinite;
          }
          
          @keyframes fq-spin {
            to { transform: rotate(360deg); }
          }
          
          .fq-hidden {
            display: none !important;
          }
        `;
        
        document.head.appendChild(styleElement);
      }
    }
    
    render() {
      this.innerHTML = `
        <main class="fq-home-page">
          <section class="fq-hero">
            <div class="fq-hero-content">
              <h2 class="fq-hero-title">Test Your Football Knowledge</h2>
              <p class="fq-hero-subtitle">Choose from a variety of quizzes and compete with players worldwide</p>
            </div>
          </section>
          
          <div class="fq-notification fq-hidden" id="quiz-maker-note">
            <h3 class="fq-notification-title">Manager Account</h3>
            <p class="fq-notification-message">As a <strong>Manager</strong>, you can create and manage quizzes but cannot participate in them. Use a <strong>Player</strong> account to play quizzes.</p>
          </div>
          
          <section class="fq-categories">
            <div class="fq-section-header">
              <h2 class="fq-section-title">Available Quizzes</h2>
              <div class="fq-category-filter">
                <select id="category-filter" class="fq-select">
                  <option value="">All Categories</option>
                </select>
              </div>
            </div>
            
            <div class="fq-quiz-grid" id="quiz-grid">
              <p>Loading quizzes...</p>
            </div>
          </section>
          
          <section class="fq-leaderboard">
            <div class="fq-leaderboard-inner">
              <div class="fq-section-header">
                <h2 class="fq-section-title">Top Players</h2>
                <button class="fq-view-all" id="view-full-leaderboard">View Full Leaderboard</button>
              </div>
              
              <div class="fq-table-container">
                <table class="fq-leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Points</th>
                      <th>Quizzes</th>
                    </tr>
                  </thead>
                  <tbody id="leaderboard-body">
                    <tr>
                      <td colspan="4" class="fq-loading">
                        <div class="fq-loading-spinner"></div>
                        <span>Loading leaderboard data...</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          
          <div class="fq-modal" id="quiz-master-modal">
            <div class="fq-modal-content">
              <h3 class="fq-modal-title">Manager Account</h3>
              <p class="fq-modal-message">
                As a <strong>Manager</strong>, you can create and manage quizzes but cannot participate in them.
                <br>
                <br>
                Would you like to go to the <strong>Manager</strong> dashboard instead?
              </p>
              <div class="fq-modal-actions">
                <button class="fq-btn-secondary" id="close-modal-btn">Cancel</button>
                <a href="/admin" class="fq-quiz-btn" data-link>Go to Admin</a>
              </div>
            </div>
          </div>
          
          <div class="fq-full-leaderboard-modal" id="full-leaderboard-modal">
            <div class="fq-full-leaderboard-content">
              <button class="fq-close-btn" id="close-leaderboard-btn">&times;</button>
              <h2 class="fq-section-title">Football Quiz Leaderboard</h2>
              
              <div class="fq-table-container">
                <table class="fq-leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Points</th>
                      <th>Quizzes</th>
                    </tr>
                  </thead>
                  <tbody id="full-leaderboard-body">
                    <tr>
                      <td colspan="4" class="fq-loading">
                        <div class="fq-loading-spinner"></div>
                        <span>Loading full leaderboard data...</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      `;
      
      this.setupEventListeners();
      this.checkUserRole();
    }
    
    setupEventListeners() {
      const categoryFilter = this.querySelector('#category-filter');
      if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
          this.selectedCategory = categoryFilter.value;
          this.renderQuizzes();
        });
      }
      
      const viewLeaderboardBtn = this.querySelector('#view-full-leaderboard');
      if (viewLeaderboardBtn) {
        viewLeaderboardBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showFullLeaderboard();
        });
      }
      
      const closeLeaderboardBtn = this.querySelector('#close-leaderboard-btn');
      if (closeLeaderboardBtn) {
        closeLeaderboardBtn.addEventListener('click', () => {
          this.hideFullLeaderboard();
        });
      }
      
      const closeModalBtn = this.querySelector('#close-modal-btn');
      if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
          this.hideQuizMasterModal();
        });
      }
      
      const modal = this.querySelector('#quiz-master-modal');
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.hideQuizMasterModal();
          }
        });
      }
      
      const leaderboardModal = this.querySelector('#full-leaderboard-modal');
      if (leaderboardModal) {
        leaderboardModal.addEventListener('click', (e) => {
          if (e.target === leaderboardModal) {
            this.hideFullLeaderboard();
          }
        });
      }
    }
    
    async loadData() {
      try {
        const dataPromises = [];
        
        if (window.categoryService) {
          dataPromises.push(
            window.categoryService.getAllCategories()
              .then(categories => {
                this.categories = categories;
                this.populateCategoryFilter();
              })
              .catch(error => {
                console.error('Error loading categories:', error);
                this.loadDummyCategories();
              })
          );
        } else {
          this.loadDummyCategories();
        }
        
        if (window.quizService) {
          dataPromises.push(
            window.quizService.getValidQuizzes()
              .then(quizzes => {
                this.quizzes = quizzes;
                this.renderQuizzes();
              })
              .catch(error => {
                console.error('Error loading quizzes:', error);
                this.loadDummyQuizzes();
              })
          );
        } else {
          this.loadDummyQuizzes();
        }
        
        if (window.leaderboardService) {
          dataPromises.push(
            window.leaderboardService.getTopPlayers(5)
              .then(leaderboard => {
                this.leaderboardData = leaderboard;
                this.renderLeaderboard();
              })
              .catch(error => {
                console.error('Error loading leaderboard:', error);
                this.loadDummyLeaderboard();
              })
          );
        } else {
          this.loadDummyLeaderboard();
        }
        
        await Promise.all(dataPromises);
        
      } catch (error) {
        console.error('Error loading data:', error);
        this.loadDummyCategories();
        this.loadDummyQuizzes();
        this.loadDummyLeaderboard();
      }
    }
    
    
    populateCategoryFilter() {
      const categoryFilter = this.querySelector('#category-filter');
      if (!categoryFilter) return;
      
      while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
      }
      
      this.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.category_id;
        option.textContent = category.category_name;
        categoryFilter.appendChild(option);
      });
    }
    
    renderQuizzes() {
      const quizGrid = this.querySelector('#quiz-grid');
      if (!quizGrid) return;
      
      const filteredQuizzes = this.selectedCategory 
        ? this.quizzes.filter(quiz => quiz.category_id.toString() === this.selectedCategory)
        : this.quizzes;
      
      if (filteredQuizzes.length === 0) {
        quizGrid.innerHTML = `
          <div class="fq-empty-state">
            <div class="fq-empty-icon">🔍</div>
            <h3 class="fq-empty-title">No quizzes found</h3>
            <p class="fq-empty-message">Try selecting a different category or check back later for new quizzes.</p>
          </div>
        `;
        return;
      }
      
      quizGrid.innerHTML = filteredQuizzes.map(quiz => this.renderQuizCard(quiz)).join('');
      
      const startButtons = quizGrid.querySelectorAll('.fq-quiz-btn');
      startButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const quizId = button.getAttribute('data-quiz-id');
          this.handleStartQuiz(e, quizId);
        });
      });
    }
    
    renderQuizCard(quiz) {
      const totalSeconds = (quiz.question_count || 0) * 20;
      const timeEstimate = totalSeconds < 60 
        ? `${totalSeconds} sec` 
        : `${Math.ceil(totalSeconds / 60)} min`;
      
      return `
        <article class="fq-quiz-card">
          <header class="fq-quiz-header">
            <div class="fq-quiz-category">${quiz.category_name || 'Uncategorized'}</div>
          </header>
          
          <div class="fq-quiz-body">
            <h3 class="fq-quiz-title">${quiz.quiz_title}</h3>
            <p class="fq-quiz-description">${quiz.quiz_description || 'No description available.'}</p>
            
            <div class="fq-quiz-meta">
              <div>${quiz.question_count || 0} questions</div>
              <div>Est. time: ${timeEstimate}</div>
            </div>
          </div>
          
          <footer class="fq-quiz-footer">
            <button class="fq-quiz-btn" data-quiz-id="${quiz.quiz_id}">Start Quiz</button>
          </footer>
        </article>
      `;
    }
    
    renderLeaderboard() {
      const leaderboardBody = this.querySelector('#leaderboard-body');
      if (!leaderboardBody) return;
      
      leaderboardBody.innerHTML = this.leaderboardData.map(player => `
        <tr>
          <td>
            <span class="fq-rank fq-rank-${player.rank <= 3 ? player.rank : ''}">${player.rank}</span>
          </td>
          <td>${player.username}</td>
          <td>${player.total_points}</td>
          <td>${player.quizzes_taken || 0}</td>
        </tr>
      `).join('');
    }
    
    async showFullLeaderboard() {
      const leaderboardModal = this.querySelector('#full-leaderboard-modal');
      const fullLeaderboardBody = this.querySelector('#full-leaderboard-body');
      
      if (!leaderboardModal || !fullLeaderboardBody) return;
      
      leaderboardModal.classList.add('fq-visible');
      
      try {
        if (window.leaderboardService) {
          const fullLeaderboard = await window.leaderboardService.getLeaderboard();
          
          fullLeaderboardBody.innerHTML = fullLeaderboard.map(player => `
            <tr>
              <td>
                <span class="fq-rank fq-rank-${player.rank <= 3 ? player.rank : ''}">${player.rank}</span>
              </td>
              <td>${player.username}</td>
              <td>${player.total_points}</td>
              <td>${player.quizzes_taken || 0}</td>
            </tr>
          `).join('');
        } else {
          fullLeaderboardBody.innerHTML = this.leaderboardData.map(player => `
            <tr>
              <td>
                <span class="fq-rank fq-rank-${player.rank <= 3 ? player.rank : ''}">${player.rank}</span>
              </td>
              <td>${player.username}</td>
              <td>${player.total_points}</td>
              <td>${player.quizzes_taken || 0}</td>
            </tr>
          `).join('');
        }
      } catch (error) {
        console.error('Error loading full leaderboard:', error);
        fullLeaderboardBody.innerHTML = `
          <tr>
            <td colspan="4">
              <div class="fq-empty-state">
                <h3 class="fq-empty-title">Error loading leaderboard</h3>
                <p class="fq-empty-message">There was a problem loading the full leaderboard data. Please try again later.</p>
              </div>
            </td>
          </tr>
        `;
      }
    }
    
    hideFullLeaderboard() {
      const leaderboardModal = this.querySelector('#full-leaderboard-modal');
      if (leaderboardModal) {
        leaderboardModal.classList.remove('fq-visible');
      }
    }
    
    checkUserRole() {
      const authService = window.authService;
      if (!authService) return;
      
      const isQuizMaster = authService.isQuizMaster && authService.isQuizMaster();
      
      const notification = this.querySelector('#quiz-maker-note');
      if (notification && isQuizMaster) {
        notification.classList.remove('fq-hidden');
      }
    }
    
    handleStartQuiz(event, quizId) {
      event.preventDefault();
      
      const authService = window.authService;
      if (!authService) return;
      
      const isQuizMaster = authService.isQuizMaster && authService.isQuizMaster();
      
      if (isQuizMaster) {
        this.showQuizMasterModal();
      } else {
        localStorage.setItem('selected_quiz_id', quizId);
        window.location.href = '/quiz';
      }
    }
    
    showQuizMasterModal() {
      const modal = this.querySelector('#quiz-master-modal');
      if (modal) {
        modal.classList.add('fq-visible');
      }
    }
    
    hideQuizMasterModal() {
      const modal = this.querySelector('#quiz-master-modal');
      if (modal) {
        modal.classList.remove('fq-visible');
      }
    }
    
    disconnectedCallback() {
      const styleElement = document.getElementById('football-quiz-home-styles');
      if (styleElement) {
        styleElement.remove();
      }
    }
  }
  
  customElements.define('football-quiz-home', FootballQuizHome);
  
  export default FootballQuizHome;