import AbstractView from "./AbstractView.js";
import "../components/QuizTaking/QuizTaking.js";
import "../components/QuizTaking/QuizResults.js";
import "../components/QuizTaking/QuizQuestion.js";
import { Message } from "../enums/index.js";

export default class QuizView extends AbstractView {
    constructor() {
        super();
        this.setTitle(Message.View.Title.QUIZ);
    }

    async getHtml() {
       return document.createElement('quiz-taking');
    }

    async mount() {
    }
    
    cleanup() {
    }
}