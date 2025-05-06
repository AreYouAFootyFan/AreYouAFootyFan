import AbstractView from "./AbstractView.js";

export default class CreateQuizView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Quiz");
        this.questionCounter = 1;
    }

    async getHtml() {
        return `
            <div class="admin-page">
                <div class="admin-main">
                    ${this.getSidebar()}
                    <div class="admin-content" id="admin-content">
                        ${this.getCreateQuizContent()}
                    </div>
                </div>
            </div>
        `;
    }

    getSidebar() {
        return `
            <section class="admin-sidebar">
                <nav class="admin-nav">
                    <ul>
                        <li><a href="/admin" class="admin-nav-link" data-admin-page="dashboard">Dashboard</a></li>
                        <li><a href="/admin/create-quiz" class="admin-nav-link active" data-admin-page="create-quiz">Create Quiz</a></li>
                    </ul>
                </nav>
            </section>
        `;
    }

    getCreateQuizContent() {
        return `
            <div class="page-header">
                <h1>Create New Quiz</h1>
            </div>

            <form id="create-quiz-form" class="create-quiz-form">
                ${this.getQuizDetailsSection()}
                ${this.getQuestionsSection()}

                <div class="form-actions">
                    <button type="button" class="btn btn-outline" id="cancel-quiz">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Quiz</button>
                </div>
            </form>
        `;
    }

    getQuizDetailsSection() {
        return `
            <section class="form-section">
                <h2>Quiz Details</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="quiz-title">Quiz Title</label>
                        <input type="text" id="quiz-title" required placeholder="e.g. World Cup History">
                    </div>
                    <div class="form-group">
                        <label for="quiz-category">Category</label>
                        <select id="quiz-category" required>
                            <option value="">Select a category</option>
                            <option value="world-cup">World Cup</option>
                            <option value="premier-league">Premier League</option>
                            <option value="champions-league">Champions League</option>
                            <option value="players">Famous Players</option>
                            <option value="tactics">Tactics & Formations</option>
                            <option value="history">Football History</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="time-limit">Time Limit (seconds per question)</label>
                        <input type="number" id="time-limit" min="10" max="60" value="30">
                    </div>
                </div>
                <div class="form-group">
                    <label for="quiz-description">Description</label>
                    <textarea id="quiz-description" rows="3" placeholder="Describe what this quiz is about"></textarea>
                </div>
            </section>
        `;
    }

    getQuestionsSection() {
        return `
            <section class="form-section">
                <div class="section-header">
                    <h2>Questions</h2>
                    <button type="button" id="add-question" class="btn btn-outline">Add Question</button>
                </div>

                <div id="questions-container">
                    ${this.createQuestionCard(1)}
                </div>
            </section>
        `;
    }

    createQuestionCard(id) {
        return `
            <div class="question-card" data-question-id="${id}">
                <div class="question-header">
                    <h3>Question ${id}</h3>
                    <button type="button" class="btn btn-icon remove-question" title="Remove Question" data-question-id="${id}">🗑️</button>
                </div>
                <div class="form-group">
                    <label for="question-${id}-text">Question Text</label>
                    <textarea id="question-${id}-text" class="question-text" rows="2" required placeholder="Enter your question"></textarea>
                </div>
                <div class="options-container">
                    ${this.createOptionRows(id)}
                </div>
            </div>
        `;
    }

    createOptionRows(questionId) {
        const options = ['A', 'B', 'C', 'D'];
        let html = '';
        
        for (let i = 0; i < 4; i++) {
            html += `
                <div class="option-row">
                    <div class="option-radio">
                        <input type="radio" name="correct-${questionId}" id="correct-${questionId}-${i}" value="${i}" ${i === 0 ? 'checked' : ''}>
                    </div>
                    <div class="form-group">
                        <label for="option-${questionId}-${i}">Option ${options[i]}</label>
                        <input type="text" id="option-${questionId}-${i}" class="option-text" required placeholder="Option text">
                    </div>
                </div>
            `;
        }
        
        return html;
    }

    // After the view is mounted to the DOM
    async afterRender() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add question button
        const addQuestionBtn = document.getElementById('add-question');
        if (addQuestionBtn) {
            addQuestionBtn.addEventListener('click', () => this.addNewQuestion());
        }

        // Form submission
        const quizForm = document.getElementById('create-quiz-form');
        if (quizForm) {
            quizForm.addEventListener('submit', (e) => this.handleQuizSubmit(e));
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancel-quiz');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.navigateTo('/admin'));
        }

        // Set up event delegation for dynamic elements
        document.addEventListener('click', (e) => {
            // Remove question buttons
            if (e.target.classList.contains('remove-question')) {
                this.removeQuestion(e.target.getAttribute('data-question-id'));
            }
        });
    }

    navigateTo(url) {
        window.location.hash = url;
    }

    addNewQuestion() {
        this.questionCounter++;
        const questionsContainer = document.getElementById('questions-container');
        
        if (questionsContainer) {
            const newQuestionHtml = this.createQuestionCard(this.questionCounter);
            
            // Create a temporary container to hold our HTML string
            const temp = document.createElement('div');
            temp.innerHTML = newQuestionHtml;
            
            // Append the question card to the container
            questionsContainer.appendChild(temp.firstElementChild);
        }
    }

    removeQuestion(questionId) {
        const questionCard = document.querySelector(`.question-card[data-question-id="${questionId}"]`);
        if (questionCard && document.querySelectorAll('.question-card').length > 1) {
            questionCard.remove();
            this.renumberQuestions();
        } else {
            alert('You must have at least one question in the quiz.');
        }
    }

    renumberQuestions() {
        const questionCards = document.querySelectorAll('.question-card');
        questionCards.forEach((card, index) => {
            const questionNumber = index + 1;
            card.setAttribute('data-question-id', questionNumber);
            card.querySelector('h3').textContent = `Question ${questionNumber}`;
            
            // Update all IDs and names within this card
            const removeBtn = card.querySelector('.remove-question');
            removeBtn.setAttribute('data-question-id', questionNumber);
            
            const textarea = card.querySelector('.question-text');
            textarea.id = `question-${questionNumber}-text`;
            
            // Update radio buttons and option inputs
            const radioButtons = card.querySelectorAll('input[type="radio"]');
            const optionInputs = card.querySelectorAll('.option-text');
            
            radioButtons.forEach((radio, i) => {
                radio.name = `correct-${questionNumber}`;
                radio.id = `correct-${questionNumber}-${i}`;
            });
            
            optionInputs.forEach((input, i) => {
                input.id = `option-${questionNumber}-${i}`;
            });
        });
    }

    handleQuizSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const title = document.getElementById('quiz-title').value;
        const category = document.getElementById('quiz-category').value;
        const timeLimit = document.getElementById('time-limit').value;
        const description = document.getElementById('quiz-description').value;
        
        // Get questions data
        const questions = [];
        const questionCards = document.querySelectorAll('.question-card');
        
        questionCards.forEach(card => {
            const questionId = card.getAttribute('data-question-id');
            const questionText = document.getElementById(`question-${questionId}-text`).value;
            
            const options = [];
            for (let i = 0; i < 4; i++) {
                options.push(document.getElementById(`option-${questionId}-${i}`).value);
            }
            
            const correctAnswer = document.querySelector(`input[name="correct-${questionId}"]:checked`).value;
            
            questions.push({
                text: questionText,
                options: options,
                correctAnswer: parseInt(correctAnswer)
            });
        });
        
        // Create quiz object
        const quiz = {
            title,
            category,
            timeLimit: parseInt(timeLimit),
            description,
            questions
        };
        
        // Save quiz - this would connect to your backend in a real app
        console.log('Quiz created:', quiz);
        alert('Quiz created successfully!');
        
        // Navigate back to dashboard
        this.navigateTo('/admin');
    }
}