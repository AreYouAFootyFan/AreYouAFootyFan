import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml(){
        return `
            <h1>Are You a Footy Fan?</h1>
            <p>Test your football knowledge with our challenging quizzes!</p>
            
            <div class="home-actions">
                <a href="/quiz" class="btn start-quiz-btn" data-link>Start Quiz</a>
            </div>
        `;
    }
}