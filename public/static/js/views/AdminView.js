import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Admin");
    }

    async getHtml(){
        return `
            <h1>You are an Admin</h1>
        `;
    }
}