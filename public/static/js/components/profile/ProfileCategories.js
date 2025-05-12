import { StyleLoader } from "../../utils/cssLoader.js";
class CategoryCard extends HTMLElement {
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
            './static/css/profile/categories.css'
        );
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }

        const title = this.getAttribute('title') || '';
        const fullWidth = this.hasAttribute('full-width');

        const card = document.createElement('article');
        card.className = 'categories-card';

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

        const topCategoriesJson = this.getAttribute('data-top-categories');
        let topCategories = [];

        try {
            topCategories = JSON.parse(topCategoriesJson || '[]');
        } catch (e) {
            console.error('Invalid JSON in data-top-categories');
        }

        const podium = document.createElement('section');
        podium.className = 'podium';
        podium.setAttribute('aria-label', 'Top 3 Categories');

        // Order: 2nd (left), 1st (center), 3rd (right)
        const positions = [1, 0, 2];
        positions.forEach((i, idx) => {
            const entry = topCategories[i];
            if (!entry) return;

            const figure = document.createElement('figure');
            figure.className = `podium-item position-${i + 1}`;

            const caption = document.createElement('figcaption');
            caption.className = 'category-name';
            caption.textContent = entry.name;
            figure.appendChild(caption);

            const rank = document.createElement('div');
            rank.className = 'position-rank';
            rank.textContent = `${i + 1}`;
            figure.appendChild(rank);

            const score = document.createElement('div');
            score.className = 'category-score';
            score.textContent = `Avg: ${entry.averageScore.toFixed(2)}%`;
            figure.appendChild(score);

            podium.appendChild(figure);
        });

        content.appendChild(podium);

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

customElements.define('top-categories', CategoryCard);

export default CategoryCard;