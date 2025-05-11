import { StyleLoaderStatic } from "../../utils/cssLoader.js";
import { clearDOM } from "../../utils/domHelpers.js";
class QuizCard extends HTMLElement {
    static {
        this.styleSheet = null;
        this.stylesLoaded = this.loadStylesOnce();
    }

    static async loadStylesOnce() {
        try {
            if (!this.styleSheet) {
                this.styleSheet = await StyleLoaderStatic(
                    './static/css/styles.css',
                    './static/css/home/quizcard.css'
                )
            }
            return true;
        } catch (error) {
            console.error('Error loading QuizCard styles:', error);
            return false;
        }
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.quiz = null;
    }
    
    async connectedCallback() {
        await QuizCard.stylesLoaded;
        this.shadowRoot.adoptedStyleSheets = QuizCard.styleSheet
        await this.render();
        this.setupEventListeners();
    }
    
    async render() {
        const shadow = this.shadowRoot;
        clearDOM(shadow)

        if (!this.quiz) {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'No quiz data';
            shadow.appendChild(paragraph);
            return;
        }
        
        const totalSeconds = (this.quiz.question_count || 0) * 20;
        const timeEstimate = totalSeconds < 60 
            ? `${totalSeconds} sec` 
            : `${Math.ceil(totalSeconds / 60)} min`;
        
        const article = document.createElement('article');

        // Header
        const header = document.createElement('header');
        const categoryP = document.createElement('p');
        categoryP.className = 'category';
        categoryP.textContent = this.quiz.category_name || 'Uncategorized';
        header.appendChild(categoryP);
        article.appendChild(header);
        
        // Quiz Body
        const quizBody = document.createElement('section');
        quizBody.className = 'quiz-body';
        
        const title = document.createElement('h3');
        title.textContent = this.quiz.quiz_title;
        quizBody.appendChild(title);
        
        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = this.quiz.quiz_description || 'No description available.';
        quizBody.appendChild(description);
        
        // Meta section
        const metaSection = document.createElement('section');
        metaSection.className = 'meta';
        
        const questionCount = document.createElement('p');
        questionCount.textContent = `${this.quiz.question_count || 0} questions`;
        metaSection.appendChild(questionCount);
        
        const timeP = document.createElement('p');
        timeP.textContent = `Est. time: ${timeEstimate}`;
        metaSection.appendChild(timeP);
        
        quizBody.appendChild(metaSection);
        article.appendChild(quizBody);
        
        // Footer
        const footer = document.createElement('footer');
        const startBtn = document.createElement('button');
        startBtn.className = 'start-btn';
        startBtn.textContent = 'Start Quiz';
        footer.appendChild(startBtn);
        
        article.appendChild(footer);
        
        shadow.appendChild(article);
    }
    

    setupEventListeners() {
        const startButton = this.shadowRoot.querySelector('.start-btn');
        if (startButton) {
            startButton.addEventListener('click', (e) => {
                this.dispatchEvent(new CustomEvent('quiz-start', {
                    detail: {
                        quizId: this.quiz?.quiz_id
                    }
                }));
            });
        }
    }
    
    set quiz(value) {
        this._quiz = value;
        this.render();
    }
    
    get quiz() {
        return this._quiz;
    }
}

customElements.define('quiz-card', QuizCard);

export default QuizCard;