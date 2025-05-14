import { StyleLoaderStatic } from "../../utils/cssLoader.js";


class StatsCard extends HTMLElement {
  
  static {
      this.styleSheet = null;
      this.stylesLoaded = this.loadStylesOnce();
    }
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static async loadStylesOnce() {
    try {
        if (!this.styleSheet) {
            this.styleSheet = await StyleLoaderStatic('./static/css/shared/statsCard.css')
        }
        return true;
    } catch (error) {
        return false;
    }
  }

  async connectedCallback() {
      this.shadowRoot.adoptedStyleSheets = StatsCard.styleSheet
      this.render();
  }

  render() {
    const card = document.createElement('article');
    card.className = 'stat-card';

    const valueEl = document.createElement('h2');
    valueEl.className = 'stat-value';
    valueEl.textContent = this.getAttribute('value') || '';

    const labelEl = document.createElement('p');
    labelEl.className = 'stat-label';
    labelEl.textContent = this.getAttribute('label') || '';
    
    card.appendChild(valueEl);
    card.appendChild(labelEl);
    this.shadowRoot.appendChild(card);
  }
}

customElements.define('stats-card', StatsCard);
