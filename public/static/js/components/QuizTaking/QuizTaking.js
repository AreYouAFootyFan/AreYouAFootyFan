import { StyleLoader } from "../../utils/cssLoader.js";

class QuizTaking extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.quizId = localStorage.getItem("selected_quiz_to_play_id");
    this.quizData = null;
    this.attempt = null;
    this.currentQuestionIndex = 0;
    this.currentQuestion = null;
    this.selectedAnswer = null;
    this.timer = null;
    this.timeLeft = 0;
    this.score = 0;
    this.isQuizCompleted = false;
    this.styleSheet = new CSSStyleSheet();
  }

  async connectedCallback() {
    await this.loadStyles();
    this.render();
    this.init();

    window.addEventListener("beforeunload", this.cleanup.bind(this));
  }

  disconnectedCallback() {
    this.cleanup();
  }

  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/quizTaking/quizTaking.css"
    );
  }

  render() {
    const style = document.createElement("style");

    const main = document.createElement("main");
    main.classList.add("quiz-container");

    const loadingContainer = document.createElement("section");
    loadingContainer.classList.add("loading-container");

    const loadingSpinner = document.createElement("section");
    loadingSpinner.classList.add("loading-spinner");

    const loadingText = document.createElement("p");
    loadingText.textContent = "Loading quiz...";

    loadingContainer.appendChild(loadingSpinner);
    loadingContainer.appendChild(loadingText);
    main.appendChild(loadingContainer);

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(main);
  }

  async init() {
    const authService = window.authService;

    if (!authService || !authService.isAuthenticated()) {
      navigator("/");
      return;
    }

    if (this.quizId) {
      await this.startQuiz(this.quizId);
    } else {
      this.showError(
        "No quiz selected. Please go back to the home page and select a quiz."
      );
    }
  }

  cleanup() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async startQuiz(quizId) {
    try {
      const quizAttemptService = window.quizAttemptService;

      const quizContainer = this.shadowRoot.querySelector(".quiz-container");
      if (quizContainer) {
        quizContainer.innerHTML = "";

        const loadingContainer = document.createElement("section");
        loadingContainer.classList.add("loading-container");

        const loadingSpinner = document.createElement("section");
        loadingSpinner.classList.add("loading-spinner");

        const loadingText = document.createElement("p");
        loadingText.textContent = "Loading quiz... Please wait.";

        loadingContainer.appendChild(loadingSpinner);
        loadingContainer.appendChild(loadingText);
        quizContainer.appendChild(loadingContainer);
      }

      this.attempt = await quizAttemptService.startQuiz(quizId);

      this.quizData = {
        title: this.attempt.quiz_title,
        description: this.attempt.quiz_description,
        totalQuestions: this.attempt.questions.length,
      };

      this.loadQuestion(0);
    } catch (error) {
      this.showError(
        `Failed to start quiz: ${error.message || "Unknown error"}`
      );
    }
  }

  loadQuestion(index) {
    if (
      !this.attempt ||
      !this.attempt.questions ||
      index >= this.attempt.questions.length
    ) {
      this.completeQuiz();
      return;
    }

    this.currentQuestionIndex = index;
    this.currentQuestion = this.attempt.questions[index];
    this.selectedAnswer = null;

    this.timeLeft = this.currentQuestion.time_limit_seconds;

    this.renderQuestion();

    this.startTimer();
  }

  renderQuestion() {
    const quizContainer = this.shadowRoot.querySelector(".quiz-container");
    if (!quizContainer) return;

    const question = this.currentQuestion;

    const questionElement = document.createElement("quiz-question");
    questionElement.setAttribute("question-index", this.currentQuestionIndex);
    questionElement.setAttribute(
      "total-questions",
      this.quizData.totalQuestions
    );
    questionElement.setAttribute("quiz-title", this.quizData.title);
    questionElement.setAttribute("score", this.score);
    questionElement.setAttribute("time-limit", this.timeLeft);
    questionElement.question = question;

    questionElement.addEventListener("answer-selected", (e) =>
      this.selectAnswer(e.detail.answerId)
    );
    questionElement.addEventListener("submit-answer", () =>
      this.submitAnswer()
    );

    quizContainer.innerHTML = "";
    quizContainer.appendChild(questionElement);

    this.startTimerUpdates(questionElement);
  }

  startTimerUpdates(questionElement) {
    const updateTimer = () => {
      if (questionElement) {
        questionElement.setAttribute("time-left", this.timeLeft);

        if (this.timeLeft <= 5) {
          questionElement.setAttribute("timer-warning", "true");
        } else {
          questionElement.removeAttribute("timer-warning");
        }
      }
    };

    updateTimer();

    this.timerUpdateInterval = setInterval(updateTimer, 100);
  }

  selectAnswer(answerId) {
    this.selectedAnswer = parseInt(answerId);

    const questionElement = this.shadowRoot.querySelector("quiz-question");
    if (questionElement) {
      questionElement.setAttribute("selected-answer", answerId);
    }
  }

  async submitAnswer() {
    if (!this.selectedAnswer) return;

    try {
      this.pauseTimer();

      const questionElement = this.shadowRoot.querySelector("quiz-question");
      if (questionElement) {
        questionElement.setAttribute("submitting", "true");
      }

      const userResponseService = window.userResponseService;

      if (!userResponseService && !window.quizAttemptService) {
        this.showError("Response services not available.");
        return;
      }

      let response;
      try {
        if (userResponseService) {
          response = await userResponseService.submitResponse({
            attempt_id: this.attempt.attempt_id,
            question_id: this.currentQuestion.question_id,
            answer_id: this.selectedAnswer,
          });
        } else {
          response = await window.quizAttemptService.submitResponse({
            attempt_id: this.attempt.attempt_id,
            question_id: this.currentQuestion.question_id,
            answer_id: this.selectedAnswer,
          });
        }
      } catch (e) {
        this.showError("API call failed.");
        return;
      }

      this.score += response.points_earned;

      this.showAnswerFeedback(response);

      this.updateActionButtons(
        response.quiz_completed ||
          this.currentQuestionIndex === this.quizData.totalQuestions - 1
      );
    } catch (error) {
      const questionElement = this.shadowRoot.querySelector("quiz-question");
      if (questionElement) {
        questionElement.setAttribute("submitting", "false");
      }

      this.resumeTimer();
    }
  }

  showAnswerFeedback(response) {
    const questionElement = this.shadowRoot.querySelector("quiz-question");
    if (questionElement) {
      questionElement.setAttribute("show-feedback", "true");
      questionElement.setAttribute("feedback-points", response.points_earned);
      questionElement.setAttribute("score", this.score);

      this.currentQuestion.answers.forEach((answer) => {
        if (answer.is_correct) {
          questionElement.setAttribute(
            `correct-answer-${answer.answer_id}`,
            "true"
          );
        }
      });
    }
  }

  updateActionButtons(quizCompleted) {
    const questionElement = this.shadowRoot.querySelector("quiz-question");
    if (!questionElement) return;

    if (
      quizCompleted ||
      this.currentQuestionIndex >= this.quizData.totalQuestions - 1
    ) {
      questionElement.setAttribute("show-results-button", "true");
      questionElement.addEventListener("show-results", () =>
        this.completeQuiz()
      );
    } else {
      questionElement.setAttribute("show-next-button", "true");
      questionElement.addEventListener("next-question", () =>
        this.loadQuestion(this.currentQuestionIndex + 1)
      );
    }
  }

  startTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.handleTimeUp();
      }
    }, 1000);
  }

  pauseTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    if (this.timerUpdateInterval) {
      clearInterval(this.timerUpdateInterval);
      this.timerUpdateInterval = null;
    }
  }

  resumeTimer() {
    if (!this.timer && this.timeLeft > 0 && !this.selectedAnswer) {
      this.startTimer();

      const questionElement = this.shadowRoot.querySelector("quiz-question");
      if (questionElement) {
        this.startTimerUpdates(questionElement);
      }
    }
  }

  async handleTimeUp() {
    const questionElement = this.shadowRoot.querySelector("quiz-question");
    if (!questionElement) return;
    if (this.selectedAnswer) {
      this.submitAnswer();
    } else {
      await this.submitNoAnswer();

      questionElement.setAttribute("time-up", "true");

      this.currentQuestion.answers.forEach((answer) => {
        if (answer.is_correct) {
          questionElement.setAttribute(
            `correct-answer-${answer.answer_id}`,
            "true"
          );
        }
      });

      if (this.currentQuestionIndex >= this.quizData.totalQuestions - 1) {
        questionElement.setAttribute("show-results-button", "true");
        questionElement.addEventListener("show-results", () =>
          this.completeQuiz()
        );
      } else {
        questionElement.setAttribute("show-next-button", "true");
        questionElement.addEventListener("next-question", () =>
          this.loadQuestion(this.currentQuestionIndex + 1)
        );
      }
    }
  }

  async submitNoAnswer() {
    try {
      this.pauseTimer();
      const questionElement = this.shadowRoot.querySelector("quiz-question");
      if (questionElement) {
        questionElement.setAttribute("submitting", "true");
      }
      if (!window.quizAttemptService) {
        this.showError("User response service not available.");
        return;
      }
      const response = await window.quizAttemptService.submitNoAnswer({
        attempt_id: this.attempt.attempt_id,
        question_id: this.currentQuestion.question_id,
      });

      this.score += response.points_earned;

      questionElement.setAttribute("show-feedback", "true");
      questionElement.setAttribute("feedback-points", response.points_earned);
      questionElement.setAttribute("score", this.score);
      questionElement.setAttribute("no-answer", "true");
    } catch (error) {
      this.showError("Error submitting no-answer:", error);
    }
  }

  async completeQuiz() {
    try {
      const quizAttemptService = window.quizAttemptService;

      if (!quizAttemptService) {
        this.showError("Quiz attempt service not available.");
        return;
      }

      try {
        await quizAttemptService.completeQuiz(this.attempt.attempt_id);
        const summary = await quizAttemptService.getAttemptSummary(
          this.attempt.attempt_id
        );
        this.showQuizResults(summary);
      } catch (e) {
        this.showError("API call failed.");
        throw e;
      }

      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      if (this.timerUpdateInterval) {
        clearInterval(this.timerUpdateInterval);
        this.timerUpdateInterval = null;
      }

      this.isQuizCompleted = true;
    } catch (error) {
      this.showError(
        `Failed to complete quiz: ${error.message || "Unknown error"}`
      );
    }
  }

  showQuizResults(summary) {
    const quizContainer = this.shadowRoot.querySelector(".quiz-container");
    if (!quizContainer) return;

    const resultsElement = document.createElement("quiz-results");
    resultsElement.summary = summary;

    quizContainer.innerHTML = "";
    quizContainer.appendChild(resultsElement);
  }

  showError(message) {
    const quizContainer = this.shadowRoot.querySelector(".quiz-container");
    if (quizContainer) {
      quizContainer.innerHTML = "";

      const errorContainer = document.createElement("article");
      errorContainer.classList.add("error-container");

      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = message;

      const homeButton = document.createElement("a");
      homeButton.href = "/home";
      homeButton.classList.add("home-btn");
      homeButton.setAttribute("data-link", "");
      homeButton.textContent = "Back to Home";

      errorContainer.appendChild(errorMessage);
      errorContainer.appendChild(homeButton);
      quizContainer.appendChild(errorContainer);

      homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.history.pushState(null, null, homeButton.getAttribute("href"));
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
    }
  }
}

customElements.define("quiz-taking", QuizTaking);

export default QuizTaking;
