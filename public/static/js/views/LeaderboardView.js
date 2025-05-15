import AbstractView from "./AbstractView.js";
import "../components/leaderboard/Leaderboard.js"

export default class LeaderBoardView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Leaderboard - Football Quiz");
    }

    async getHtml() {
       return document.createElement('leaderboard-data');
    }

    async mount() {
    }
}