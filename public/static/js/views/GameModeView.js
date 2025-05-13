import AbstractView from "./AbstractView.js";

import "../components/GameModes/GameModes.js";

export default class GameModeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Game Modes - Football Quiz");
    }

    async getHtml() {
        return document.createElement('game-modes');
    }

    async mount() {
    }
}