import AbstractView from "./AbstractView.js";
import "../components/quizTaking/QuizTaking.js";
import "../components/quizTaking/QuizResults.js";
import "../components/quizTaking/QuizQuestion.js"

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