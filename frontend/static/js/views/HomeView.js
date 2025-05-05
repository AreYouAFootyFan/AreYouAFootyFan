import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml(){
        return `
            <h1>Are You a Footy Fan?</h1>
        `;
    }
}