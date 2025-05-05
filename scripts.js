// App State
const appState = {
  currentUser: null,
  isLoggedIn: false,
  currentPage: "home",
  currentAdminPage: "dashboard",
  quizzes: [
    {
      id: 1,
      title: "World Cup History",
      category: "world-cup",
      difficulty: "easy",
      description: "Test your knowledge about World Cup history with these beginner-friendly questions.",
      questions: 10,
      timeEstimate: "5 min",
    },
    {
      id: 2,
      title: "Premier League Legends",
      category: "premier-league",
      difficulty: "medium",
      description: "How well do you know the greatest players in Premier League history?",
      questions: 15,
      timeEstimate: "10 min",
    },
    {
      id: 3,
      title: "Champions League Trivia",
      category: "champions-league",
      difficulty: "hard",
      description: "Only true football experts will ace this challenging Champions League quiz.",
      questions: 20,
      timeEstimate: "15 min",
    },
    {
      id: 4,
      title: "Football Stars",
      category: "players",
      difficulty: "medium",
      description: "Test your knowledge about the biggest football stars of all time.",
      questions: 15,
      timeEstimate: "8 min",
    },
    {
      id: 5,
      title: "Premier League Basics",
      category: "premier-league",
      difficulty: "easy",
      description: "New to football? Start with these basic Premier League questions.",
      questions: 10,
      timeEstimate: "5 min",
    },
    {
      id: 6,
      title: "World Cup Deep Dive",
      category: "world-cup",
      difficulty: "hard",
      description: "Only the most dedicated football historians will know these World Cup facts.",
      questions: 20,
      timeEstimate: "15 min",
    },
  ],
  currentQuiz: null,
  currentQuestion: 0,
  userAnswers: [],
  quizTimer: null,
  questionTimer: null,
  timeLeft: 30,
  score: 0,
  streak: 0,
}

// DOM Elements
const elements = {
  appContainer: document.getElementById("app-container"),
  navLinks: document.querySelectorAll(".nav-link"),
  loginButton: document.getElementById("login-button"),
  userDropdown: document.getElementById("user-dropdown"),
  usernameDisplay: document.getElementById("username-display"),
  logoutButton: document.getElementById("logout-button"),
  loginModal: document.getElementById("login-modal"),
  closeModalButtons: document.querySelectorAll(".close-modal"),
  tabs: document.querySelectorAll(".tab"),
  loginForm: document.getElementById("login-form"),
  signupForm: document.getElementById("signup-form"),
  avatarModal: document.getElementById("avatar-modal"),
  avatarOptions: document.querySelectorAll(".avatar-option"),
  saveAvatarButton: document.getElementById("save-avatar"),
  resultModal: document.getElementById("result-modal"),
  nextQuestionButton: document.getElementById("next-question"),
  quizCompleteModal: document.getElementById("quiz-complete-modal"),
}

// Templates
const templates = {
  home: document.getElementById("home-template"),
  quiz: document.getElementById("quiz-template"),
  profile: document.getElementById("profile-template"),
  admin: document.getElementById("admin-template"),
  adminCreateQuiz: document.getElementById("admin-create-quiz-template"),
}

// Initialize the app
function init() {
  // Load user data from localStorage if available
  loadUserData()

  // Set up event listeners
  setupEventListeners()

  // Handle initial route
  handleRoute()

  // Update UI based on login state
  updateUIForLoginState()
}

// Load user data from localStorage
function loadUserData() {
  const userData = localStorage.getItem("footballQuizUser")
  if (userData) {
    appState.currentUser = JSON.parse(userData)
    appState.isLoggedIn = true
  }
}

// Save user data to localStorage
function saveUserData() {
  if (appState.currentUser) {
    localStorage.setItem("footballQuizUser", JSON.stringify(appState.currentUser))
  } else {
    localStorage.removeItem("footballQuizUser")
  }
}

