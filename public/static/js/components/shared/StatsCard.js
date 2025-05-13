import { StyleLoader } from "../../utils/cssLoader.js";


class StatsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

    async connectedCallback() {
        await this.loadStyles();
        this.render();
    }

    async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            './static/css/shared/statsCard.css',
        );
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
