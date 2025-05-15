import AbstractView from "./AbstractView.js";
import "../components/Homepage/QuizLeaderboard.js";
import "../components/GameModes/GameModes.js";
import { Message } from "../enums/index.js";

export default class GameModeView extends AbstractView {
    constructor() {
        super();
        this.setTitle(Message.View.Title.GAME_MODES);
    }

    async getHtml() {
        return document.createElement('game-modes');
    }

    async mount() {
    }
}