// Set up event listeners
function setupEventListeners() {
  // Navigation links
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const page = link.dataset.page
      navigateTo(page)
    })
  })

  // Login button
  elements.loginButton.addEventListener("click", () => {
    elements.loginModal.classList.remove("hidden")
  })

  // Close modal buttons
  elements.closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.add("hidden")
      })
    })
  })

  // Tab switching
  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab

      // Update active tab
      elements.tabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Show corresponding tab content
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.add("hidden")
      })
      document.getElementById(`${tabName}-tab`).classList.remove("hidden")
    })
  })

  // Login form submission
  elements.loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById("login-username").value
    const password = document.getElementById("login-password").value

    // Mock login - in a real app, this would validate against a server
    login(username, password)
  })

  // Signup form submission
  elements.signupForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById("signup-username").value
    const email = document.getElementById("signup-email").value
    const password = document.getElementById("signup-password").value

    // Mock signup - in a real app, this would send data to a server
    signup(username, email, password)
  })

  // Logout button
  elements.logoutButton.addEventListener("click", logout)

  // Avatar options
  elements.avatarOptions.forEach((option) => {
    option.addEventListener("click", () => {
      elements.avatarOptions.forEach((opt) => opt.classList.remove("selected"))
      option.classList.add("selected")
    })
  })

  // Save avatar button
  elements.saveAvatarButton.addEventListener("click", () => {
    const selectedAvatar = document.querySelector(".avatar-option.selected")
    if (selectedAvatar) {
      const avatar = selectedAvatar.dataset.avatar
      if (appState.currentUser) {
        appState.currentUser.avatar = avatar
        saveUserData()
        updateUIForLoginState()
      }
      elements.avatarModal.classList.add("hidden")
    }
  })

  // Next question button
  elements.nextQuestionButton.addEventListener("click", () => {
    elements.resultModal.classList.add("hidden")
    loadNextQuestion()
  })

  // Handle hash changes for routing
  window.addEventListener("hashchange", handleRoute)
}

// Handle routing based on URL hash
function handleRoute() {
  const hash = window.location.hash || "#/"
  const route = hash.substring(1) // Remove the # character

  // Parse the route
  const parts = route.split("/").filter((part) => part !== "")
  const mainRoute = parts[0] || "home"

  // Handle different main routes
  switch (mainRoute) {
    case "quiz":
      if (parts.length > 1) {
        const quizId = Number.parseInt(parts[1])
        loadQuiz(quizId)
      }
      break
    case "admin":
      if (!appState.isLoggedIn) {
        navigateTo("home")
        elements.loginModal.classList.remove("hidden")
        return
      }

      const adminPage = parts.length > 1 ? parts[1] : "dashboard"
      loadAdminPage(adminPage)
      break
    default:
      loadPage(mainRoute)
      break
  }
}

// Navigate to a specific page
function navigateTo(page) {
  window.location.hash = `#/${page}`
}

// Load a specific page
function loadPage(page) {
  // Update current page in state
  appState.currentPage = page

  // Update active nav link
  elements.navLinks.forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })

  // Clear app container
  elements.appContainer.innerHTML = ""

  // Load appropriate template
  switch (page) {
    case "home":
      elements.appContainer.appendChild(templates.home.content.cloneNode(true))
      setupHomePageEvents()
      break
    case "profile":
      if (!appState.isLoggedIn) {
        navigateTo("home")
        elements.loginModal.classList.remove("hidden")
        return
      }
      elements.appContainer.appendChild(templates.profile.content.cloneNode(true))
      setupProfilePageEvents()
      updateProfileUI()
      break
    case "admin":
      if (!appState.isLoggedIn) {
        navigateTo("home")
        elements.loginModal.classList.remove("hidden")
        return
      }
      elements.appContainer.appendChild(templates.admin.content.cloneNode(true))
      setupAdminPageEvents()
      break
    default:
      // 404 page or redirect to home
      navigateTo("home")
      break
  }
}

