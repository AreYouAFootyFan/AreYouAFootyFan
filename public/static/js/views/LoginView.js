import AbstractView from "./AbstractView.js";
import "../components/auth/LoginForm.js";
import { Message } from "../enums/index.js";

export default class LoginView extends AbstractView {
    constructor() {
        super();
        this.setTitle(Message.View.Title.LOGIN);
    }

    async getHtml() {
        return document.createElement('auth-login');
    }

    async mount() {
        const header = document.querySelector('football-quiz-header');
        const footer = document.querySelector('football-quiz-footer');
        
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';
    }
    
    cleanup() {
        const header = document.querySelector('football-quiz-header');
        const footer = document.querySelector('football-quiz-footer');
        
        if (header) header.style.display = '';
        if (footer) footer.style.display = '';
    }
}