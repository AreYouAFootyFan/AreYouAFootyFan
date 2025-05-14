import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";
class BadgesCard extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'action', 'action-view', 'full-width'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.styleSheet = new CSSStyleSheet();
    }
    
    async connectedCallback() {
        await this.loadStyles();
        this.render();
        this.updateFullWidthStyle();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.isConnected) {
            this.render();
        }
    }
    
    async loadStyles() {
          await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/profile/badges.css'
        );
    }
    
    render() {
        clearDOM(this.shadowRoot);

        const title = this.getAttribute('title') || '';
        const fullWidth = this.hasAttribute('full-width');
        const badgesJson = this.getAttribute('badges-earned');
        let badges = [];

        const card = document.createElement('article');
        card.className = 'badges-card';

        if (title) {
            const header = document.createElement('header');
            header.className = 'card-header';

            const heading = document.createElement('h2');
            heading.textContent = title;
            header.appendChild(heading);

            card.appendChild(header);
        }

        const content = document.createElement('section');
        content.className = 'card-content';

        const grid = document.createElement('section');
        grid.className = 'badges-grid';
        grid.setAttribute('aria-label', 'Badges Earned');

        badges = JSON.parse(badgesJson || '[]');

        badges.forEach(badge => {
            const figure = document.createElement('figure');
            figure.className = 'badge';

            const img = document.createElement('img');
            img.src = badge.src;
            img.alt = badge.alt || 'Badge';
            img.loading = 'lazy';
            figure.appendChild(img);

            const caption = document.createElement('figcaption');
            caption.textContent = badge.alt || '';
            figure.appendChild(caption);

            grid.appendChild(figure);
        });

        content.appendChild(grid);

        const slot = document.createElement('slot');
        slot.name = 'content';
        content.appendChild(slot);

        card.appendChild(content);
        this.shadowRoot.appendChild(card);
    }

    updateFullWidthStyle() {
        const isFullWidth = this.hasAttribute('full-width');
        
        if (isFullWidth) {
            this.classList.add('full-width');
        } else {
            this.classList.remove('full-width');
        }
    }
}

customElements.define('badges-earned', BadgesCard);

export default BadgesCard;