// Load a specific quiz
function loadQuiz(quizId) {
  // Find the quiz by ID
  const quiz = appState.quizzes.find((q) => q.id === quizId)

  if (!quiz) {
    navigateTo("home")
    return
  }

  // Set current quiz in state
  appState.currentQuiz = quiz
  appState.currentQuestion = 0
  appState.userAnswers = []
  appState.score = 0
  appState.streak = 0

  // Update current page in state
  appState.currentPage = "quiz"

  // Clear app container
  elements.appContainer.innerHTML = ""

  // Load quiz template
  elements.appContainer.appendChild(templates.quiz.content.cloneNode(true))

  // Update quiz UI
  updateQuizUI()

  // Setup quiz events
  setupQuizEvents()

  // Start quiz timer
  startQuizTimer()
}

// Load a specific admin page
function loadAdminPage(adminPage) {
  // Update current admin page in state
  appState.currentAdminPage = adminPage

  // Clear app container
  elements.appContainer.innerHTML = ""

  // Load appropriate admin template
  switch (adminPage) {
    case "create-quiz":
      elements.appContainer.appendChild(templates.adminCreateQuiz.content.cloneNode(true))
      setupAdminCreateQuizEvents()
      break
    default:
      elements.appContainer.appendChild(templates.admin.content.cloneNode(true))
      setupAdminPageEvents()
      break
  }

  // Update active admin nav link
  const adminNavLinks = document.querySelectorAll(".admin-nav-link")
  adminNavLinks.forEach((link) => {
    if (link.dataset.adminPage === adminPage) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
}

// Setup events for the home page
function setupHomePageEvents() {
  // Filter functionality
  const difficultyFilter = document.getElementById("difficulty-filter")
  const categoryFilter = document.getElementById("category-filter")

  if (difficultyFilter && categoryFilter) {
    const filterQuizzes = () => {
      const difficulty = difficultyFilter.value
      const category = categoryFilter.value

      const quizCards = document.querySelectorAll(".quiz-card")
      quizCards.forEach((card) => {
        const cardDifficulty = card.dataset.difficulty
        const cardCategory = card.dataset.category

        const difficultyMatch = difficulty === "all" || cardDifficulty === difficulty
        const categoryMatch = category === "all" || cardCategory === category

        if (difficultyMatch && categoryMatch) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    }

    difficultyFilter.addEventListener("change", filterQuizzes)
    categoryFilter.addEventListener("change", filterQuizzes)
  }

  // Quiz start buttons
  const quizButtons = document.querySelectorAll("[data-quiz-id]")
  quizButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const quizId = Number.parseInt(button.dataset.quizId)
      navigateTo(`quiz/${quizId}`)
    })
  })
}

// Setup events for the profile page
function setupProfilePageEvents() {
  // Edit avatar button
  const editAvatarBtn = document.getElementById("edit-avatar-btn")
  if (editAvatarBtn) {
    editAvatarBtn.addEventListener("click", () => {
      elements.avatarModal.classList.remove("hidden")

      // Select current avatar if it exists
      if (appState.currentUser && appState.currentUser.avatar) {
        const currentAvatarOption = document.querySelector(
          `.avatar-option[data-avatar="${appState.currentUser.avatar}"]`,
        )
        if (currentAvatarOption) {
          elements.avatarOptions.forEach((opt) => opt.classList.remove("selected"))
          currentAvatarOption.classList.add("selected")
        }
      }
    })
  }

  // Profile form submission
  const profileForm = document.getElementById("profile-form")
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault()

      if (appState.currentUser) {
        appState.currentUser.username = document.getElementById("edit-username").value
        appState.currentUser.email = document.getElementById("edit-email").value

        const newPassword = document.getElementById("edit-password").value
        if (newPassword) {
          appState.currentUser.password = newPassword
        }

        appState.currentUser.bio = document.getElementById("edit-bio").value

        saveUserData()
        updateUIForLoginState()

        // Show success message
        alert("Profile updated successfully!")
      }
    })
  }
}

// Setup events for the admin page
function setupAdminPageEvents() {
  // Admin navigation links
  const adminNavLinks = document.querySelectorAll(".admin-nav-link")
  adminNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const adminPage = link.dataset.adminPage
      window.location.hash = `#/admin/${adminPage}`
    })
  })
}

