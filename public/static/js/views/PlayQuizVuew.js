import AbstractView from "./AbstractView.js";

import "../components/PlayQuizzes/PlayQuizzes.js";

export default class PlayQuizView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Play Quiz");
    }

    async getHtml() {
        return document.createElement('play-quizzes');
    }

    async mount() {
    }
}