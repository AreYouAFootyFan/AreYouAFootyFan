class QuizCategoryFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._categories = [];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const shadow = this.shadowRoot;
        shadow.innerHTML = ''; 

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
            }

            select {
                padding: 0.5rem 1rem;
                border: 0.0625rem solid var(--gray-300);
                border-radius: 0.25rem;
                background-color: white;
                font-size: 1rem;
                min-width: 12rem;
                font-family: inherit;
            }
        `;
        shadow.appendChild(style);
        const select = document.createElement('select');
        select.id = 'category-select';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'All Categories';
        select.appendChild(defaultOption);

        shadow.appendChild(select);

        this.updateCategoryOptions();
    }

    setupEventListeners() {
        const select = this.shadowRoot.querySelector('#category-select');
        if (select) {
            select.addEventListener('change', () => {
                this.dispatchEvent(new CustomEvent('filter-change', {
                    detail: {
                        value: select.value
                    }
                }));
            });
        }
    }

    set categories(value) {
        if (!Array.isArray(value)) return;
        this._categories = value;
        this.updateCategoryOptions();
    }

    get categories() {
        return this._categories;
    }

    updateCategoryOptions() {
        const select = this.shadowRoot.querySelector('#category-select');
        if (!select) return;

        while (select.options.length > 1) {
            select.remove(1);
        }

        this._categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_id;
            option.textContent = category.category_name;
            select.appendChild(option);
        });
    }
}

customElements.define('quiz-category-filter', QuizCategoryFilter);

export default QuizCategoryFilter;