// Setup events for the admin create quiz page
function setupAdminCreateQuizEvents() {
  // Add question button
  const addQuestionBtn = document.getElementById("add-question")
  if (addQuestionBtn) {
    addQuestionBtn.addEventListener("click", () => {
      const questionsContainer = document.getElementById("questions-container")
      const questionCount = questionsContainer.children.length + 1

      const questionCard = document.createElement("div")
      questionCard.className = "question-card"
      questionCard.dataset.questionId = questionCount

      questionCard.innerHTML = `
        <div class="question-header">
          <h3>Question ${questionCount}</h3>
          <button type="button" class="btn btn-icon remove-question" title="Remove Question">🗑️</button>
        </div>
        <div class="form-group">
          <label for="question-${questionCount}-text">Question Text</label>
          <textarea id="question-${questionCount}-text" class="question-text" rows="2" required placeholder="Enter your question"></textarea>
        </div>
        <div class="options-container">
          <div class="option-row">
            <div class="option-radio">
              <input type="radio" name="correct-${questionCount}" id="correct-${questionCount}-0" value="0" checked>
            </div>
            <div class="form-group">
              <label for="option-${questionCount}-0">Option A</label>
              <input type="text" id="option-${questionCount}-0" class="option-text" required placeholder="Option text">
            </div>
          </div>
          <div class="option-row">
            <div class="option-radio">
              <input type="radio" name="correct-${questionCount}" id="correct-${questionCount}-1" value="1">
            </div>
            <div class="form-group">
              <label for="option-${questionCount}-1">Option B</label>
              <input type="text" id="option-${questionCount}-1" class="option-text" required placeholder="Option text">
            </div>
          </div>
          <div class="option-row">
            <div class="option-radio">
              <input type="radio" name="correct-${questionCount}" id="correct-${questionCount}-2" value="2">
            </div>
            <div class="form-group">
              <label for="option-${questionCount}-2">Option C</label>
              <input type="text" id="option-${questionCount}-2" class="option-text" required placeholder="Option text">
            </div>
          </div>
          <div class="option-row">
            <div class="option-radio">
              <input type="radio" name="correct-${questionCount}" id="correct-${questionCount}-3" value="3">
            </div>
            <div class="form-group">
              <label for="option-${questionCount}-3">Option D</label>
              <input type="text" id="option-${questionCount}-3" class="option-text" required placeholder="Option text">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="explanation-${questionCount}">Explanation (Optional)</label>
          <textarea id="explanation-${questionCount}" class="explanation-text" rows="2" placeholder="Explain the correct answer"></textarea>
        </div>
      `

      questionsContainer.appendChild(questionCard)

      // Add event listener to the remove question button
      const removeBtn = questionCard.querySelector(".remove-question")
      removeBtn.addEventListener("click", () => {
        questionCard.remove()
        // Renumber the questions
        const questionCards = questionsContainer.querySelectorAll(".question-card")
        questionCards.forEach((card, index) => {
          const questionNum = index + 1
          card.dataset.questionId = questionNum
          card.querySelector("h3").textContent = `Question ${questionNum}`
        })
      })
    })
  }

  // Create quiz form submission
  const createQuizForm = document.getElementById("create-quiz-form")
  if (createQuizForm) {
    createQuizForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // In a real app, this would send the quiz data to a server
      alert("Quiz created successfully!")
      navigateTo("admin")
    })
  }
}

// Setup events for the quiz page
function setupQuizEvents() {
  // Option buttons
  const optionButtons = document.querySelectorAll(".option-btn")
  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (appState.questionTimer) {
        clearInterval(appState.questionTimer)
      }

      const selectedIndex = Number.parseInt(button.dataset.index)

      // In a real app, this would check against the correct answer from the server
      const isCorrect = selectedIndex === 1 // Mock correct answer (B)

      // Update score and streak
      if (isCorrect) {
        appState.score += 100 + appState.timeLeft * 5
        appState.streak++
      } else {
        appState.streak = 0
      }

      // Store user answer
      appState.userAnswers.push({
        questionIndex: appState.currentQuestion,
        selectedIndex,
        isCorrect,
      })

      // Show result modal
      const resultIcon = document.getElementById("result-icon")
      const resultMessage = document.getElementById("result-message")
      const eloChange = document.getElementById("elo-change")

      if (isCorrect) {
        resultIcon.textContent = "✓"
        resultIcon.className = "result-icon correct"
        resultMessage.textContent = "Correct!"
        eloChange.textContent = "+24 ELO"
      } else {
        resultIcon.textContent = "✗"
        resultIcon.className = "result-icon incorrect"
        resultMessage.textContent = "Incorrect!"
        eloChange.textContent = "-10 ELO"
      }

      elements.resultModal.classList.remove("hidden")
    })
  })
}

