class QuizCategoryFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._categories = [];
        this.styleSheet = new CSSStyleSheet();
    }

    async connectedCallback() {
        await this.render();
        this.setupEventListeners();
    }



    async render() {
        await this.getStyles();   
        const shadow = this.shadowRoot;
        shadow.adoptedStyleSheets = [this.styleSheet];
        shadow.innerHTML = '';
        const select = document.createElement('select');
        select.id = 'category-select';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'All Categories';
        select.appendChild(defaultOption);

        shadow.appendChild(select);

        this.updateCategoryOptions();
    }
    
    async getStyles(){
        const cssText = await fetch('./static/css/home/category.css').then(r => r.text());
        this.styleSheet.replaceSync(cssText);
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
