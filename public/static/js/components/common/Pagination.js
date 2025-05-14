import { StyleLoader } from "../../utils/cssLoader.js";

class Pagination extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['current-page', 'total-pages'];
    }

    async connectedCallback() {
        await this.loadStyles();
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    async loadStyles() {
        await StyleLoader(
            this.shadowRoot,
            "./static/css/common/pagination.css"
        );
    }

    render() {
        this.clearDOM();
        
        const currentPage = parseInt(this.getAttribute('current-page')) || 1;
        const totalPages = parseInt(this.getAttribute('total-pages')) || 1;

        const nav = document.createElement('nav');
        nav.setAttribute('aria-label', 'Pagination navigation');

        const list = document.createElement('ul');
        list.className = 'pagination-list';

        // Previous button
        const prevItem = document.createElement('li');
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-button';
        prevButton.textContent = 'Previous';
        prevButton.setAttribute('data-page', currentPage - 1);
        prevButton.setAttribute('aria-label', 'Previous page');
        if (currentPage <= 1) {
            prevButton.setAttribute('disabled', '');
        }
        prevItem.appendChild(prevButton);
        list.appendChild(prevItem);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-button';
            if (i === currentPage) {
                pageButton.classList.add('active');
                pageButton.setAttribute('aria-current', 'page');
            }
            pageButton.textContent = i.toString();
            pageButton.setAttribute('data-page', i);
            pageButton.setAttribute('aria-label', `Page ${i}`);
            pageItem.appendChild(pageButton);
            list.appendChild(pageItem);
        }

        // Next button
        const nextItem = document.createElement('li');
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-button';
        nextButton.textContent = 'Next';
        nextButton.setAttribute('data-page', currentPage + 1);
        nextButton.setAttribute('aria-label', 'Next page');
        if (currentPage >= totalPages) {
            nextButton.setAttribute('disabled', '');
        }
        nextItem.appendChild(nextButton);
        list.appendChild(nextItem);

        // Event handling
        list.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (button && !button.hasAttribute('disabled')) {
                const newPage = parseInt(button.getAttribute('data-page'));
                if (!isNaN(newPage)) {
                    this.dispatchEvent(new CustomEvent('page-change', {
                        detail: { page: newPage }
                    }));
                }
            }
        });

        nav.appendChild(list);
        this.shadowRoot.appendChild(nav);
    }

    clearDOM() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
    }
}

customElements.define('pagination-controls', Pagination); 