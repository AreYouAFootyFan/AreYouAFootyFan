import AbstractView from "./AbstractView.js";
import "../components/quizCreation/QuizCreator.js";

export default class CreateQuizView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Quiz - Football Quiz");
    }

    async getHtml() {
        return document.createElement('quiz-creator');
    }

    async mount() {
    }
    
    cleanup() {
       
        if (!window.location.pathname.includes('/create-quiz') && 
            !window.location.pathname.includes('/admin')) {
            localStorage.removeItem('current_question_id');
            localStorage.removeItem('current_question_text');
        }
    }
}