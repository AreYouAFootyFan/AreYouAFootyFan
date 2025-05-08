class AdminSidebar extends HTMLElement {
    static get observedAttributes() {
        return ['active-view'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active-view' && oldValue !== newValue) {
            this.updateActiveLink(newValue);
        }
    }
    
    render() {
        const activeView = this.getAttribute('active-view') || 'dashboard';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 16rem;
                }
                
                .admin-sidebar {
                    background-color: white;
                    border-right: 0.0625rem solid var(--gray-200);
                    padding: 1.5rem 0;
                    height: 100%;
                }
                
                .admin-nav ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                
                .admin-nav-link {
                    display: block;
                    width: 100%;
                    text-align: left;
                    padding: 0.75rem 1.5rem;
                    color: var(--gray-700);
                    font-weight: 500;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                
                .admin-nav-link:hover {
                    background-color: var(--gray-100);
                    color: var(--gray-900);
                }
                
                .admin-nav-link.active {
                    background-color: var(--gray-100);
                    color: var(--primary);
                    border-left: 0.1875rem solid var(--primary);
                }
            </style>
            
            <aside class="admin-sidebar">
                <nav class="admin-nav">
                    <ul>
                        <li><button data-view="dashboard" class="admin-nav-link ${activeView === 'dashboard' ? 'active' : ''}">Dashboard</button></li>
                        <li><button data-view="quizzes" class="admin-nav-link ${activeView === 'quizzes' ? 'active' : ''}">Quizzes</button></li>
                        <li><button data-view="categories" class="admin-nav-link ${activeView === 'categories' ? 'active' : ''}">Categories</button></li>
                        <li><a href="/create-quiz" class="admin-nav-link" data-link>Create Quiz</a></li>
                    </ul>
                </nav>
            </aside>
        `;
    }
    
    setupEventListeners() {
        const viewButtons = this.shadowRoot.querySelectorAll('[data-view]');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.view;
                this.dispatchEvent(new CustomEvent('change-view', {
                    detail: { view },
                    bubbles: true,
                    composed: true
                }));
            });
        });
        
        const links = this.shadowRoot.querySelectorAll('[data-link]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.pushState(null, null, link.getAttribute('href'));
                window.dispatchEvent(new PopStateEvent('popstate'));
            });
        });
    }
    
    updateActiveLink(activeView) {
        const links = this.shadowRoot.querySelectorAll('.admin-nav-link');
        links.forEach(link => {
            link.classList.remove('active');
            
            if (link.dataset.view === activeView) {
                link.classList.add('active');
            }
        });
    }
}

customElements.define('admin-sidebar', AdminSidebar);

export default AdminSidebar;