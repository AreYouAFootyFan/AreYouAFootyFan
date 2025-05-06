export default class {
    constructor() {

    }

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }

    setStyles(styleSheets) {
        const oldLinks = document.querySelectorAll("link[data-view-style]");
        oldLinks.forEach(link => link.remove());

        styleSheets.forEach(sheet => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = sheet;
            link.setAttribute("data-view-style", "true"); 
            document.head.appendChild(link);
        });
    }
}