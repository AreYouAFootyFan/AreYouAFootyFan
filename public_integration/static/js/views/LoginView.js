import AbstractView from "./AbstractView.js";

export default class LoginView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login");
    }

    async getHtml() {
        return `
            <main class="login-view">
                <article class="auth-container">
                    <header class="auth-header">
                        <figure>
                            <img src="/assets/logo.svg" alt="App Logo" class="logo" />
                        </figure>
                        <h1>Welcome</h1>
                        <p>Sign in to continue to your account</p>
                    </header>

                    <section class="auth-methods">
                        <button class="social-auth-btn google-auth-btn" id="google-login">
                            <img src="/assets/google-logo.svg" alt="Google" class="social-icon" />
                            Continue with Google
                        </button>

                        <p class="divider"><span>or</span></p>

                        <form id="email-login-form">
                            <fieldset>
                                <legend class="visually-hidden">Email Login</legend>
                                
                                <label for="email">
                                    Email address
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        autocomplete="email" 
                                        placeholder="you@example.com" 
                                        required
                                    />
                                </label>

                                <label for="password">
                                    Password
                                    <span class="password-input-container">
                                        <input 
                                            type="password" 
                                            id="password" 
                                            name="password" 
                                            autocomplete="current-password" 
                                            placeholder="Enter your password" 
                                            required
                                        />
                                        <button 
                                            type="button" 
                                            class="password-toggle" 
                                            aria-label="Toggle password visibility"
                                        >
                                            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                    </span>
                                </label>

                                <section class="form-options">
                                    <label class="remember-me">
                                        <input type="checkbox" id="remember" name="remember" />
                                        Remember me
                                    </label>
                                    <a href="#" class="forgot-password">Forgot password?</a>
                                </section>

                                <button type="submit" class="login-btn">Sign in</button>
                            </fieldset>
                        </form>
                    </section>

                    <footer class="auth-footer">
                        <p>Don't have an account? <a href="#/signup" class="signup-link">Sign up</a></p>
                    </footer>
                </article>

               
            </main>
        `;
    }

    async afterRender() {
        // Password visibility toggle
        const passwordToggle = document.querySelector('.password-toggle');
        const passwordInput = document.getElementById('password');
        
        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type');
                passwordInput.setAttribute('type', type === 'password' ? 'text' : 'password');
            });
        }

        // Modal handling
        const googleModal = document.getElementById('google-auth-modal');
        const googleLoginBtn = document.getElementById('google-login');
        const closeModalBtn = document.querySelector('.close-modal');
        
        if (googleModal && googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => {
                googleModal.showModal();
            });
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                googleModal.close();
            });
        }

        // Account selection
        const accountOptions = document.querySelectorAll('.google-account-option');
        accountOptions.forEach(option => {
            option.addEventListener('click', () => {
                accountOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Form submission
        const emailLoginForm = document.getElementById('email-login-form');
        if (emailLoginForm) {
            emailLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showLoginSuccess();
            });
        }
    }

    showLoginSuccess() {
        const notification = document.createElement('aside');
        notification.className = 'success-notification';
        notification.role = "status";
        notification.innerHTML = `
            <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Successfully logged in!</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}