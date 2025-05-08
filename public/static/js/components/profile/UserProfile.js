class UserProfile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.user = null;
        this.errorMessage = '';
    }

    connectedCallback() {
        this.render();
        this.loadUserData();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: var(--font-sans);
                    color: var(--gray-800);
                    background-color: var(--gray-100);
                    min-height: calc(100vh - 4rem);
                }
                
                .profile-page {
                    max-width: var(--container-max-width);
                    margin: 0 auto;
                    padding: 2rem 1rem;
                }
                
                .page-header {
                    margin-bottom: 2rem;
                }
                
                h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--gray-900);
                    margin-bottom: 0.5rem;
                }
                
                .profile-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(100%, 25rem), 1fr));
                    gap: 2rem;
                }
                
                .profile-card {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: var(--shadow);
                    overflow: hidden;
                }
                
                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 10rem;
                    font-size: 1.125rem;
                    color: var(--gray-600);
                    padding: 1.5rem;
                }
                
                .loading-spinner {
                    display: inline-block;
                    width: 1.5rem;
                    height: 1.5rem;
                    border: 0.125rem solid currentColor;
                    border-right-color: transparent;
                    border-radius: 50%;
                    margin-right: 0.5rem;
                    animation: spin 0.75s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
            
            <main class="profile-page">
                <header class="page-header">
                    <h1>My Profile</h1>
                </header>
                
                <section class="profile-grid">
                    <article class="profile-card" id="profile-content">
                        <section class="loading-container">
                            <em class="loading-spinner" aria-hidden="true"></em>
                            <p>Loading user data...</p>
                        </section>
                    </article>
                </section>
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
        const profileContent = this.shadowRoot.querySelector('#profile-content');
        if (!profileContent) return;
        
        const roleName = this.user.role_name || (this.user.role_id === 2 ? 'Quiz Master' : 'Quiz Taker');
        
        profileContent.innerHTML = `
            <style>
                .profile-header {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    border-bottom: 0.0625rem solid var(--gray-200);
                }
                
                .profile-info h2 {
                    margin-bottom: 0.25rem;
                    font-size: 1.5rem;
                    color: var(--gray-900);
                }
                
                .profile-rank {
                    color: var(--primary);
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                }
                
                .profile-id {
                    color: var(--gray-600);
                    font-size: 0.875rem;
                }
                
                .profile-form {
                    margin-top: 1.5rem;
                    padding: 0 1.5rem 1.5rem;
                }
                
                fieldset {
                    border: none;
                    padding: 0;
                    margin: 0 0 1.5rem 0;
                }
                
                legend {
                    font-weight: 600;
                    margin-bottom: 1rem;
                    font-size: 1.125rem;
                    color: var(--gray-800);
                }
                
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: var(--gray-700);
                }
                
                input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 0.0625rem solid var(--gray-300);
                    border-radius: 0.25rem;
                    font-size: 1rem;
                    font-family: inherit;
                }
                
                input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 0.125rem var(--primary-light);
                }
                
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                
                .btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.25rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    border: none;
                    font-family: inherit;
                    font-size: 1rem;
                }
                
                .btn-primary {
                    background-color: var(--primary);
                    color: white;
                }
                
                .btn-primary:hover {
                    background-color: var(--primary-dark);
                }
                
                .message {
                    margin-top: 1rem;
                    padding: 0.75rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                }
                
                .error-message {
                    color: var(--error);
                    background-color: rgba(239, 68, 68, 0.1);
                }
                
                .success-message {
                    color: var(--success);
                    background-color: rgba(34, 197, 94, 0.1);
                }
            </style>
            
            <header class="profile-header">
                <section class="profile-info">
                    <h2 id="profile-username">${this.user.username || 'Username'}</h2>
                    <p class="profile-rank">${roleName}</p>
                    <p class="profile-id">User ID: ${this.user.user_id}</p>
                </section>
            </header>
    
            <form id="profile-form" class="profile-form">
                <fieldset>
                    <legend>Edit Profile</legend>
                    <label for="edit-username">Username</label>
                    <input 
                        type="text" 
                        id="edit-username" 
                        value="${this.user.username || ''}" 
                        required 
                        minlength="3" 
                        maxlength="32"
                    >
                </fieldset>
                <footer class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </footer>
                ${this.errorMessage ? `<p class="message error-message">${this.errorMessage}</p>` : ''}
            </form>
        `;
        
        const profileForm = this.shadowRoot.querySelector('#profile-form');
        
        if (profileForm) {
            profileForm.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        const usernameInput = this.shadowRoot.querySelector('#edit-username');
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
            
            const usernameElement = this.shadowRoot.querySelector('#profile-username');
            if (usernameElement) {
                usernameElement.textContent = this.user.username;
            }
            
            this.errorMessage = '';
            this.updateUserInfo();
            
            this.showSuccessMessage('Username updated successfully!');
            
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
    
    showSuccessMessage(message) {
        const formActions = this.shadowRoot.querySelector('.form-actions');
        if (!formActions) return;
        
        const existingMessage = this.shadowRoot.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const successMessage = document.createElement('p');
        successMessage.className = 'message success-message';
        successMessage.textContent = message;
        
        formActions.insertAdjacentElement('afterend', successMessage);
        
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 3000);
    }
}

customElements.define('user-profile', UserProfile);

export default UserProfile;