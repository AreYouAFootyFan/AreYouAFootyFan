class QuizCategoryFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.categories = [];
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
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
            </style>
            
            <select id="category-select">
                <option value="">All Categories</option>
            </select>
        `;
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
        
        const select = this.shadowRoot.querySelector('#category-select');
        if (!select) return;
        
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        value.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_id;
            option.textContent = category.category_name;
            select.appendChild(option);
        });
    }
}

customElements.define('quiz-category-filter', QuizCategoryFilter);

export default QuizCategoryFilter;