import { StyleLoader } from "../../utils/cssLoader.js";

class AdminModal extends HTMLElement {
  static get observedAttributes() {
    return ["title"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isVisible = false;
    this.styleSheet = new CSSStyleSheet();
  }

  async connectedCallback() {
    await this.loadStyles();
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(_name, _oldValue, _newValue) {
    if (this.isConnected) {
      this.render();
    }
  }

  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/admin/shared.css",
      "./static/css/admin/adminModal.css"
    );
  }

  render() {
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }

    const title = this.getAttribute("title") || "Modal";

    const modal = document.createElement("section");
    modal.className = "modal";
    modal.id = "modal";

    const modalContent = document.createElement("article");
    modalContent.className = "modal-content";

    const modalHeader = document.createElement("header");
    modalHeader.className = "modal-header";

    const modalTitle = document.createElement("h2");
    modalTitle.textContent = title;

    const closeButton = document.createElement("button");
    closeButton.className = "close-modal";
    closeButton.id = "close-btn";
    closeButton.innerHTML = "&times;";

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement("section");
    modalBody.className = "modal-body";

    const contentSlot = document.createElement("slot");
    contentSlot.name = "content";
    modalBody.appendChild(contentSlot);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);

    this.shadowRoot.appendChild(modal);
  }

  setupEventListeners() {
    const modal = this.shadowRoot.querySelector("#modal");
    const closeBtn = this.shadowRoot.querySelector("#close-btn");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.hide();
      });
    }

    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          this.hide();
        }
      });
    }
  }

  show() {
    const modal = this.shadowRoot.querySelector("#modal");
    if (modal) {
      modal.classList.add("visible");
      this.isVisible = true;
    }
  }

  hide() {
    const modal = this.shadowRoot.querySelector("#modal");
    if (modal) {
      modal.classList.remove("visible");
      this.isVisible = false;
    }
  }
}

customElements.define("admin-modal", AdminModal);

export default AdminModal;
