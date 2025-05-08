class FootballQuizProfile extends HTMLElement {
  constructor() {
    super();
    this.user = null;
    this.isEditMode = false;
    this.errorMessage = '';
  }

  connectedCallback() {
    this.render();
    this.loadUserData();
  }
  
  disconnectedCallback() {
    // Cleanup if needed
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
    
    const roleName = this.user.role_name || (this.user.role_id === 2 ? 'Quiz Master' : 'Quiz Taker');
    
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