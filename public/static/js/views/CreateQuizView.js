import AbstractView from "./AbstractView.js";
import "../components/quizCreation/QuizCreator.js";
import { Message, Storage } from "../enums/index.js";

export default class CreateQuizView extends AbstractView {
    constructor() {
        super();
        this.setTitle(Message.View.Title.CREATE_QUIZ);
    }

    async getHtml() {
        return document.createElement('quiz-creator');
    }

    async mount() {
    }
    
    cleanup() {
        if (!window.location.pathname.includes('/create-quiz') && 
            !window.location.pathname.includes('/admin')) {
            localStorage.removeItem(Storage.Key.Quiz.CURRENT_QUESTION_ID);
            localStorage.removeItem(Storage.Key.Quiz.CURRENT_QUESTION_TEXT);
        }
    }
}