import { StyleLoader } from "../../utils/cssLoader.js";

class AdminSidebar extends HTMLElement {
    static get observedAttributes() {
        return ['active-view'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.styleSheet = new CSSStyleSheet();
    }
    
    async connectedCallback() {
        await this.loadStyles();
        this.render();
        this.setupEventListeners();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active-view' && oldValue !== newValue) {
            this.updateActiveLink(newValue);
        }
    }
    
    async loadStyles() {
         await StyleLoader(
            this.shadowRoot,
            './static/css/styles.css',
            './static/css/admin/shared.css',
            './static/css/admin/adminSideBar.css'
        );
    }
    
    render() {
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }
        
        const activeView = this.getAttribute('active-view') || 'dashboard';
        
        const sidebar = document.createElement('aside');
        sidebar.className = 'admin-sidebar';
        
        const nav = document.createElement('nav');
        nav.className = 'admin-nav';
        
        const navList = document.createElement('ul');
        
        const dashboardItem = document.createElement('li');
        const dashboardButton = document.createElement('button');
        dashboardButton.dataset.view = 'dashboard';
        dashboardButton.className = `admin-nav-link ${activeView === 'dashboard' ? 'active' : ''}`;
        dashboardButton.textContent = 'Dashboard';
        dashboardItem.appendChild(dashboardButton);
        
        const quizzesItem = document.createElement('li');
        const quizzesButton = document.createElement('button');
        quizzesButton.dataset.view = 'quizzes';
        quizzesButton.className = `admin-nav-link ${activeView === 'quizzes' ? 'active' : ''}`;
        quizzesButton.textContent = 'Quizzes';
        quizzesItem.appendChild(quizzesButton);
        
        const categoriesItem = document.createElement('li');
        const categoriesButton = document.createElement('button');
        categoriesButton.dataset.view = 'categories';
        categoriesButton.className = `admin-nav-link ${activeView === 'categories' ? 'active' : ''}`;
        categoriesButton.textContent = 'Categories';
        categoriesItem.appendChild(categoriesButton);
        
        const createQuizItem = document.createElement('li');
        const createQuizLink = document.createElement('a');
        createQuizLink.href = '/create-quiz';
        createQuizLink.className = 'admin-nav-link';
        createQuizLink.dataset.link = '';
        createQuizLink.textContent = 'Create Quiz';
        createQuizItem.appendChild(createQuizLink);
        
        navList.appendChild(dashboardItem);
        navList.appendChild(quizzesItem);
        navList.appendChild(categoriesItem);
        navList.appendChild(createQuizItem);
        
        nav.appendChild(navList);
        sidebar.appendChild(nav);
        
        this.shadowRoot.appendChild(sidebar);
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