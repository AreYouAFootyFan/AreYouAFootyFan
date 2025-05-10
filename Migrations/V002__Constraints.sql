-- users
ALTER TABLE users ADD CONSTRAINT chk_username_not_empty CHECK (
  username IS NULL
  OR CHAR_LENGTH(username) > 0
),
ADD CONSTRAINT chk_google_id_not_empty CHECK (CHAR_LENGTH(google_id) > 0);

-- categories
ALTER TABLE categories ADD CONSTRAINT chk_category_name_not_empty CHECK (CHAR_LENGTH(category_name) > 0),
ADD CONSTRAINT chk_category_description_not_empty CHECK (CHAR_LENGTH(category_description) > 0);

-- quizzes
ALTER TABLE quizzes ADD CONSTRAINT chk_quiz_title_not_empty CHECK (CHAR_LENGTH(quiz_title) > 0),
ADD CONSTRAINT chk_quiz_description_not_empty CHECK (CHAR_LENGTH(quiz_description) > 0),
ADD CONSTRAINT chk_quiz_deactivated_at_future CHECK (
  deactivated_at IS NULL
  OR deactivated_at > created_at
);

-- difficulty_levels
ALTER TABLE difficulty_levels ADD CONSTRAINT chk_time_limit_positive CHECK (time_limit_seconds > 0),
ADD CONSTRAINT chk_points_on_correct_nonnegative CHECK (points_on_correct >= 0),
ADD CONSTRAINT chk_points_on_incorrect_nonpositive CHECK (points_on_incorrect <= 0);

-- questions
ALTER TABLE questions ADD CONSTRAINT chk_question_text_not_empty CHECK (CHAR_LENGTH(question_text) > 0);

-- answers
ALTER TABLE answers ADD CONSTRAINT chk_answer_text_not_empty CHECK (CHAR_LENGTH(answer_text) > 0);

-- quiz_attempts
ALTER TABLE quiz_attempts ADD CONSTRAINT chk_end_time_after_start CHECK (
  end_time IS NULL
  OR end_time > start_time
);

-- user_responses
ALTER TABLE user_responses ADD CONSTRAINT chk_points_earned_reasonable CHECK (points_earned BETWEEN -100 AND 100);