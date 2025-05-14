import { StyleLoader } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";
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
        clearDOM(this.shadowRoot);

        const title = this.getAttribute('title') || '';

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
        topCategories = JSON.parse(topCategoriesJson || '[]');


        const podium = document.createElement('section');
        podium.className = 'podium';
        podium.setAttribute('aria-label', 'Top 3 Categories');

        const positions = [1, 0, 2];
        positions.forEach((i, idx) => {
            const entry = topCategories[i];
            if (!entry) return;

            const figure = document.createElement('section');
            figure.className = `podium-item position-${i + 1}`;

            const caption = document.createElement('section');
            caption.className = 'category-name';
            caption.textContent = entry.name;
            figure.appendChild(caption);

            const rank = document.createElement('section');
            rank.className = 'position-rank';
            rank.textContent = `${i + 1}`;
            figure.appendChild(rank);

            const score = document.createElement('section');
            score.className = 'category-score';
            if(entry.role === 'Player'){
                score.textContent = `Avg: ${entry.averageScore.toFixed(2)}%`;
            }else{
                score.textContent = `Count: ${entry.count}`;
            }
            
            figure.appendChild(score);

            podium.appendChild(figure);
        });

        if(topCategories.length != 0){
            content.appendChild(podium);
        }else{
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Not enough data to determine your best 3 categories';
            content.appendChild(paragraph);
        }
        
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