import { StyleLoaderStatic } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";
class AdminCard extends HTMLElement {
  static {
    this.styleSheet = null;
    this.stylesLoaded = this.loadStylesOnce();
  }

  static get observedAttributes() {
    return ["title", "action", "action-view", "full-width"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await AdminCard.stylesLoaded;
    this.shadowRoot.adoptedStyleSheets = AdminCard.styleSheet;
    this.render();
    this.setupEventListeners();
    this.updateFullWidthStyle();
  }

  static async loadStylesOnce() {
    try {
      if (!this.styleSheet) {
        this.styleSheet = await StyleLoaderStatic(
          "./static/css/styles.css",
          "./static/css/admin/shared.css",
          "./static/css/admin/adminCard.css"
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected) {
      this.render();
    }
  }

  render() {
    clearDOM(this.shadowRoot)

    const title = this.getAttribute("title") || "";
    const action = this.getAttribute("action") || "";
    const actionView = this.getAttribute("action-view") || "";

    const card = document.createElement("article");
    card.className = "admin-card";

    if (title) {
      const header = document.createElement("header");
      header.className = "card-header";

      const heading = document.createElement("h2");
      heading.textContent = title;
      header.appendChild(heading);

      if (action) {
        const actionBtn = document.createElement("button");
        actionBtn.className = "text-btn";
        actionBtn.dataset.view = actionView;
        actionBtn.textContent = action;
        header.appendChild(actionBtn);
      }

      card.appendChild(header);
    }

    const content = document.createElement("section");
    content.className = "card-content";

    const slot = document.createElement("slot");
    slot.name = "content";
    content.appendChild(slot);

    card.appendChild(content);

    this.shadowRoot.appendChild(card);
  }

  updateFullWidthStyle() {
    const isFullWidth = this.hasAttribute("full-width");

    if (isFullWidth) {
      this.classList.add("full-width");
    } else {
      this.classList.remove("full-width");
    }
  }

  setupEventListeners() {
    const actionButton = this.shadowRoot.querySelector(".text-btn");
    if (actionButton) {
      actionButton.addEventListener("click", () => {
        const view = actionButton.dataset.view;
        this.dispatchEvent(
          new CustomEvent("action-click", {
            detail: { view },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }
}

customElements.define('admin-card', AdminCard);

export default AdminCard;