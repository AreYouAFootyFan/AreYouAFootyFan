class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.errorMessage = '';
        this.showUsernameForm = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.checkAuthentication();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .login-page {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    font-family: var(--font-sans, 'Inter', sans-serif);
                }
                
                .auth-main {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1;
                    background: linear-gradient(to right, #f8fbff, #e9f1ff);
                    padding: 2rem;
                }
                
                .auth-container {
                    background: #fff;
                    padding: 2.5rem 2rem;
                    max-width: 25rem;
                    width: 100%;
                    border-radius: 1rem;
                    box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.05);
                    text-align: center;
                }
                
                .auth-header {
                    margin-bottom: 2rem;
                }
                
                .logo-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    display: block;
                }
                
                h1 {
                    font-size: 1.8rem;
                    margin: 0.5rem 0;
                    color: #333;
                }
                
                p {
                    color: #666;
                    font-size: 0.95rem;
                    margin-bottom: 1.5rem;
                }
                
                #google-signin-button {
                    margin-bottom: 2rem;
                }
                
                #username-container {
                    display: ${this.showUsernameForm ? 'block' : 'none'};
                    text-align: left;
                }
                
                #username-container h2 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    text-align: center;
                }
                
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: #555;
                }
                
                input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 0.0625rem solid #ccc;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    margin-bottom: 1.5rem;
                    font-family: inherit;
                }
                
                .login-btn {
                    background-color: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    width: 100%;
                    transition: background-color 0.3s;
                    font-family: inherit;
                }
                
                .login-btn:hover {
                    background-color: var(--primary-dark);
                }
                
                .error-message {
                    color: var(--error);
                    margin-top: 1rem;
                    font-size: 0.875rem;
                    display: ${this.errorMessage ? 'block' : 'none'};
                }
                
                .auth-footer {
                    padding: 1.5rem;
                    text-align: center;
                    background-color: #1e293b;
                    color: #cbd5e1;
                }
                
                #google-login-link {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    background-color: white;
                    color: #333;
                    border: 0.0625rem solid #ddd;
                    border-radius: 0.5rem;
                    text-decoration: none;
                    font-weight: 500;
                    text-align: center;
                    transition: all 0.3s;
                    width: 100%;
                    box-sizing: border-box;
                }
                
                #google-login-link:hover {
                    background-color: #f8f8f8;
                    border-color: #ccc;
                }
                
                .google-icon {
                    margin-right: 0.5rem;
                    vertical-align: middle;
                }
            </style>
            
            <article class="login-page">
                <main class="auth-main">
                    <section class="auth-container">
                        <header class="auth-header">
                            <em class="logo-icon" aria-hidden="true">⚽</em>
                            <h1>Welcome to Footy Quiz</h1>
                            <p>Sign in to test your football knowledge</p>
                        </header>
            
                        <section id="google-signin-button">
                            <a href="#" id="google-login-link">
                                <em class="google-icon">G</em>
                                Sign in with Google
                            </a>
                        </section>
            
                        <form id="username-container">
                            <h2>Set Your Username</h2>
                            <p>Please choose a unique username to continue:</p>
                            <label for="username">Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                placeholder="Choose a username" 
                                minlength="3"
                                maxlength="32"
                                required
                            />
                            <button type="submit" class="login-btn">Save Username</button>
                        </form>
                        
                        <p id="login-error" class="error-message">${this.errorMessage}</p>
                    </section>
                </main>
                
                <footer class="auth-footer">
                    <p>&copy; 2025 Football Quiz Platform. All rights reserved.</p>
                </footer>
            </article>
        `;
    }
    
    setupEventListeners() {
        const googleLoginLink = this.shadowRoot.querySelector('#google-login-link');
        if (googleLoginLink) {
            googleLoginLink.href = window.authService ? window.authService.getAuthURL() : '#';
            googleLoginLink.addEventListener('click', (e) => {
                if (!window.authService) {
                    e.preventDefault();
                    this.showError('Authentication service not available');
                }
            });
        }
        
        const usernameForm = this.shadowRoot.querySelector('#username-container');
        if (usernameForm) {
            usernameForm.addEventListener('submit', this.handleUsernameSubmit.bind(this));
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const googleCode = urlParams.get('code');
        
        if (googleCode) {
            window.history.replaceState({}, document.title, window.location.pathname);
            this.handleGoogleLogin(googleCode);
        }
    }
    
    async checkAuthentication() {
        if (!window.authService) return;
        
        const isAuthenticated = await window.authService.checkAuthentication();
        if (isAuthenticated) {
            if (window.authService.hasUsername()) {
                window.location.href = '/home';
            } else {
                this.displayUsernameForm();
            }
        }
    }
        
    async handleGoogleLogin(googleCode) {
        try {
            const result = await window.authService.loginWithGoogle(googleCode);
            
            if (result.requiresUsername) {
                this.displayUsernameForm();
            } else {
                window.location.href = '/home';
            }
        } catch (error) {
            console.error('Google login error:', error);
            this.showError('Login failed. Please try again.');
        }
    }
    
    async handleUsernameSubmit(event) {
        event.preventDefault();
        
        const usernameInput = this.shadowRoot.querySelector('#username');
        const username = usernameInput.value.trim();
        
        if (username.length < 3 || username.length > 32) {
            this.showError('Username must be between 3 and 32 characters.');
            return;
        }
        
        try {
            await window.authService.setUsername(username);
            window.location.href = '/home';
        } catch (error) {
            console.error('Set username error:', error);
            this.showError('Failed to set username. It might already be taken.');
        }
    }
    
    displayUsernameForm() {
        this.showUsernameForm = true;
        this.render();
    }
    
    showError(message) {
        this.errorMessage = message;
        this.render();
    }
}

customElements.define('auth-login', LoginForm);

export default LoginForm;