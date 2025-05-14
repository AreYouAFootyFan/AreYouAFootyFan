import "./AdminSidebar.js";
import "./AdminStats.js";
import "./AdminTable.js";
import "./AdminModal.js";
import "./AdminCard.js";
import "./AdminNotification.js";
import { StyleLoader } from "../../utils/cssLoader.js";
import { Role } from "../../enums/users.js";
import { clearDOM } from "../../utils/domHelpers.js";

class AdminDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.quizzes = [];
    this.categories = [];
    this.viewMode = "dashboard";

    this.changeView = this.changeView.bind(this);
    this.showCategoryModal = this.showCategoryModal.bind(this);
    this.handleCategorySubmit = this.handleCategorySubmit.bind(this);
    this.confirmDeleteCategory = this.confirmDeleteCategory.bind(this);
    this.confirmDeleteQuiz = this.confirmDeleteQuiz.bind(this);

    this.styleSheet = new CSSStyleSheet();
  }

  async connectedCallback() {
    await this.loadStyles();
    this.render();
    this.setupEventListeners();

    this.checkAuthorization();
  }

  async loadStyles() {
    await StyleLoader(
      this.shadowRoot,
      "./static/css/styles.css",
      "./static/css/admin/shared.css",
      "./static/css/admin/adminDashboard.css"
    );
  }

  render() {
    clearDOM(this.shadowRoot);

    const main = document.createElement("main");
    main.className = "admin-page";

    const adminContainer = document.createElement("section");
    adminContainer.className = "admin-container";

    const sidebar = document.createElement("admin-sidebar");
    sidebar.setAttribute("active-view", this.viewMode);

    adminContainer.appendChild(sidebar);

    const adminContent = document.createElement("section");
    adminContent.className = "admin-content";

    const dashboardView = this.createDashboardView();
    adminContent.appendChild(dashboardView);

    const quizzesView = this.createQuizzesView();
    adminContent.appendChild(quizzesView);

    const categoriesView = this.createCategoriesView();
    adminContent.appendChild(categoriesView);

    adminContainer.appendChild(adminContent);
    main.appendChild(adminContainer);

    const categoryModal = this.createCategoryModal();
    const confirmModal = this.createConfirmModal();

    const notification = document.createElement("admin-notification");
    notification.id = "notification-toast";

    this.shadowRoot.appendChild(main);
    this.shadowRoot.appendChild(categoryModal);
    this.shadowRoot.appendChild(confirmModal);
    this.shadowRoot.appendChild(notification);
  }

  createDashboardView() {
    const dashboardView = document.createElement("section");
    dashboardView.id = "dashboard-view";
    dashboardView.className = `admin-view ${
      this.viewMode === "dashboard" ? "" : "hidden"
    }`;

    const dashboardHeader = document.createElement("header");
    dashboardHeader.className = "admin-header";

    const dashboardTitle = document.createElement("h1");
    dashboardTitle.textContent = `${Role.Manager} Dashboard`;

    const adminActions = document.createElement("section");
    adminActions.className = "admin-actions";

    const createQuizLink = document.createElement("a");
    createQuizLink.href = "/create-quiz";
    createQuizLink.className = "admin-btn primary-btn";
    createQuizLink.dataset.link = "";
    createQuizLink.textContent = "Create New Quiz";

    adminActions.appendChild(createQuizLink);
    dashboardHeader.appendChild(dashboardTitle);
    dashboardHeader.appendChild(adminActions);

    dashboardView.appendChild(dashboardHeader);

    const adminStats = document.createElement("admin-stats");
    adminStats.id = "admin-stats";
    dashboardView.appendChild(adminStats);

    const adminCards = document.createElement("section");
    adminCards.className = "admin-cards";

    const recentQuizzesCard = document.createElement("admin-card");
    recentQuizzesCard.setAttribute("title", "Recently Created Quizzes");
    recentQuizzesCard.setAttribute("action", "View All");
    recentQuizzesCard.setAttribute("action-view", "quizzes");

    const quizzesLoading = document.createElement("p");
    quizzesLoading.className = "loading-text";
    quizzesLoading.setAttribute("slot", "content");
    quizzesLoading.textContent = "Loading quizzes...";

    recentQuizzesCard.appendChild(quizzesLoading);

    const categoriesCard = document.createElement("admin-card");
    categoriesCard.setAttribute("title", "Categories");
    categoriesCard.setAttribute("action", "View All");
    categoriesCard.setAttribute("action-view", "categories");

    const categoriesLoading = document.createElement("p");
    categoriesLoading.className = "loading-text";
    categoriesLoading.setAttribute("slot", "content");
    categoriesLoading.textContent = "Loading categories...";

    categoriesCard.appendChild(categoriesLoading);

    adminCards.appendChild(recentQuizzesCard);
    adminCards.appendChild(categoriesCard);

    dashboardView.appendChild(adminCards);

    return dashboardView;
  }

  createQuizzesView() {
    const quizzesView = document.createElement("section");
    quizzesView.id = "quizzes-view";
    quizzesView.className = `admin-view ${
      this.viewMode === "quizzes" ? "" : "hidden"
    }`;

    const quizzesHeader = document.createElement("header");
    quizzesHeader.className = "admin-header";

    const quizzesTitle = document.createElement("h1");
    quizzesTitle.textContent = "Quiz Management";

    const quizzesActions = document.createElement("section");
    quizzesActions.className = "admin-actions";

    const createQuizLink = document.createElement("a");
    createQuizLink.href = "/create-quiz";
    createQuizLink.className = "admin-btn primary-btn";
    createQuizLink.dataset.link = "";
    createQuizLink.textContent = "Create New Quiz";

    quizzesActions.appendChild(createQuizLink);
    quizzesHeader.appendChild(quizzesTitle);
    quizzesHeader.appendChild(quizzesActions);

    quizzesView.appendChild(quizzesHeader);

    const quizzesCard = document.createElement("admin-card");
    quizzesCard.setAttribute("full-width", "");

    const quizzesList = document.createElement("p");
    quizzesList.id = "quizzes-list";
    quizzesList.className = "loading-text";
    quizzesList.setAttribute("slot", "content");
    quizzesList.textContent = "Loading quizzes...";

    quizzesCard.appendChild(quizzesList);

    quizzesView.appendChild(quizzesCard);

    return quizzesView;
  }

  createCategoriesView() {
    const categoriesView = document.createElement("section");
    categoriesView.id = "categories-view";
    categoriesView.className = `admin-view ${
      this.viewMode === "categories" ? "" : "hidden"
    }`;

    const categoriesHeader = document.createElement("header");
    categoriesHeader.className = "admin-header";

    const categoriesTitle = document.createElement("h1");
    categoriesTitle.textContent = "Category Management";

    const categoriesActions = document.createElement("section");
    categoriesActions.className = "admin-actions";

    const addCategoryBtn = document.createElement("button");
    addCategoryBtn.id = "add-category-btn";
    addCategoryBtn.className = "admin-btn primary-btn";
    addCategoryBtn.textContent = "Add Category";

    categoriesActions.appendChild(addCategoryBtn);
    categoriesHeader.appendChild(categoriesTitle);
    categoriesHeader.appendChild(categoriesActions);

    categoriesView.appendChild(categoriesHeader);

    const categoriesCard = document.createElement("admin-card");
    categoriesCard.setAttribute("full-width", "");

    const categoriesList = document.createElement("p");
    categoriesList.id = "categories-list";
    categoriesList.className = "loading-text";
    categoriesList.setAttribute("slot", "content");
    categoriesList.textContent = "Loading categories...";

    categoriesCard.appendChild(categoriesList);

    categoriesView.appendChild(categoriesCard);

    return categoriesView;
  }

  createCategoryModal() {
    const categoryModal = document.createElement("admin-modal");
    categoryModal.id = "category-modal";
    categoryModal.setAttribute("title", "Add New Category");

    const form = document.createElement("form");
    form.id = "category-form";
    form.setAttribute("slot", "content");

    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "category-id";
    hiddenInput.value = "";

    const nameGroup = document.createElement("section");
    nameGroup.className = "form-group";

    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "category-name");
    nameLabel.textContent = "Category Name";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "category-name";
    nameInput.required = true;
    nameInput.maxLength = 32;

    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    const descGroup = document.createElement("section");
    descGroup.className = "form-group";

    const descLabel = document.createElement("label");
    descLabel.setAttribute("for", "category-description");
    descLabel.textContent = "Description";

    const descInput = document.createElement("input");
    descInput.type = "text";
    descInput.id = "category-description";
    descInput.maxLength = 64;

    descGroup.appendChild(descLabel);
    descGroup.appendChild(descInput);

    const formActions = document.createElement("section");
    formActions.className = "form-actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.id = "cancel-category";
    cancelBtn.className = "admin-btn secondary-btn";
    cancelBtn.textContent = "Cancel";

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "admin-btn primary-btn";
    submitBtn.textContent = "Save Category";

    formActions.appendChild(cancelBtn);
    formActions.appendChild(submitBtn);

    form.appendChild(hiddenInput);
    form.appendChild(nameGroup);
    form.appendChild(descGroup);
    form.appendChild(formActions);

    categoryModal.appendChild(form);

    return categoryModal;
  }

  createConfirmModal() {
    const confirmModal = document.createElement("admin-modal");
    confirmModal.id = "confirm-modal";
    confirmModal.setAttribute("title", "Confirm Action");

    const content = document.createElement("section");
    content.setAttribute("slot", "content");

    const message = document.createElement("p");
    message.id = "confirm-message";
    message.textContent = "Are you sure you want to proceed?";

    const actions = document.createElement("section");
    actions.className = "form-actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancel-confirm";
    cancelBtn.className = "admin-btn secondary-btn";
    cancelBtn.textContent = "Cancel";

    const confirmBtn = document.createElement("button");
    confirmBtn.id = "confirm-action";
    confirmBtn.className = "admin-btn primary-btn danger-btn";
    confirmBtn.textContent = "Confirm";

    actions.appendChild(cancelBtn);
    actions.appendChild(confirmBtn);

    content.appendChild(message);
    content.appendChild(actions);

    confirmModal.appendChild(content);

    return confirmModal;
  }

  setupEventListeners() {
    const sidebar = this.shadowRoot.querySelector("admin-sidebar");
    if (sidebar) {
      sidebar.addEventListener("change-view", (e) => {
        this.changeView(e.detail.view);
      });
    }

    const cards = this.shadowRoot.querySelectorAll("admin-card");
    cards.forEach((card) => {
      card.addEventListener("action-click", (e) => {
        this.changeView(e.detail.view);
      });
    });

    const addCategoryBtn = this.shadowRoot.querySelector("#add-category-btn");
    if (addCategoryBtn) {
      addCategoryBtn.addEventListener("click", this.showCategoryModal);
    }

    const categoryForm = this.shadowRoot.querySelector("#category-form");
    if (categoryForm) {
      categoryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCategorySubmit();
      });
    }

    const cancelCategoryBtn = this.shadowRoot.querySelector("#cancel-category");
    if (cancelCategoryBtn) {
      cancelCategoryBtn.addEventListener("click", () => {
        const categoryModal = this.shadowRoot.querySelector("#category-modal");
        if (categoryModal) categoryModal.hide();
      });
    }

    const cancelConfirmBtn = this.shadowRoot.querySelector("#cancel-confirm");
    if (cancelConfirmBtn) {
      cancelConfirmBtn.addEventListener("click", () => {
        const confirmModal = this.shadowRoot.querySelector("#confirm-modal");
        if (confirmModal) confirmModal.hide();
      });
    }

    const links = this.shadowRoot.querySelectorAll("[data-link]");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.history.pushState(null, null, link.getAttribute("href"));
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
    });
  }

  async checkAuthorization() {
    const authService = window.authService;

    try {
      const isAuthenticated = await authService.checkAuthentication();
      if (!isAuthenticated) {
        window.location.href = "/login";
        return;
      }

      if (!authService.isQuizMaster()) {
        window.location.href = "/home";
        return;
      }

      this.loadInitialData();
    } catch (error) {
      window.location.href = "/login";
    }
  }

  loadInitialData() {
    setTimeout(() => {
      this.loadStats();
      this.loadQuizzes();
      this.loadCategories();
      setTimeout(() => {
        this.loadRecentQuizzes();
        this.loadRecentCategories();
      }, 300);
    }, 100);
  }

  changeView(viewName) {
    this.viewMode = viewName;

    const sidebar = this.shadowRoot.querySelector("admin-sidebar");
    if (sidebar) {
      sidebar.setAttribute("active-view", viewName);
    }

    const views = this.shadowRoot.querySelectorAll(".admin-view");
    views.forEach((view) => {
      view.classList.add("hidden");
    });

    const activeView = this.shadowRoot.querySelector(`#${viewName}-view`);
    if (activeView) {
      activeView.classList.remove("hidden");
    }

    if (viewName === "dashboard") {
      this.loadStats();
      this.loadRecentQuizzes();
      this.loadRecentCategories();
    } else if (viewName === "quizzes") {
      this.loadQuizzes();
    } else if (viewName === "categories") {
      this.loadCategories();
    }
  }

  async loadStats() {
    const statsComponent = this.shadowRoot.querySelector("#admin-stats");
    if (!statsComponent) return;

    try {
      const statsService = window.statsService;
      if (statsService) {
        const stats = await statsService.getDashboardStats();
        statsComponent.setStats(stats);
      }
    } catch (error) {
      statsComponent.setError(error);
    }
  }

  async loadQuizzes() {
    try {
      const quizzesContainer = this.shadowRoot.querySelector("#quizzes-list");
      if (!quizzesContainer) return;

      quizzesContainer.innerHTML = "";
      const loadingText = document.createElement("p");
      loadingText.className = "loading-text";
      loadingText.textContent = "Loading quizzes...";
      quizzesContainer.appendChild(loadingText);

      if (!window.quizService || !window.quizValidatorService) {
        throw new Error("Quiz services not available");
      }

      this.quizzes = await window.quizService.getAllQuizzes();
      for (let i = 0; i < this.quizzes.length; i++) {
        const quiz = this.quizzes[i];
        try {
          const validation = await window.quizValidatorService.validateQuiz(
            quiz.quiz_id
          );

          quiz.valid_questions = validation.valid_questions;
          quiz.question_count = validation.total_questions;
          quiz.is_valid =
            quiz.valid_questions >= 5 &&
            quiz.valid_questions == quiz.question_count;
          quiz.validation_message = validation.validation_message;
        } catch (error) {
          quiz.valid_questions = 0;
          quiz.question_count = 0;
          quiz.is_valid = false;
          quiz.validation_message = "Unable to validate quiz";
        }
      }

      quizzesContainer.innerHTML = "";

      if (this.quizzes.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No quizzes found. Create your first quiz!";
        quizzesContainer.appendChild(emptyMessage);
        return;
      }

      const table = document.createElement("admin-table");
      table.columns = [
        { key: "quiz_title", title: "Quiz Name" },
        { key: "category_name", title: "Category" },
        { key: "status", title: "Status" },
        { key: "question_count", title: "Questions" },
        { key: "actions", title: "Actions" },
      ];

      table.data = this.quizzes.map((quiz) => {
        const isValid = quiz.is_valid;
        const statusClass = isValid ? "valid-status" : "invalid-status";
        const statusText = isValid ? "Live" : `Not Live`;

        return {
          quiz_title: quiz.quiz_title,
          category_name: quiz.category_name || "Uncategorized",
          status: {
            type: "badge",
            value: statusText,
            class: statusClass,
          },
          question_count: quiz.question_count || 0,
          actions: {
            type: "actions",
            items: [
              {
                type: "button",
                icon: "📝",
                title: "Manage Questions",
                action: "manage-questions",
                data: {
                  id: quiz.quiz_id,
                  title: quiz.quiz_title,
                },
              },
              {
                type: "button",
                icon: "🗑️",
                title: "Delete Quiz",
                action: "delete-quiz",
                data: {
                  id: quiz.quiz_id,
                  title: quiz.quiz_title,
                },
              },
            ],
          },
        };
      });

      table.addEventListener("action", (e) => {
        const { action, data } = e.detail;

        if (action === "manage-questions") {
          this.handleManageQuestions(data.id, data.title);
        } else if (action === "delete-quiz") {
          this.confirmDeleteQuiz(data.id, data.title);
        }
      });

      quizzesContainer.appendChild(table);
    } catch (error) {
      const quizzesContainer = this.shadowRoot.querySelector("#quizzes-list");
      if (quizzesContainer) {
        quizzesContainer.innerHTML = "";
        const errorMessage = document.createElement("p");
        errorMessage.className = "error-message";
        errorMessage.textContent =
          "Error loading quizzes. Please try again later.";
        quizzesContainer.appendChild(errorMessage);
      }
    }
  }

  async loadRecentQuizzes() {
    try {
      const dashboardView = this.shadowRoot.querySelector("#dashboard-view");
      if (!dashboardView) return;

      const quizzesCard = dashboardView.querySelector(
        "admin-card:first-of-type"
      );
      const contentSlot = quizzesCard.querySelector('[slot="content"]');

      contentSlot.innerHTML = "";
      const loadingText = document.createElement("p");
      loadingText.className = "loading-text";
      loadingText.textContent = "Loading quizzes...";
      contentSlot.appendChild(loadingText);

      if (this.quizzes.length === 0 && window.quizService) {
        this.quizzes = await window.quizService.getAllQuizzes();
      }

      contentSlot.innerHTML = "";

      if (this.quizzes.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No quizzes found. Create your first quiz!";
        contentSlot.appendChild(emptyMessage);
        return;
      }

      const recentQuizzes = this.quizzes.slice(0, 5);

      const table = document.createElement("admin-table");
      table.columns = [
        { key: "quiz_title", title: "Quiz Name" },
        { key: "status", title: "Status" },
        { key: "actions", title: "Actions" },
      ];

      table.data = recentQuizzes.map((quiz) => {
        return {
          quiz_title: quiz.quiz_title,
          status: {
            type: "badge",
            value: quiz.is_valid ? "Live" : "Not Live",
            class: quiz.is_valid ? "valid-status" : "invalid-status",
          },
          actions: {
            type: "actions",
            items: [
              {
                type: "button",
                icon: "📝",
                title: "Manage Questions",
                action: "manage-questions",
                data: {
                  id: quiz.quiz_id,
                  title: quiz.quiz_title,
                },
              },
            ],
          },
        };
      });

      table.addEventListener("action", (e) => {
        const { action, data } = e.detail;

        if (action === "manage-questions") {
          this.handleManageQuestions(data.id, data.title);
        }
      });

      contentSlot.appendChild(table);
    } catch (error) {
      const dashboardView = this.shadowRoot.querySelector("#dashboard-view");
      if (dashboardView) {
        const quizzesCard = dashboardView.querySelector(
          "admin-card:first-of-type"
        );
        const contentSlot = quizzesCard.querySelector('[slot="content"]');
        contentSlot.innerHTML = "";
        const errorMessage = document.createElement("p");
        errorMessage.className = "error-message";
        errorMessage.textContent =
          "Error loading quizzes. Please try again later.";
        contentSlot.appendChild(errorMessage);
      }
    }
  }

  async loadCategories() {
    try {
      const categoriesContainer =
        this.shadowRoot.querySelector("#categories-list");
      if (!categoriesContainer) return;

      categoriesContainer.innerHTML = "";
      const loadingText = document.createElement("p");
      loadingText.className = "loading-text";
      loadingText.textContent = "Loading categories...";
      categoriesContainer.appendChild(loadingText);

      if (!window.categoryService) {
        throw new Error("Category service not available");
      }

      this.categories = await window.categoryService.getAllCategories();

      categoriesContainer.innerHTML = "";

      if (this.categories.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent =
          "No categories found. Add your first category!";
        categoriesContainer.appendChild(emptyMessage);
        return;
      }

      const table = document.createElement("admin-table");
      table.columns = [
        { key: "category_name", title: "Category Name" },
        { key: "category_description", title: "Description" },
        { key: "actions", title: "Actions" },
      ];

      table.data = this.categories.map((category) => {
        return {
          category_name: category.category_name,
          category_description:
            category.category_description || "No description",
          actions: {
            type: "actions",
            items: [
              {
                type: "button",
                icon: "✏️",
                title: "Edit Category",
                action: "edit-category",
                data: {
                  id: category.category_id,
                },
              },
              {
                type: "button",
                icon: "🗑️",
                title: "Delete Category",
                action: "delete-category",
                data: {
                  id: category.category_id,
                  name: category.category_name,
                },
              },
            ],
          },
        };
      });

      table.addEventListener("action", (e) => {
        const { action, data } = e.detail;

        if (action === "edit-category") {
          this.handleEditCategory(data.id);
        } else if (action === "delete-category") {
          this.confirmDeleteCategory(data.id, data.name);
        }
      });

      categoriesContainer.appendChild(table);
    } catch (error) {
      const categoriesContainer =
        this.shadowRoot.querySelector("#categories-list");
      if (categoriesContainer) {
        categoriesContainer.innerHTML = "";
        const errorMessage = document.createElement("p");
        errorMessage.className = "error-message";
        errorMessage.textContent =
          "Error loading categories. Please try again later.";
        categoriesContainer.appendChild(errorMessage);
      }
    }
  }

  async loadRecentCategories() {
    try {
      const dashboardView = this.shadowRoot.querySelector("#dashboard-view");
      if (!dashboardView) return;

      const categoriesCard = dashboardView.querySelector(
        "admin-card:nth-of-type(2)"
      );
      const contentSlot = categoriesCard.querySelector('[slot="content"]');

      contentSlot.innerHTML = "";
      const loadingText = document.createElement("p");
      loadingText.className = "loading-text";
      loadingText.textContent = "Loading categories...";
      contentSlot.appendChild(loadingText);

      if (this.categories.length === 0 && window.categoryService) {
        this.categories = await window.categoryService.getAllCategories();
      }

      contentSlot.innerHTML = "";

      if (this.categories.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent =
          "No categories found. Add your first category!";
        contentSlot.appendChild(emptyMessage);
        return;
      }

      const recentCategories = this.categories.slice(0, 5);

      const table = document.createElement("admin-table");
      table.columns = [
        { key: "category_name", title: "Category Name" },
        { key: "category_description", title: "Description" },
      ];

      table.data = recentCategories.map((category) => {
        return {
          category_name: category.category_name,
          category_description:
            category.category_description || "No description",
        };
      });

      contentSlot.appendChild(table);
    } catch (error) {
      const dashboardView = this.shadowRoot.querySelector("#dashboard-view");
      if (dashboardView) {
        const categoriesCard = dashboardView.querySelector(
          "admin-card:nth-of-type(2)"
        );
        const contentSlot = categoriesCard.querySelector('[slot="content"]');
        contentSlot.innerHTML = "";
        const errorMessage = document.createElement("p");
        errorMessage.className = "error-message";
        errorMessage.textContent =
          "Error loading categories. Please try again later.";
        contentSlot.appendChild(errorMessage);
      }
    }
  }

  handleManageQuestions(quizId, quizTitle) {
    localStorage.setItem("selected_quiz_id", quizId);
    localStorage.setItem("selected_quiz_title", quizTitle);
    window.location.href = "/create-quiz";
  }

  confirmDeleteQuiz(quizId, quizTitle) {
    const confirmModal = this.shadowRoot.querySelector("#confirm-modal");
    const confirmMessage = this.shadowRoot.querySelector("#confirm-message");
    const confirmAction = this.shadowRoot.querySelector("#confirm-action");

    if (!confirmModal || !confirmMessage || !confirmAction) return;

    confirmMessage.textContent = `Are you sure you want to delete the quiz "${quizTitle}"?`;

    confirmAction.onclick = () => this.handleDeleteQuiz(quizId);

    confirmModal.show();
  }

  async handleDeleteQuiz(quizId) {
    try {
      if (!window.quizService) {
        throw new Error("Quiz service not available");
      }

      await window.quizService.deleteQuiz(quizId);

      this.showNotification("Quiz deleted successfully");

      this.loadQuizzes();
      if (this.viewMode === "dashboard") {
        this.loadRecentQuizzes();
      }

      const confirmModal = this.shadowRoot.querySelector("#confirm-modal");
      if (confirmModal) confirmModal.hide();
    } catch (error) {
      this.showNotification(
        "Failed to delete quiz: " + (error.message || "Unknown error"),
        "error"
      );

      const confirmModal = this.shadowRoot.querySelector("#confirm-modal");
      if (confirmModal) confirmModal.hide();
    }
  }

  handleEditCategory(categoryId) {
    const category = this.categories.find((c) => c.category_id == categoryId);
    if (!category) return;

    const categoryModal = this.shadowRoot.querySelector("#category-modal");
    const modalTitle = categoryModal.shadowRoot.querySelector("h2");
    const categoryIdInput = this.shadowRoot.querySelector("#category-id");
    const categoryNameInput = this.shadowRoot.querySelector("#category-name");
    const categoryDescriptionInput = this.shadowRoot.querySelector(
      "#category-description"
    );

    if (modalTitle) modalTitle.textContent = "Edit Category";
    if (categoryIdInput) categoryIdInput.value = category.category_id;
    if (categoryNameInput) categoryNameInput.value = category.category_name;
    if (categoryDescriptionInput)
      categoryDescriptionInput.value = category.category_description || "";

    categoryModal.show();
  }

  confirmDeleteCategory(categoryId, categoryName) {
    const confirmModal = this.shadowRoot.querySelector("#confirm-modal");
    const confirmMessage = this.shadowRoot.querySelector("#confirm-message");
    const confirmAction = this.shadowRoot.querySelector("#confirm-action");

    if (!confirmModal || !confirmMessage || !confirmAction) return;

    confirmMessage.textContent = `Are you sure you want to delete the category "${categoryName}"? All associated quizzes will be lost.`;

    confirmAction.onclick = () => this.handleDeleteCategory(categoryId);

    confirmModal.show();
  }

  async handleDeleteCategory(categoryId) {
    try {
      if (!window.categoryService) {
        throw new Error("Category service not available");
      }

      await window.categoryService.deleteCategory(categoryId);

      this.showNotification("Category deleted successfully");

      this.loadCategories();
      if (this.viewMode === "dashboard") {
        this.loadRecentCategories();
      }

      const confirmModal = this.shadowRoot.querySelector("#confirm-modal");
      if (confirmModal) confirmModal.hide();
    } catch (error) {
      this.showNotification(
        "Failed to delete category: " + (error.message || "Unknown error"),
        "error"
      );

      const confirmModal = this.shadowRoot.querySelector("#confirm-modal");
      if (confirmModal) confirmModal.hide();
    }
  }

  showCategoryModal() {
    const categoryModal = this.shadowRoot.querySelector("#category-modal");
    const modalTitle = categoryModal.shadowRoot.querySelector("h2");
    const categoryIdInput = this.shadowRoot.querySelector("#category-id");
    const categoryNameInput = this.shadowRoot.querySelector("#category-name");
    const categoryDescriptionInput = this.shadowRoot.querySelector(
      "#category-description"
    );

    if (modalTitle) modalTitle.textContent = "Add New Category";
    if (categoryIdInput) categoryIdInput.value = "";
    if (categoryNameInput) categoryNameInput.value = "";
    if (categoryDescriptionInput) categoryDescriptionInput.value = "";

    categoryModal.show();
  }

  async handleCategorySubmit() {
    const categoryIdInput = this.shadowRoot.querySelector("#category-id");
    const categoryNameInput = this.shadowRoot.querySelector("#category-name");
    const categoryDescriptionInput = this.shadowRoot.querySelector(
      "#category-description"
    );

    if (!categoryNameInput) return;

    const categoryId = categoryIdInput.value;
    const categoryName = categoryNameInput.value.trim();
    const categoryDescription = categoryDescriptionInput.value.trim();

    if (!categoryName) {
      this.showNotification("Category name is required", "error");
      return;
    }

    try {
      if (!window.categoryService) {
        throw new Error("Category service not available");
      }

      if (categoryId) {
        await window.categoryService.updateCategory(categoryId, {
          category_name: categoryName,
          category_description: categoryDescription,
        });
        this.showNotification("Category updated successfully");
      } else {
        await window.categoryService.createCategory({
          category_name: categoryName,
          category_description: categoryDescription,
        });
        this.showNotification("Category created successfully");
      }

      this.loadCategories();
      if (this.viewMode === "dashboard") {
        this.loadRecentCategories();
      }

      const categoryModal = this.shadowRoot.querySelector("#category-modal");
      if (categoryModal) categoryModal.hide();
    } catch (error) {
      this.showNotification(
        "Failed to save category: " + (error.message || "Unknown error"),
        "error"
      );
    }
  }

  showNotification(message, type = "success") {
    const toast = this.shadowRoot.querySelector("#notification-toast");
    if (toast) {
      toast.show(message, type);
    }
  }
}

customElements.define("admin-dashboard", AdminDashboard);

export default AdminDashboard;
