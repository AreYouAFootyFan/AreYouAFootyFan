class QuizCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.quiz = null;
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        if (!this.quiz) {
            this.shadowRoot.innerHTML = '<p>No quiz data</p>';
            return;
        }
        
        const totalSeconds = (this.quiz.question_count || 0) * 20;
        const timeEstimate = totalSeconds < 60 
            ? `${totalSeconds} sec` 
            : `${Math.ceil(totalSeconds / 60)} min`;
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                article {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s, box-shadow 0.2s;
                    height: 100%;
                }
                
                article:hover {
                    transform: translateY(-0.25rem);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
                }
                
                header {
                    padding: 1rem;
                    border-bottom: 0.0625rem solid var(--gray-200);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .category {
                    font-size: 0.875rem;
                    font-weight: 600;
                }
                
                .quiz-body {
                    padding: 1rem;
                    flex: 1;
                }
                
                h3 {
                    font-size: 1.25rem;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                
                .description {
                    color: var(--gray-600);
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                }
                
                .meta {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.75rem;
                    color: var(--gray-500);
                }
                
                footer {
                    padding: 1rem;
                    border-top: 0.0625rem solid var(--gray-200);
                    text-align: right;
                }
                
                button {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    background-color: var(--primary);
                    color: white;
                    border-radius: 0.25rem;
                    font-weight: 500;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                    font-size: 0.875rem;
                    font-family: inherit;
                }
                
                button:hover {
                    background-color: var(--primary-dark);
                }
            </style>
            
            <article>
                <header>
                    <p class="category">${this.quiz.category_name || 'Uncategorized'}</p>
                </header>
                
                <section class="quiz-body">
                    <h3>${this.quiz.quiz_title}</h3>
                    <p class="description">${this.quiz.quiz_description || 'No description available.'}</p>
                    
                    <section class="meta">
                        <p>${this.quiz.question_count || 0} questions</p>
                        <p>Est. time: ${timeEstimate}</p>
                    </section>
                </section>
                
                <footer>
                    <button class="start-btn">Start Quiz</button>
                </footer>
            </article>
        `;
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