import AbstractView from "./AbstractView.js";
import authService from "../services/auth.service.js";
import quizService from "../services/quiz.service.js";
import categoryService from "../services/category.service.js";
import questionService from "../services/question.service.js";
import difficultyService from "../services/difficulty.service.js";
import answerService from "../services/answer.service.js";

export default class CreateQuizView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Quiz");
        
        this.quizId = localStorage.getItem('selected_quiz_id');
        this.quizTitle = localStorage.getItem('selected_quiz_title');
        this.isEditing = !!this.quizId;
        
        if (this.isEditing) {
            this.setTitle(`Edit Quiz: ${this.quizTitle}`);
        }
        
        this.categories = [];
        this.difficulties = [];
        this.questions = [];
        this.currentQuestionId = null;
        this.questionCounter = 0;
        this.viewingQuestions = this.isEditing;
    }

    async getHtml() {
        return `
            <div class="admin-page">
                <div class="admin-main">
                    <section class="admin-sidebar">
                        <nav class="admin-nav">
                            <ul>
                                <li><a href="/admin" class="admin-nav-link" data-link data-admin-page="dashboard">Dashboard</a></li>
                                <li><a href="/create-quiz" class="admin-nav-link active" data-admin-page="create-quiz">Create Quiz</a></li>
                            </ul>
                        </nav>
                    </section>
                    
                    <div class="admin-content" id="admin-content">
                        <div class="page-header">
                            <h1>${this.isEditing ? `Edit Quiz: ${this.quizTitle}` : 'Create New Quiz'}</h1>
                        </div>
                        
                        <div id="quiz-form-container" ${this.viewingQuestions ? 'style="display: none;"' : ''}>
                            <form id="create-quiz-form" class="create-quiz-form">
                                <section class="form-section">
                                    <h2>Quiz Details</h2>
                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label for="quiz-title">Quiz Title</label>
                                            <input type="text" id="quiz-title" required placeholder="e.g. World Cup History" maxlength="64">
                                        </div>
                                        <div class="form-group">
                                            <label for="quiz-category">Category</label>
                                            <select id="quiz-category">
                                                <option value="">-- Select a category --</option>
                                                <!-- Categories will be loaded dynamically -->
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="quiz-description">Description</label>
                                        <textarea id="quiz-description" rows="3" placeholder="Describe what this quiz is about" maxlength="128"></textarea>
                                    </div>
                                </section>

                                <div class="form-actions">
                                    <button type="button" class="btn btn-outline" id="cancel-quiz">Cancel</button>
                                    <button type="submit" class="btn btn-primary">${this.isEditing ? 'Update Quiz' : 'Create Quiz'}</button>
                                </div>
                            </form>
                        </div>
                        
                        <div id="questions-container" ${!this.viewingQuestions ? 'style="display: none;"' : ''}>
                            <section class="form-section">
                                <div class="section-header">
                                    <h2>Questions for ${this.quizTitle || 'Quiz'}</h2>
                                    <button type="button" id="add-question" class="btn btn-outline">Add Question</button>
                                </div>
                                
                                <div id="questions-list">
                                    <p>Loading questions...</p>
                                </div>
                            </section>
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn-outline" id="back-to-quiz">Back to Quiz Details</button>
                                <button type="button" class="btn btn-primary" id="back-to-dashboard">Back to Dashboard</button>
                            </div>
                        </div>
                        
                        <div id="question-form-container" style="display: none;">
                            <section class="form-section">
                                <h2>Add Question</h2>
                                <form id="question-form">
                                    <div class="form-group">
                                        <label for="question-text">Question Text</label>
                                        <textarea id="question-text" rows="2" required placeholder="Enter your question" maxlength="256"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="question-difficulty">Difficulty Level</label>
                                        <select id="question-difficulty" required>
                                            <option value="">-- Select difficulty --</option>
                                            <!-- Difficulties will be loaded dynamically -->
                                        </select>
                                    </div>
                                    <div class="form-actions">
                                        <button type="button" class="btn btn-outline" id="cancel-question">Cancel</button>
                                        <button type="submit" class="btn btn-primary">Save Question</button>
                                    </div>
                                </form>
                            </section>
                        </div>
                        
                        <div id="answers-container" style="display: none;">
                            <section class="form-section">
                                <div class="section-header">
                                    <h2>Answers for: <span id="question-title"></span></h2>
                                    <div id="answer-status"></div>
                                </div>
                                
                                <div id="answers-list">
                                    <p>Loading answers...</p>
                                </div>
                            </section>
                            
                            <div id="answer-form" style="display: none;">
                                <section class="form-section">
                                    <h3>Add Answer</h3>
                                    <form id="add-answer-form">
                                        <div class="form-group">
                                            <label for="answer-text">Answer Text</label>
                                            <input type="text" id="answer-text" required placeholder="Enter answer option" maxlength="128">
                                        </div>
                                        <div class="form-group">
                                            <label>
                                                <input type="checkbox" id="answer-correct"> Mark as correct answer
                                            </label>
                                        </div>
                                        <div class="form-actions">
                                            <button type="button" class="btn btn-outline" id="cancel-answer">Cancel</button>
                                            <button type="submit" class="btn btn-primary">Save Answer</button>
                                        </div>
                                    </form>
                                </section>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn-outline" id="back-to-questions">Back to Questions</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async mount() {
        const isAuthenticated = await authService.checkAuthentication();
        if (!isAuthenticated) {
            window.location.href = '/';
            return;
        }

        if (!authService.isQuizMaster()) {
            window.location.href = '/home';
            return;
        }

        this.updateHeader();
        
        await this.loadCategories();
        await this.loadDifficulties();
        
        if (this.isEditing) {
            await this.loadQuizData();
            await this.loadQuestions();
        }
        
        this.setupEventListeners();
    }

    updateHeader() {
        const user = authService.getUser();
        const loginLink = document.querySelector('.user-menu .btn');
        const userDropdown = document.getElementById('user-dropdown');
        const usernameDisplay = document.getElementById('username-display');
        
        if (user) {
            if (loginLink) loginLink.classList.add('hidden');
            if (userDropdown) {
                userDropdown.classList.remove('hidden');
                if (usernameDisplay) {
                    usernameDisplay.textContent = user.username || 'Admin';
                }
            }
            
            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    authService.logout();
                });
            }
        }
    }

    async loadCategories() {
        try {
            this.categories = await categoryService.getAllCategories();
            
            const categorySelect = document.getElementById('quiz-category');
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">-- Select a category --</option>';
                
                this.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.category_id;
                    option.textContent = category.category_name;
                    categorySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async loadDifficulties() {
        try {
            this.difficulties = await difficultyService.getAllDifficultyLevels();
            
            const difficultySelect = document.getElementById('question-difficulty');
            if (difficultySelect) {
                difficultySelect.innerHTML = '<option value="">-- Select difficulty --</option>';
                
                this.difficulties.forEach(difficulty => {
                    const option = document.createElement('option');
                    option.value = difficulty.difficulty_id;
                    option.textContent = `${difficulty.difficulty_level} (${difficulty.time_limit_seconds}s, +${difficulty.points_on_correct}/${difficulty.points_on_incorrect})`;
                    difficultySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading difficulties:', error);
        }
    }

    async loadQuizData() {
        if (!this.quizId) return;
        
        try {
            const quiz = await quizService.getQuizById(this.quizId);
            
            const titleInput = document.getElementById('quiz-title');
            const categorySelect = document.getElementById('quiz-category');
            const descriptionInput = document.getElementById('quiz-description');
            
            if (titleInput) titleInput.value = quiz.quiz_title;
            if (categorySelect) categorySelect.value = quiz.category_id || '';
            if (descriptionInput) descriptionInput.value = quiz.quiz_description || '';
        } catch (error) {
            console.error('Error loading quiz data:', error);
            alert(`Failed to load quiz data: ${error.message}`);
        }
    }

    async loadQuestions() {
        if (!this.quizId) return;
        
        try {
            const questionsContainer = document.getElementById('questions-list');
            if (!questionsContainer) return;
            
            questionsContainer.innerHTML = '<p>Loading questions...</p>';
            
            this.questions = await questionService.getQuestionsByQuizId(this.quizId);
            this.questionCounter = this.questions.length;
            
            if (this.questions.length === 0) {
                questionsContainer.innerHTML = '<p>No questions found. Add your first question!</p>';
                return;
            }
            
            const questionsList = document.createElement('div');
            questionsList.className = 'questions-list';
            
            this.questions.forEach((question, index) => {
                const questionCard = document.createElement('div');
                questionCard.className = 'question-card';
                questionCard.dataset.id = question.question_id;
                
                const isValid = question.answer_count === 4 && question.correct_answer_count === 1;
                const statusClass = isValid ? 'valid-status' : 'invalid-status';
                const statusText = isValid 
                    ? 'Valid: 4 answers with 1 correct' 
                    : `Invalid: ${question.answer_count}/4 answers, ${question.correct_answer_count}/1 correct`;
                
                questionCard.innerHTML = `
                    <div class="question-header">
                        <h3>Question ${index + 1}</h3>
                        <div class="question-actions">
                            <button type="button" class="btn btn-icon delete-question" data-id="${question.question_id}" title="Delete Question">🗑️</button>
                        </div>
                    </div>
                    <div class="question-details">
                        <p><strong>${question.question_text}</strong></p>
                        <p>Difficulty: ${question.difficulty_level} (${question.time_limit_seconds}s, +${question.points_on_correct}/${Math.abs(question.points_on_incorrect)})</p>
                        <p class="${statusClass}">${statusText}</p>
                        <button class="btn manage-answers" data-id="${question.question_id}" data-text="${question.question_text}">Manage Answers</button>
                    </div>
                `;
                
                questionsList.appendChild(questionCard);
            });
            
            questionsContainer.innerHTML = '';
            questionsContainer.appendChild(questionsList);
            
            document.querySelectorAll('.manage-answers').forEach(button => {
                button.addEventListener('click', (e) => {
                    const questionId = e.target.dataset.id;
                    const questionText = e.target.dataset.text;
                    this.handleManageAnswers(questionId, questionText);
                });
            });
            
            document.querySelectorAll('.delete-question').forEach(button => {
                button.addEventListener('click', (e) => {
                    const questionId = e.target.dataset.id;
                    this.handleDeleteQuestion(questionId);
                });
            });
        } catch (error) {
            console.error('Error loading questions:', error);
            const questionsContainer = document.getElementById('questions-list');
            if (questionsContainer) {
                questionsContainer.innerHTML = '<p>Error loading questions. Please try again later.</p>';
            }
        }
    }

    async loadAnswers(questionId) {
        try {
            const answersContainer = document.getElementById('answers-list');
            if (!answersContainer) return;
            
            answersContainer.innerHTML = '<p>Loading answers...</p>';
            
            const answers = await answerService.getAnswersByQuestionId(questionId);
            
            const validation = await questionService.validateQuestion(questionId);
            const validationStatus = validation.validation;
            
            const answerStatus = document.getElementById('answer-status');
            if (answerStatus) {
                const statusClass = validationStatus.isValid ? 'valid-status' : 'invalid-status';
                answerStatus.innerHTML = `<p class="${statusClass}">${validationStatus.message}</p>`;
            }
            
            if (answers.length === 0) {
                answersContainer.innerHTML = `
                    <p>No answers found. Add exactly 4 answers with 1 marked as correct.</p>
                    <button id="add-answer-button" class="btn btn-primary">Add Answer</button>
                `;
                
                document.getElementById('add-answer-button').addEventListener('click', () => {
                    this.showAnswerForm();
                });
                return;
            }
            
            const answersList = document.createElement('div');
            answersList.className = 'answers-list';
            
            answers.forEach((answer, index) => {
                const answerItem = document.createElement('div');
                answerItem.className = 'answer-item';
                answerItem.dataset.id = answer.answer_id;
                
                answerItem.innerHTML = `
                    <div class="answer-content">
                        <span class="answer-mark">${answer.is_correct ? '✓' : ''}</span>
                        <span class="answer-text">${answer.answer_text}</span>
                    </div>
                    <div class="answer-actions">
                        ${!answer.is_correct ? `<button class="btn mark-correct" data-id="${answer.answer_id}">Mark as Correct</button>` : ''}
                        <button class="btn btn-icon delete-answer" data-id="${answer.answer_id}" title="Delete Answer">🗑️</button>
                    </div>
                `;
                
                answersList.appendChild(answerItem);
            });
            
            if (answers.length < 4) {
                const addButton = document.createElement('button');
                addButton.id = 'add-answer-button';
                addButton.className = 'btn btn-primary';
                addButton.textContent = 'Add Answer';
                addButton.addEventListener('click', () => {
                    this.showAnswerForm();
                });
                
                answersList.appendChild(addButton);
            }
            
            answersContainer.innerHTML = '';
            answersContainer.appendChild(answersList);
            
            document.querySelectorAll('.mark-correct').forEach(button => {
                button.addEventListener('click', (e) => {
                    const answerId = e.target.dataset.id;
                    this.handleMarkCorrect(answerId);
                });
            });
            
            document.querySelectorAll('.delete-answer').forEach(button => {
                button.addEventListener('click', (e) => {
                    const answerId = e.target.dataset.id;
                    this.handleDeleteAnswer(answerId);
                });
            });
        } catch (error) {
            console.error('Error loading answers:', error);
            const answersContainer = document.getElementById('answers-list');
            if (answersContainer) {
                answersContainer.innerHTML = '<p>Error loading answers. Please try again later.</p>';
            }
        }
    }

    setupEventListeners() {
        const quizForm = document.getElementById('create-quiz-form');
        const cancelQuizBtn = document.getElementById('cancel-quiz');
        
        if (quizForm) {
            quizForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuizSubmit();
            });
        }
        
        if (cancelQuizBtn) {
            cancelQuizBtn.addEventListener('click', () => {
                window.location.href = '/admin';
            });
        }
        
        const addQuestionBtn = document.getElementById('add-question');
        const backToDashboardBtn = document.getElementById('back-to-dashboard');
        const backToQuizBtn = document.getElementById('back-to-quiz');
        
        if (addQuestionBtn) {
            addQuestionBtn.addEventListener('click', () => {
                this.showQuestionForm();
            });
        }
        
        if (backToDashboardBtn) {
            backToDashboardBtn.addEventListener('click', () => {
                localStorage.removeItem('selected_quiz_id');
                localStorage.removeItem('selected_quiz_title');
                
                window.location.href = '/admin';
            });
        }
        
        if (backToQuizBtn) {
            backToQuizBtn.addEventListener('click', () => {
                this.showQuizForm();
            });
        }
        
        const questionForm = document.getElementById('question-form');
        const cancelQuestionBtn = document.getElementById('cancel-question');
        
        if (questionForm) {
            questionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuestionSubmit();
            });
        }
        
        if (cancelQuestionBtn) {
            cancelQuestionBtn.addEventListener('click', () => {
                this.showQuestionsView();
            });
        }
        
        const answerForm = document.getElementById('add-answer-form');
        const cancelAnswerBtn = document.getElementById('cancel-answer');
        
        if (answerForm) {
            answerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAnswerSubmit();
            });
        }
        
        if (cancelAnswerBtn) {
            cancelAnswerBtn.addEventListener('click', () => {
                this.hideAnswerForm();
            });
        }
    }
    
    async handleQuizSubmit() {
        const titleInput = document.getElementById('quiz-title');
        const categorySelect = document.getElementById('quiz-category');
        const descriptionInput = document.getElementById('quiz-description');
        
        if (!titleInput) return;
        
        const title = titleInput.value.trim();
        const categoryId = categorySelect ? categorySelect.value : '';
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        
        if (!title) {
            alert('Quiz title is required!');
            return;
        }
        
        try {
            if (this.isEditing) {
                await quizService.updateQuiz(this.quizId, {
                    quiz_title: title,
                    quiz_description: description || undefined,
                    category_id: categoryId || null
                });
                
                localStorage.setItem('selected_quiz_title', title);
                this.quizTitle = title;
                
                alert('Quiz updated successfully!');
            } else {
                const quiz = await quizService.createQuiz({
                    quiz_title: title,
                    quiz_description: description || undefined,
                    category_id: categoryId || null
                });
                
                this.quizId = quiz.quiz_id;
                this.quizTitle = quiz.quiz_title;
                localStorage.setItem('selected_quiz_id', this.quizId);
                localStorage.setItem('selected_quiz_title', this.quizTitle);
                
                this.isEditing = true;
                
                alert('Quiz created successfully! Now you can add questions.');
            }
            
            this.showQuestionsView();
            
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert(`Failed to save quiz: ${error.message}`);
        }
    }
    
    async handleQuestionSubmit() {
        const textInput = document.getElementById('question-text');
        const difficultySelect = document.getElementById('question-difficulty');
        
        if (!textInput || !difficultySelect) return;
        
        const text = textInput.value.trim();
        const difficultyId = difficultySelect.value;
        
        if (!text) {
            alert('Question text is required!');
            return;
        }
        
        if (!difficultyId) {
            alert('Difficulty level is required!');
            return;
        }
        
        try {
            const question = await questionService.createQuestion({
                quiz_id: this.quizId,
                question_text: text,
                difficulty_id: difficultyId
            });
            
            textInput.value = '';
            difficultySelect.selectedIndex = 0;
            
            this.currentQuestionId = question.question_id;
            
            this.handleManageAnswers(question.question_id, text);
            
        } catch (error) {
            console.error('Error creating question:', error);
            alert(`Failed to create question: ${error.message}`);
        }
    }
    
    async handleAnswerSubmit() {
        const textInput = document.getElementById('answer-text');
        const correctCheckbox = document.getElementById('answer-correct');
        
        if (!textInput || !correctCheckbox) return;
        
        const text = textInput.value.trim();
        const isCorrect = correctCheckbox.checked;
        
        if (!text) {
            alert('Answer text is required!');
            return;
        }
        
        try {
            await answerService.createAnswer({
                question_id: this.currentQuestionId,
                answer_text: text,
                is_correct: isCorrect
            });
            
            textInput.value = '';
            correctCheckbox.checked = false;
            
            this.hideAnswerForm();
            
            this.loadAnswers(this.currentQuestionId);
            
        } catch (error) {
            console.error('Error creating answer:', error);
            alert(`Failed to create answer: ${error.message}`);
        }
    }
    
    async handleDeleteQuestion(questionId) {
        if (!confirm('Are you sure you want to delete this question?')) return;
        
        try {
            await questionService.deleteQuestion(questionId);
            alert('Question deleted successfully!');
            
            this.loadQuestions();
            
        } catch (error) {
            console.error('Error deleting question:', error);
            alert(`Failed to delete question: ${error.message}`);
        }
    }
    
    async handleDeleteAnswer(answerId) {
        if (!confirm('Are you sure you want to delete this answer?')) return;
        
        try {
            await answerService.deleteAnswer(answerId);
            alert('Answer deleted successfully!');
            
            this.loadAnswers(this.currentQuestionId);
            
        } catch (error) {
            console.error('Error deleting answer:', error);
            alert(`Failed to delete answer: ${error.message}`);
        }
    }
    
    async handleMarkCorrect(answerId) {
        try {
            await answerService.markAsCorrect(answerId);
            
            this.loadAnswers(this.currentQuestionId);
            
        } catch (error) {
            console.error('Error marking answer as correct:', error);
            alert(`Failed to mark answer as correct: ${error.message}`);
        }
    }
    
    handleManageAnswers(questionId, questionText) {
        this.currentQuestionId = questionId;
        
        const questionTitle = document.getElementById('question-title');
        if (questionTitle) {
            questionTitle.textContent = questionText;
        }
        
        this.showAnswersView();
        
        this.loadAnswers(questionId);
    }
    
    showQuizForm() {
        const quizFormContainer = document.getElementById('quiz-form-container');
        const questionsContainer = document.getElementById('questions-container');
        const questionFormContainer = document.getElementById('question-form-container');
        const answersContainer = document.getElementById('answers-container');
        
        if (quizFormContainer) quizFormContainer.style.display = 'block';
        if (questionsContainer) questionsContainer.style.display = 'none';
        if (questionFormContainer) questionFormContainer.style.display = 'none';
        if (answersContainer) answersContainer.style.display = 'none';
        
        this.viewingQuestions = false;
    }
    
    showQuestionsView() {
        const quizFormContainer = document.getElementById('quiz-form-container');
        const questionsContainer = document.getElementById('questions-container');
        const questionFormContainer = document.getElementById('question-form-container');
        const answersContainer = document.getElementById('answers-container');
        
        if (quizFormContainer) quizFormContainer.style.display = 'none';
        if (questionsContainer) questionsContainer.style.display = 'block';
        if (questionFormContainer) questionFormContainer.style.display = 'none';
        if (answersContainer) answersContainer.style.display = 'none';
        
        this.viewingQuestions = true;
        
        this.loadQuestions();
    }
    
    showQuestionForm() {
        const quizFormContainer = document.getElementById('quiz-form-container');
        const questionsContainer = document.getElementById('questions-container');
        const questionFormContainer = document.getElementById('question-form-container');
        const answersContainer = document.getElementById('answers-container');
        
        if (quizFormContainer) quizFormContainer.style.display = 'none';
        if (questionsContainer) questionsContainer.style.display = 'none';
        if (questionFormContainer) questionFormContainer.style.display = 'block';
        if (answersContainer) answersContainer.style.display = 'none';
    }
    
    showAnswersView() {
        const quizFormContainer = document.getElementById('quiz-form-container');
        const questionsContainer = document.getElementById('questions-container');
        const questionFormContainer = document.getElementById('question-form-container');
        const answersContainer = document.getElementById('answers-container');
        
        if (quizFormContainer) quizFormContainer.style.display = 'none';
        if (questionsContainer) questionsContainer.style.display = 'none';
        if (questionFormContainer) questionFormContainer.style.display = 'none';
        if (answersContainer) answersContainer.style.display = 'block';
    }
    
    showAnswerForm() {
        const answerForm = document.getElementById('answer-form');
        if (answerForm) {
            answerForm.style.display = 'block';
        }
    }
    
    hideAnswerForm() {
        const answerForm = document.getElementById('answer-form');
        if (answerForm) {
            answerForm.style.display = 'none';
        }
    }
}