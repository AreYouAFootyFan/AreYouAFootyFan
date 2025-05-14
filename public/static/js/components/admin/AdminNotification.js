import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";

class AdminNotification extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.message = "";
    this.type = "success";
    this.timeout = null;
    this.styleSheet = new CSSStyleSheet();
  }

  async connectedCallback() {
    await this.loadStyles();
    this.render();
  }

  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/admin/shared.css",
      "./static/css/admin/adminNotification.css"
    );
  }

  render() {
    clearDOM(this.shadowRoot);

    const toast = document.createElement("article");
    toast.className = `toast hidden ${this.type}`;
    toast.id = "toast";

    const message = document.createElement("p");
    message.id = "message";
    message.textContent = this.message;

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-toast";
    closeBtn.id = "close-btn";
    closeBtn.innerHTML = "&times;";

    toast.appendChild(message);
    toast.appendChild(closeBtn);

    this.shadowRoot.appendChild(toast);

    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector("#close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.hide();
      });
    }
  }

  show(message, type = "success") {
    this.message = message;
    this.type = type;

    this.render();

    const toast = this.shadowRoot.querySelector("#toast");
    if (toast) {
      toast.classList.remove("hidden");

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.hide();
      }, 3000);
    }
  }

  hide() {
    const toast = this.shadowRoot.querySelector("#toast");
    if (toast) {
      toast.classList.add("hidden");
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

customElements.define("admin-notification", AdminNotification);

export default AdminNotification;
