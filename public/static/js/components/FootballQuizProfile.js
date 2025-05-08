class FootballQuizProfile extends HTMLElement {
    constructor() {
      super();
      this.user = null;
      this.isEditMode = false;
      this.errorMessage = '';
    }
  
    connectedCallback() {
      this.addStyles();
      this.render();
      this.loadUserData();
    }
    
    disconnectedCallback() {
    }
    
    addStyles() {
      const styleId = 'football-quiz-profile-styles';
      
      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        
        styleElement.textContent = `
          football-quiz-profile {
            display: block;
            width: 100%;
            font-family: var(--font-sans, 'Inter', sans-serif);
            color: var(--gray-800);
            background-color: var(--gray-100);
            min-height: calc(100vh - 4rem);
          }
          
          football-quiz-profile .profile-page {
            max-width: 75rem;
            margin: 0 auto;
            padding: 2rem 1rem;
          }
          
          football-quiz-profile .page-header {
            margin-bottom: 2rem;
          }
          
          football-quiz-profile .page-header h1 {
            font-size: 2rem;
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 0.5rem;
          }
          
          football-quiz-profile .profile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 25rem), 1fr));
            gap: 2rem;
          }
          
          football-quiz-profile .profile-card {
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: var(--shadow);
            overflow: hidden;
          }
          
          football-quiz-profile .profile-header {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            border-bottom: 0.0625rem solid var(--gray-200);
          }
          
          football-quiz-profile .profile-info h2 {
            margin-bottom: 0.25rem;
            font-size: 1.5rem;
            color: var(--gray-900);
          }
          
          football-quiz-profile .profile-rank {
            color: var(--primary);
            font-weight: 500;
            margin-bottom: 0.25rem;
          }
          
          football-quiz-profile .profile-elo {
            color: var(--gray-600);
            font-size: 0.875rem;
          }
          
          football-quiz-profile .profile-form {
            margin-top: 1.5rem;
            padding: 0 1.5rem 1.5rem;
          }
          
          football-quiz-profile fieldset {
            border: none;
            padding: 0;
            margin: 0 0 1.5rem 0;
          }
          
          football-quiz-profile legend {
            font-weight: 600;
            margin-bottom: 1rem;
            font-size: 1.125rem;
            color: var(--gray-800);
          }
          
          football-quiz-profile label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--gray-700);
          }
          
          football-quiz-profile input {
            width: 100%;
            padding: 0.75rem;
            border: 0.0625rem solid var(--gray-300);
            border-radius: 0.25rem;
            font-size: 1rem;
          }
          
          football-quiz-profile input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 0.125rem var(--primary-light);
          }
          
          football-quiz-profile .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1.5rem;
          }
          
          football-quiz-profile .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 0.25rem;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          
          football-quiz-profile .btn-primary {
            background-color: var(--primary);
            color: white;
            border: none;
          }
          
          football-quiz-profile .btn-primary:hover {
            background-color: var(--primary-dark);
          }
          
          football-quiz-profile .error-message {
            color: var(--error);
            margin-top: 1rem;
            padding: 0.75rem;
            background-color: rgba(239, 68, 68, 0.1);
            border-radius: 0.25rem;
            font-size: 0.875rem;
          }
          
          football-quiz-profile .success-message {
            color: var(--success);
            margin-top: 1rem;
            padding: 0.75rem;
            background-color: rgba(34, 197, 94, 0.1);
            border-radius: 0.25rem;
            font-size: 0.875rem;
          }
          
          football-quiz-profile .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 10rem;
            font-size: 1.125rem;
            color: var(--gray-600);
            padding: 1.5rem;
          }
        `;
        
        document.head.appendChild(styleElement);
      }
    }
    
    render() {
      this.innerHTML = `
        <main class="profile-page">
          <header class="page-header">
            <h1>My Profile</h1>
          </header>
          
          <div class="profile-grid">
            <section class="profile-card" id="profile-content">
              <div class="loading-container">
                <p>Loading user data...</p>
              </div>
            </section>
          </div>
        </main>
      `;
    }
    
    async loadUserData() {
      try {
        const authService = window.authService;
        
        if (!authService || !authService.isAuthenticated()) {
          window.location.href = '/';
          return;
        }
        
        this.user = authService.getUser();
        
        if (!this.user) {
          this.showError('Failed to load user data.');
          return;
        }
        
        this.updateUserInfo();
      } catch (error) {
        console.error('Error loading user data:', error);
        this.showError('Failed to load user data: ' + (error.message || 'Unknown error'));
      }
    }
    
    updateUserInfo() {
      const profileContent = this.querySelector('#profile-content');
      if (!profileContent) return;
      
      const roleName = this.user.role_name || (this.user.role_id === 2 ? 'Manager' : 'Player');
      
      profileContent.innerHTML = `
        <header class="profile-header">
          <div class="profile-info">
            <h2 id="profile-username">${this.user.username || 'Username'}</h2>
            <p class="profile-rank">${roleName}</p>
            <p class="profile-elo">User ID: ${this.user.user_id}</p>
          </div>
        </header>
  
        <form id="profile-form" class="profile-form">
          <fieldset>
            <legend>Edit Profile</legend>
            <label for="edit-username">Username</label>
            <input type="text" id="edit-username" value="${this.user.username || ''}" required minlength="3" maxlength="32">
          </fieldset>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
          ${this.errorMessage ? `<div class="error-message">${this.errorMessage}</div>` : ''}
        </form>
      `;
      
      const profileForm = this.querySelector('#profile-form');
      const usernameElement = this.querySelector('#profile-username');
      
      if (profileForm) {
        profileForm.addEventListener('submit', this.handleSubmit.bind(this));
      }
    }
    
    async handleSubmit(event) {
      event.preventDefault();
      
      const usernameInput = this.querySelector('#edit-username');
      if (!usernameInput) return;
      
      const username = usernameInput.value.trim();
      
      if (username.length < 3 || username.length > 32) {
        this.showError('Username must be between 3 and 32 characters');
        return;
      }
      
      if (username === this.user.username) {
        return;
      }
      
      try {
        const authService = window.authService;
        
        if (!authService || !authService.setUsername) {
          this.showError('Authentication service not available');
          return;
        }
        
        this.user = await authService.setUsername(username);
        
        const usernameElement = this.querySelector('#profile-username');
        if (usernameElement) {
          usernameElement.textContent = this.user.username;
        }
        
        this.errorMessage = '';
        this.updateUserInfo();
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Username updated successfully!';
        
        const formActions = this.querySelector('.form-actions');
        if (formActions) {
          formActions.insertAdjacentElement('afterend', successMessage);
          
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
        
        if (window.updateHeaderUI && typeof window.updateHeaderUI === 'function') {
          window.updateHeaderUI();
        }
      } catch (error) {
        console.error('Error updating username:', error);
        this.showError('Failed to update username: ' + (error.message || 'Username may already be taken'));
      }
    }
    
    showError(message) {
      this.errorMessage = message;
      this.updateUserInfo();
    }
  }
  
  customElements.define('football-quiz-profile', FootballQuizProfile);
  
  export default FootballQuizProfile;