// Start the quiz timer
function startQuizTimer() {
  // Reset time left
  appState.timeLeft = 30

  // Update timer display
  const timerDisplay = document.getElementById("timer-display")
  const timerBar = document.getElementById("timer-bar")

  if (timerDisplay && timerBar) {
    timerDisplay.textContent = formatTime(appState.timeLeft)
    timerBar.style.width = "100%"

    // Start countdown
    appState.questionTimer = setInterval(() => {
      appState.timeLeft--

      // Update timer display
      timerDisplay.textContent = formatTime(appState.timeLeft)

      // Update timer bar
      const percentage = (appState.timeLeft / 30) * 100
      timerBar.style.width = `${percentage}%`

      // Change color based on time left
      if (appState.timeLeft <= 5) {
        timerBar.style.backgroundColor = "var(--error)"
      } else if (appState.timeLeft <= 10) {
        timerBar.style.backgroundColor = "var(--warning)"
      }

      // Time's up
      if (appState.timeLeft <= 0) {
        clearInterval(appState.questionTimer)
        handleTimeUp()
      }
    }, 1000)
  }
}

// Handle time up
function handleTimeUp() {
  // In a real app, this would handle the time up scenario
  // For now, just show the result modal with incorrect answer
  const resultIcon = document.getElementById("result-icon")
  const resultMessage = document.getElementById("result-message")
  const eloChange = document.getElementById("elo-change")

  resultIcon.textContent = "⏱️"
  resultIcon.className = "result-icon incorrect"
  resultMessage.textContent = "Time's Up!"
  eloChange.textContent = "-5 ELO"

  elements.resultModal.classList.remove("hidden")

  // Reset streak
  appState.streak = 0

  // Store user answer as timeout
  appState.userAnswers.push({
    questionIndex: appState.currentQuestion,
    selectedIndex: -1,
    isCorrect: false,
    timedOut: true,
  })
}

// Load the next question
function loadNextQuestion() {
  appState.currentQuestion++

  // Check if quiz is complete
  if (appState.currentQuestion >= 15) {
    // Mock quiz length
    showQuizComplete()
    return
  }

  // Update question number
  const currentQuestionEl = document.getElementById("current-question")
  if (currentQuestionEl) {
    currentQuestionEl.textContent = appState.currentQuestion + 1
  }

  // Update progress bar
  const progressBar = document.querySelector(".progress")
  if (progressBar) {
    const percentage = ((appState.currentQuestion + 1) / 15) * 100
    progressBar.style.width = `${percentage}%`
  }

  // In a real app, this would load the next question from the quiz data
  // For now, just reset the timer
  startQuizTimer()

  // Update streak display
  const currentStreak = document.getElementById("current-streak")
  if (currentStreak) {
    currentStreak.textContent = appState.streak > 0 ? `${appState.streak} 🔥` : "0"
  }

  // Update score display
  const currentScore = document.getElementById("current-score")
  if (currentScore) {
    currentScore.textContent = appState.score
  }
}

// Show quiz complete modal
function showQuizComplete() {
  // Calculate stats
  const totalQuestions = 15 // Mock quiz length
  const correctAnswers = appState.userAnswers.filter((answer) => answer.isCorrect).length
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100)

  // Update quiz complete modal
  const scoreValue = document.querySelector(".quiz-complete-modal .score-value")
  if (scoreValue) {
    scoreValue.textContent = appState.score
  }

  const statValues = document.querySelectorAll(".quiz-complete-modal .stat-value")
  if (statValues.length >= 4) {
    statValues[0].textContent = `${correctAnswers}/${totalQuestions}`
    statValues[1].textContent = `${accuracy}%`
    statValues[2].textContent = "8:24" // Mock time
    statValues[3].textContent = "+45" // Mock ELO gain
  }

  // Show the modal
  elements.quizCompleteModal.classList.remove("hidden")

  // In a real app, this would save the quiz results to the user's profile
}

