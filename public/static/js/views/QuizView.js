import AbstractView from "./AbstractView.js";
import "../components/QuizTaking/QuizTaking.js";
import "../components/QuizTaking/QuizResults.js";
import "../components/QuizTaking/QuizQuestion.js"

export default class QuizView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Quiz - Football Quiz");
    }

    async getHtml() {
       return document.createElement('quiz-taking');
    }

    async mount() {
    }
    
    cleanup() {
    }
}