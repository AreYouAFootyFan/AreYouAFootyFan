import AbstractView from "./AbstractView.js";
import "../components/FootballQuizView.js";

export default class QuizView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Quiz - Football Quiz");
    }

    async getHtml() {
        return `
            <football-quiz-view></football-quiz-view>
        `;
    }

    async mount() {
        
    }
    
    cleanup() {
    }
}