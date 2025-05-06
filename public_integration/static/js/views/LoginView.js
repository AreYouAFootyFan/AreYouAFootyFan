import AbstractView from "./AbstractView.js";
import authService from "../services/auth.service.js";

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
                            <span class="logo-icon" aria-hidden="true">⚽</span>
                        </figure>
                        <h1>Welcome to Football Quiz</h1>
                        <p>Sign in to continue to your account</p>
                    </header>

                    <section class="auth-methods">
                        <div id="google-signin-button"></div>

                        <div id="username-container" style="display: none;">
                            <h2>Set Your Username</h2>
                            <p>Please choose a unique username to continue:</p>
                            <form id="username-form">
                                <label for="username">
                                    Username
                                    <input 
                                        type="text" 
                                        id="username" 
                                        name="username" 
                                        placeholder="Choose a username" 
                                        minlength="3"
                                        maxlength="32"
                                        required
                                    />
                                </label>
                                <button type="submit" class="login-btn">Save Username</button>
                            </form>
                        </div>
                    </section>

                    <footer class="auth-footer">
                        <p>Test your football knowledge and compete with players worldwide</p>
                    </footer>
                </article>
            </main>
        `;
    }

    async mount() {
        this.setupGoogleSignIn();
        
        const usernameForm = document.getElementById('username-form');
        if (usernameForm) {
            usernameForm.addEventListener('submit', this.handleUsernameSubmit.bind(this));
        }
        
        const isAuthenticated = await authService.checkAuthentication();
        if (isAuthenticated) {
            if (authService.hasUsername()) {
                window.location.href = '/home';
            } else {
                this.showUsernameForm();
            }
        }
    }

    setupGoogleSignIn() {
        authService.initGoogleSignIn(this.handleGoogleLogin.bind(this));
        
        const googleSigninButton = document.getElementById('google-signin-button');
        if (googleSigninButton) {
            googleSigninButton.innerHTML = `
                <div id="g_id_onload"
                    data-client_id="${authService.googleClientId}"
                    data-callback="handleCredentialResponse">
                </div>
                <div class="g_id_signin" data-type="standard"></div>
            `;
            
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }

    async handleGoogleLogin(googleToken) {
        try {
            const result = await authService.loginWithGoogle(googleToken);
            
            if (result.requiresUsername) {
                this.showUsernameForm();
            } else {
                window.location.href = '/home';
            }
        } catch (error) {
            console.error('Google login error:', error);
            this.showLoginError('Login failed. Please try again.');
        }
    }

    async handleUsernameSubmit(event) {
        event.preventDefault();
        
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
        
        if (username.length < 3 || username.length > 32) {
            this.showLoginError('Username must be between 3 and 32 characters.');
            return;
        }
        
        try {
            await authService.setUsername(username);
            window.location.href = '/home';
        } catch (error) {
            console.error('Set username error:', error);
            this.showLoginError('Failed to set username. It might already be taken.');
        }
    }

    showUsernameForm() {
        const usernameContainer = document.getElementById('username-container');
        const googleSigninButton = document.getElementById('google-signin-button');
        
        if (usernameContainer && googleSigninButton) {
            usernameContainer.style.display = 'block';
            googleSigninButton.style.display = 'none';
        }
    }

    showLoginError(message) {
        let errorElement = document.getElementById('login-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'login-error';
            errorElement.className = 'error-message';
            
            const authContainer = document.querySelector('.auth-container');
            authContainer.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
}