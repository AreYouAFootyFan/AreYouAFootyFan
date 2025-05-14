import AbstractView from "./AbstractView.js";
import "../components/PlayQuizzes/PlayQuizzes.js";
import "../components/Homepage/QuizHome.js";
import "../components/Homepage/QuizCard.js";
import "../components/Homepage/QuizLeaderboard.js";
import "../components/Homepage/QuizCategoryFilter.js";
import { Message } from "../enums/index.js";

export default class PlayQuizView extends AbstractView {
    constructor(params) {
        super();
        this.setTitle(Message.View.Title.PLAY_QUIZ);
        
        this.modeId = this.extractQueryParameter('modeId') || params?.id || null;
    }
    

    extractQueryParameter(paramName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    }
    
    async getHtml() {
        const quizComponent = document.createElement('play-quizzes');
        
        if (this.modeId) {
            quizComponent.setAttribute('mode-id', this.modeId);
        }
        
        return quizComponent;
    }
    
    async mount() {
    }
}