// Update the quiz UI
function updateQuizUI() {
  if (!appState.currentQuiz) return

  // Update quiz title and meta
  const quizTitle = document.getElementById("quiz-title")
  const difficultyBadge = document.querySelector(".quiz-meta .difficulty")
  const questionsCount = document.querySelector(".quiz-meta .questions-count")
  const timeEstimate = document.querySelector(".quiz-meta .time-estimate")

  if (quizTitle) quizTitle.textContent = appState.currentQuiz.title
  if (difficultyBadge) {
    difficultyBadge.textContent =
      appState.currentQuiz.difficulty.charAt(0).toUpperCase() + appState.currentQuiz.difficulty.slice(1)
    difficultyBadge.className = `difficulty ${appState.currentQuiz.difficulty}`
  }
  if (questionsCount) questionsCount.textContent = `${appState.currentQuiz.questions} Questions`
  if (timeEstimate) timeEstimate.textContent = appState.currentQuiz.timeEstimate

  // Update question number and total
  const currentQuestionEl = document.getElementById("current-question")
  const totalQuestionsEl = document.getElementById("total-questions")

  if (currentQuestionEl) currentQuestionEl.textContent = appState.currentQuestion + 1
  if (totalQuestionsEl) totalQuestionsEl.textContent = appState.currentQuiz.questions

  // Update progress bar
  const progressBar = document.querySelector(".progress")
  if (progressBar) {
    const percentage = ((appState.currentQuestion + 1) / appState.currentQuiz.questions) * 100
    progressBar.style.width = `${percentage}%`
  }
}

// Update the profile UI
function updateProfileUI() {
  if (!appState.currentUser) return

  // Update profile info
  const profileUsername = document.getElementById("profile-username")
  const profileAvatar = document.getElementById("profile-avatar")
  const editUsername = document.getElementById("edit-username")
  const editEmail = document.getElementById("edit-email")
  const editBio = document.getElementById("edit-bio")

  if (profileUsername) profileUsername.textContent = appState.currentUser.username
  if (profileAvatar) profileAvatar.textContent = appState.currentUser.avatar || "👤"
  if (editUsername) editUsername.value = appState.currentUser.username
  if (editEmail) editEmail.value = appState.currentUser.email || ""
  if (editBio) editBio.value = appState.currentUser.bio || ""
}

// Update UI based on login state
function updateUIForLoginState() {
  if (appState.isLoggedIn) {
    elements.loginButton.classList.add("hidden")
    elements.userDropdown.classList.remove("hidden")
    elements.usernameDisplay.textContent = appState.currentUser.username

    // Update avatar in dropdown
    const avatarElement = elements.userDropdown.querySelector(".avatar")
    if (avatarElement) {
      avatarElement.textContent = appState.currentUser.avatar || "👤"
    }
  } else {
    elements.loginButton.classList.remove("hidden")
    elements.userDropdown.classList.add("hidden")
  }
}

// Mock login function
function login(username, password) {
  // In a real app, this would validate against a server
  appState.currentUser = {
    username,
    password,
    avatar: "👤",
    elo: 1000,
    quizzesTaken: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  }

  appState.isLoggedIn = true
  saveUserData()
  updateUIForLoginState()
  elements.loginModal.classList.add("hidden")
}

// Mock signup function
function signup(username, email, password) {
  // In a real app, this would send data to a server
  appState.currentUser = {
    username,
    email,
    password,
    avatar: "👤",
    elo: 1000,
    quizzesTaken: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  }

  appState.isLoggedIn = true
  saveUserData()
  updateUIForLoginState()
  elements.loginModal.classList.add("hidden")
}

// Logout function
function logout() {
  appState.currentUser = null
  appState.isLoggedIn = false
  saveUserData()
  updateUIForLoginState()
  navigateTo("home")
}

// Format time (seconds) to MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", init)
