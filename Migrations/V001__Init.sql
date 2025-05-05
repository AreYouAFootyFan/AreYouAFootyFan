CREATE TABLE IF NOT EXISTS roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  google_id VARCHAR(256) UNIQUE,
  username VARCHAR(16) UNIQUE,
  role_id INTEGER REFERENCES roles(role_id),
  deactivated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(32) UNIQUE NOT NULL,
  category_description VARCHAR(64),
  deactivated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS difficulty_levels (
  difficulty_id SERIAL PRIMARY KEY,
  difficulty_level VARCHAR(16) UNIQUE NOT NULL,
  time_limit_seconds INTEGER NOT NULL,
  points_on_correct INTEGER NOT NULL,
  points_on_incorrect INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS quizzes (
  quiz_id SERIAL PRIMARY KEY,
  quiz_title VARCHAR(64) NOT NULL,
  quiz_description VARCHAR(128),
  category_id INTEGER REFERENCES categories(category_id),
  created_by INTEGER REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deactivated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  question_id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(quiz_id) NOT NULL,
  question_text VARCHAR(256) NOT NULL,
  difficulty_id INTEGER REFERENCES difficulty_levels(difficulty_id) NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
  answer_id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(question_id) NOT NULL,
  answer_text VARCHAR(128) NOT NULL,
  is_correct BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  attempt_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) NOT NULL,
  quiz_id INTEGER REFERENCES quizzes(quiz_id) NOT NULL,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS user_responses (
  response_id SERIAL PRIMARY KEY,
  attempt_id INTEGER REFERENCES quiz_attempts(attempt_id) NOT NULL,
  question_id INTEGER REFERENCES questions(question_id) NOT NULL,
  answer_id INTEGER REFERENCES answers(answer_id) NOT NULL,
  points_earned INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS badges (
  badge_id SERIAL PRIMARY KEY,
  badge_name VARCHAR(32) UNIQUE NOT NULL,
  minimum_points INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS badge_history (
  badge_history_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) NOT NULL,
  badge_id INTEGER REFERENCES badges(badge_id) NOT NULL,
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
