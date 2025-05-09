-- Roles CRUD Procedures
CREATE OR REPLACE PROCEDURE create_role(
  p_role_name VARCHAR(32),
  INOUT p_role_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_role_name IS NULL OR TRIM(p_role_name) = '' THEN
    RAISE EXCEPTION 'Role name cannot be null or empty';
  END IF;

  BEGIN
    INSERT INTO roles (role_name)
    VALUES (p_role_name)
    RETURNING role_id INTO p_role_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Role with name "%" already exists', p_role_name;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating role: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_role(
  p_role_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_role_id IS NULL THEN
    RAISE EXCEPTION 'Role ID cannot be null';
  END IF;
  
  -- Check if role exists
  SELECT COUNT(*) INTO v_count FROM roles WHERE role_id = p_role_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Role with ID % not found', p_role_id;
  END IF;

  BEGIN
    SELECT * FROM roles WHERE role_id = p_role_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading role: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_role(
  p_role_id INT,
  p_role_name VARCHAR(32)
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_role_id IS NULL THEN
    RAISE EXCEPTION 'Role ID cannot be null';
  END IF;
  
  IF p_role_name IS NULL OR TRIM(p_role_name) = '' THEN
    RAISE EXCEPTION 'Role name cannot be null or empty';
  END IF;

  -- Check if role exists
  SELECT COUNT(*) INTO v_count FROM roles WHERE role_id = p_role_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Role with ID % not found', p_role_id;
  END IF;

  BEGIN
    UPDATE roles
    SET role_name = p_role_name
    WHERE role_id = p_role_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Role update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Role with name "%" already exists', p_role_name;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating role: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_role(
  p_role_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_role_id IS NULL THEN
    RAISE EXCEPTION 'Role ID cannot be null';
  END IF;

  -- Check if role exists
  SELECT COUNT(*) INTO v_count FROM roles WHERE role_id = p_role_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Role with ID % not found', p_role_id;
  END IF;

  -- Check if role is being used by users
  SELECT COUNT(*) INTO v_count FROM users WHERE role_id = p_role_id;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete role with ID % as it is being used by % user(s)', p_role_id, v_count;
  END IF;

  BEGIN
    DELETE FROM roles
    WHERE role_id = p_role_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Role deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Cannot delete role as it has dependent records';
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting role: %', v_error_message;
  END;
END;
$$;

-- Users CRUD Procedures
CREATE OR REPLACE PROCEDURE create_user(
  p_google_id VARCHAR(256),
  p_username VARCHAR(16) DEFAULT NULL,
  p_role_id INT DEFAULT 1,
  INOUT p_user_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_google_id IS NULL OR TRIM(p_google_id) = '' THEN
    RAISE EXCEPTION 'Google ID cannot be null or empty';
  END IF;
  
  IF p_username IS NOT NULL AND TRIM(p_username) = '' THEN
    RAISE EXCEPTION 'Username cannot be empty';
  END IF;

  -- Check if role exists
  SELECT COUNT(*) INTO v_count FROM roles WHERE role_id = p_role_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Role with ID % not found', p_role_id;
  END IF;

  BEGIN
    INSERT INTO users (google_id, username, role_id)
    VALUES (p_google_id, p_username, p_role_id)
    RETURNING user_id INTO p_user_id;
  EXCEPTION
    WHEN unique_violation THEN
      -- Determine which constraint was violated
      IF EXISTS (SELECT 1 FROM users WHERE google_id = p_google_id) THEN
        RAISE EXCEPTION 'User with Google ID "%" already exists', p_google_id;
      ELSE
        RAISE EXCEPTION 'Username "%" is already taken', p_username;
      END IF;
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Referenced role ID % does not exist', p_role_id;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating user: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_user(
  p_user_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  -- Check if user exists
  SELECT COUNT(*) INTO v_count FROM users WHERE user_id = p_user_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User with ID % not found', p_user_id;
  END IF;

  BEGIN
    SELECT * FROM users WHERE user_id = p_user_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading user: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_user(
  p_user_id INT,
  p_username VARCHAR(16) DEFAULT NULL,
  p_role_id INT DEFAULT NULL,
  p_deactivated_at TIMESTAMP DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  IF p_username IS NOT NULL AND TRIM(p_username) = '' THEN
    RAISE EXCEPTION 'Username cannot be empty';
  END IF;

  -- Check if user exists
  SELECT COUNT(*) INTO v_count FROM users WHERE user_id = p_user_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User with ID % not found', p_user_id;
  END IF;

  -- Check if role exists when provided
  IF p_role_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_count FROM roles WHERE role_id = p_role_id;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'Role with ID % not found', p_role_id;
    END IF;
  END IF;

  BEGIN
    UPDATE users
    SET 
      username = COALESCE(p_username, username),
      role_id = COALESCE(p_role_id, role_id),
      deactivated_at = p_deactivated_at
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'User update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Username "%" is already taken', p_username;
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Referenced role ID % does not exist', p_role_id;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating user: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_user(
  p_user_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  -- Check if user exists
  SELECT COUNT(*) INTO v_count FROM users WHERE user_id = p_user_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User with ID % not found', p_user_id;
  END IF;

  BEGIN
    -- Soft delete by setting deactivated_at
    UPDATE users
    SET deactivated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'User deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting user: %', v_error_message;
  END;
END;
$$;

-- Badges CRUD Procedures
CREATE OR REPLACE PROCEDURE create_badge(
  p_badge_name VARCHAR(32),
  p_minimum_points INT,
  INOUT p_badge_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_badge_name IS NULL OR TRIM(p_badge_name) = '' THEN
    RAISE EXCEPTION 'Badge name cannot be null or empty';
  END IF;
  
  IF p_minimum_points IS NULL THEN
    RAISE EXCEPTION 'Minimum points cannot be null';
  END IF;

  BEGIN
    INSERT INTO badges (badge_name, minimum_points)
    VALUES (p_badge_name, p_minimum_points)
    RETURNING badge_id INTO p_badge_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Badge with name "%" already exists', p_badge_name;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating badge: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_badge(
  p_badge_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_badge_id IS NULL THEN
    RAISE EXCEPTION 'Badge ID cannot be null';
  END IF;
  
  -- Check if badge exists
  SELECT COUNT(*) INTO v_count FROM badges WHERE badge_id = p_badge_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Badge with ID % not found', p_badge_id;
  END IF;

  BEGIN
    SELECT * FROM badges WHERE badge_id = p_badge_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading badge: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_badge(
  p_badge_id INT,
  p_badge_name VARCHAR(32) DEFAULT NULL,
  p_minimum_points INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_badge_id IS NULL THEN
    RAISE EXCEPTION 'Badge ID cannot be null';
  END IF;
  
  IF p_badge_name IS NOT NULL AND TRIM(p_badge_name) = '' THEN
    RAISE EXCEPTION 'Badge name cannot be empty';
  END IF;

  -- Check if badge exists
  SELECT COUNT(*) INTO v_count FROM badges WHERE badge_id = p_badge_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Badge with ID % not found', p_badge_id;
  END IF;

  BEGIN
    UPDATE badges
    SET 
      badge_name = COALESCE(p_badge_name, badge_name),
      minimum_points = COALESCE(p_minimum_points, minimum_points)
    WHERE badge_id = p_badge_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Badge update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Badge with name "%" already exists', p_badge_name;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating badge: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_badge(
  p_badge_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_badge_id IS NULL THEN
    RAISE EXCEPTION 'Badge ID cannot be null';
  END IF;

  -- Check if badge exists
  SELECT COUNT(*) INTO v_count FROM badges WHERE badge_id = p_badge_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Badge with ID % not found', p_badge_id;
  END IF;

  -- Check if badge is being used in badge_history
  SELECT COUNT(*) INTO v_count FROM badge_history WHERE badge_id = p_badge_id;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete badge with ID % as it is referenced in badge history % time(s)', p_badge_id, v_count;
  END IF;

  BEGIN
    DELETE FROM badges
    WHERE badge_id = p_badge_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Badge deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Cannot delete badge as it has dependent records';
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting badge: %', v_error_message;
  END;
END;
$$;

-- Badge History CRUD Procedures
CREATE OR REPLACE PROCEDURE create_badge_history(
  p_user_id INT,
  p_badge_id INT,
  p_achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INOUT p_badge_history_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  IF p_badge_id IS NULL THEN
    RAISE EXCEPTION 'Badge ID cannot be null';
  END IF;

  -- Check if user exists
  SELECT COUNT(*) INTO v_count FROM users WHERE user_id = p_user_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User with ID % not found', p_user_id;
  END IF;

  -- Check if badge exists
  SELECT COUNT(*) INTO v_count FROM badges WHERE badge_id = p_badge_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Badge with ID % not found', p_badge_id;
  END IF;

  BEGIN
    INSERT INTO badge_history (user_id, badge_id, achieved_at)
    VALUES (p_user_id, p_badge_id, p_achieved_at)
    RETURNING badge_history_id INTO p_badge_history_id;
  EXCEPTION
    WHEN foreign_key_violation THEN
      IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist', p_user_id;
      ELSE
        RAISE EXCEPTION 'Badge with ID % does not exist', p_badge_id;
      END IF;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating badge history: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_badge_history(
  p_badge_history_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_badge_history_id IS NULL THEN
    RAISE EXCEPTION 'Badge history ID cannot be null';
  END IF;
  
  -- Check if badge history exists
  SELECT COUNT(*) INTO v_count FROM badge_history WHERE badge_history_id = p_badge_history_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Badge history with ID % not found', p_badge_history_id;
  END IF;

  BEGIN
    SELECT * FROM badge_history WHERE badge_history_id = p_badge_history_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading badge history: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_badge_history(
  p_badge_history_id INT,
  p_user_id INT DEFAULT NULL,
  p_badge_id INT DEFAULT NULL,
  p_achieved_at TIMESTAMP DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_badge_history_id IS NULL THEN
    RAISE EXCEPTION 'Badge history ID cannot be null';
  END IF;

  -- Check if badge history exists
  SELECT COUNT(*) INTO v_count FROM badge_history WHERE badge_history_id = p_badge_history_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Badge history with ID % not found', p_badge_history_id;
  END IF;

  -- Check if user exists when provided
  IF p_user_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_count FROM users WHERE user_id = p_user_id;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'User with ID % not found', p_user_id;
    END IF;
  END IF;

  -- Check if badge exists when provided
  IF p_badge_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_count FROM badges WHERE badge_id = p_badge_id;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'Badge with ID % not found', p_badge_id;
    END IF;
  END IF;

  BEGIN
    UPDATE badge_history
    SET 
      user_id = COALESCE(p_user_id, user_id),
      badge_id = COALESCE(p_badge_id, badge_id),
      achieved_at = COALESCE(p_achieved_at, achieved_at)
    WHERE badge_history_id = p_badge_history_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Badge history update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN foreign_key_violation THEN
      IF p_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist', p_user_id;
      ELSE
        RAISE EXCEPTION 'Badge with ID % does not exist', p_badge_id;
      END IF;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating badge history: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_badge_history(
  p_badge_history_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_badge_history_id IS NULL THEN
    RAISE EXCEPTION 'Badge history ID cannot be null';
  END IF;

  -- Check if badge history exists
  SELECT COUNT(*) INTO v_count FROM badge_history WHERE badge_history_id = p_badge_history_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Badge history with ID % not found', p_badge_history_id;
  END IF;

  BEGIN
    DELETE FROM badge_history
    WHERE badge_history_id = p_badge_history_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Badge history deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting badge history: %', v_error_message;
  END;
END;
$$;

-- Categories CRUD Procedures
CREATE OR REPLACE PROCEDURE create_category(
  p_category_name VARCHAR(32),
  p_category_description VARCHAR(64),
  INOUT p_category_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_category_name IS NULL OR TRIM(p_category_name) = '' THEN
    RAISE EXCEPTION 'Category name cannot be null or empty';
  END IF;
  
  IF p_category_description IS NULL OR TRIM(p_category_description) = '' THEN
    RAISE EXCEPTION 'Category description cannot be null or empty';
  END IF;

  BEGIN
    INSERT INTO categories (category_name, category_description)
    VALUES (p_category_name, p_category_description)
    RETURNING category_id INTO p_category_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating category: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_category(
  p_category_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_category_id IS NULL THEN
    RAISE EXCEPTION 'Category ID cannot be null';
  END IF;
  
  -- Check if category exists
  SELECT COUNT(*) INTO v_count FROM categories WHERE category_id = p_category_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Category with ID % not found', p_category_id;
  END IF;

  BEGIN
    SELECT * FROM categories WHERE category_id = p_category_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading category: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_category(
  p_category_id INT,
  p_category_name VARCHAR(32) DEFAULT NULL,
  p_category_description VARCHAR(64) DEFAULT NULL,
  p_deactivated_at TIMESTAMP DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_category_id IS NULL THEN
    RAISE EXCEPTION 'Category ID cannot be null';
  END IF;
  
  IF p_category_name IS NOT NULL AND TRIM(p_category_name) = '' THEN
    RAISE EXCEPTION 'Category name cannot be empty';
  END IF;
  
  IF p_category_description IS NOT NULL AND TRIM(p_category_description) = '' THEN
    RAISE EXCEPTION 'Category description cannot be empty';
  END IF;

  -- Check if category exists
  SELECT COUNT(*) INTO v_count FROM categories WHERE category_id = p_category_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Category with ID % not found', p_category_id;
  END IF;

  BEGIN
    UPDATE categories
    SET 
      category_name = COALESCE(p_category_name, category_name),
      category_description = COALESCE(p_category_description, category_description),
      deactivated_at = p_deactivated_at
    WHERE category_id = p_category_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Category update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating category: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_category(
  p_category_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_category_id IS NULL THEN
    RAISE EXCEPTION 'Category ID cannot be null';
  END IF;

  -- Check if category exists
  SELECT COUNT(*) INTO v_count FROM categories WHERE category_id = p_category_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Category with ID % not found', p_category_id;
  END IF;

  -- Check if there are quizzes in this category
  SELECT COUNT(*) INTO v_count FROM quizzes WHERE category_id = p_category_id;
  IF v_count > 0 THEN
    RAISE NOTICE 'Category has % related quiz(zes). Proceeding with soft delete.', v_count;
  END IF;

  BEGIN
    -- Soft delete by setting deactivated_at
    UPDATE categories
    SET deactivated_at = CURRENT_TIMESTAMP
    WHERE category_id = p_category_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Category deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting category: %', v_error_message;
  END;
END;
$$;

-- Quizzes CRUD Procedures
CREATE OR REPLACE PROCEDURE create_quiz(
  p_quiz_title VARCHAR(64),
  p_quiz_description VARCHAR(128),
  p_category_id INT,
  p_created_by INT,
  INOUT p_quiz_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_quiz_title IS NULL OR TRIM(p_quiz_title) = '' THEN
    RAISE EXCEPTION 'Quiz title cannot be null or empty';
  END IF;
  
  IF p_quiz_description IS NULL OR TRIM(p_quiz_description) = '' THEN
    RAISE EXCEPTION 'Quiz description cannot be null or empty';
  END IF;
  
  IF p_category_id IS NULL THEN
    RAISE EXCEPTION 'Category ID cannot be null';
  END IF;
  
  IF p_created_by IS NULL THEN
    RAISE EXCEPTION 'Created by user ID cannot be null';
  END IF;

  -- Check if category exists
  SELECT COUNT(*) INTO v_count FROM categories WHERE category_id = p_category_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Category with ID % not found', p_category_id;
  END IF;

  -- Check if category is active
  SELECT COUNT(*) INTO v_count FROM categories WHERE category_id = p_category_id AND deactivated_at IS NULL;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Category with ID % is deactivated', p_category_id;
  END IF;

  -- Check if user exists
  SELECT COUNT(*) INTO v_count FROM users WHERE user_id = p_created_by;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User with ID % not found', p_created_by;
  END IF;

  -- Check if user is active
  SELECT COUNT(*) INTO v_count FROM users WHERE user_id = p_created_by AND deactivated_at IS NULL;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User with ID % is deactivated', p_created_by;
  END IF;

  BEGIN
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES (p_quiz_title, p_quiz_description, p_category_id, p_created_by)
    RETURNING quiz_id INTO p_quiz_id;
  EXCEPTION
    WHEN foreign_key_violation THEN
      IF NOT EXISTS (SELECT 1 FROM categories WHERE category_id = p_category_id) THEN
        RAISE EXCEPTION 'Category with ID % does not exist', p_category_id;
      ELSE
        RAISE EXCEPTION 'User with ID % does not exist', p_created_by;
      END IF;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating quiz: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_quiz(
  p_quiz_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_quiz_id IS NULL THEN
    RAISE EXCEPTION 'Quiz ID cannot be null';
  END IF;
  
  -- Check if quiz exists
  SELECT COUNT(*) INTO v_count FROM quizzes WHERE quiz_id = p_quiz_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz with ID % not found', p_quiz_id;
  END IF;

  BEGIN
    SELECT * FROM quizzes WHERE quiz_id = p_quiz_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading quiz: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_quiz(
  p_quiz_id INT,
  p_quiz_title VARCHAR(64) DEFAULT NULL,
  p_quiz_description VARCHAR(128) DEFAULT NULL,
  p_category_id INT DEFAULT NULL,
  p_deactivated_at TIMESTAMP DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_quiz_id IS NULL THEN
    RAISE EXCEPTION 'Quiz ID cannot be null';
  END IF;
  
  IF p_quiz_title IS NOT NULL AND TRIM(p_quiz_title) = '' THEN
    RAISE EXCEPTION 'Quiz title cannot be empty';
  END IF;
  
  IF p_quiz_description IS NOT NULL AND TRIM(p_quiz_description) = '' THEN
    RAISE EXCEPTION 'Quiz description cannot be empty';
  END IF;

  -- Check if quiz exists
  SELECT COUNT(*) INTO v_count FROM quizzes WHERE quiz_id = p_quiz_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz with ID % not found', p_quiz_id;
  END IF;

  -- Check if category exists when provided
  IF p_category_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_count FROM categories WHERE category_id = p_category_id;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'Category with ID % not found', p_category_id;
    END IF;
    
    -- Check if category is active
    SELECT COUNT(*) INTO v_count FROM categories WHERE category_id = p_category_id AND deactivated_at IS NULL;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'Category with ID % is deactivated', p_category_id;
    END IF;
  END IF;

  BEGIN
    UPDATE quizzes
    SET 
      quiz_title = COALESCE(p_quiz_title, quiz_title),
      quiz_description = COALESCE(p_quiz_description, quiz_description),
      category_id = COALESCE(p_category_id, category_id),
      deactivated_at = p_deactivated_at
    WHERE quiz_id = p_quiz_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Quiz update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Category with ID % does not exist', p_category_id;
    WHEN check_violation THEN
      RAISE EXCEPTION 'Check constraint violation: %', SQLERRM;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating quiz: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_quiz(
  p_quiz_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_quiz_id IS NULL THEN
    RAISE EXCEPTION 'Quiz ID cannot be null';
  END IF;

  -- Check if quiz exists
  SELECT COUNT(*) INTO v_count FROM quizzes WHERE quiz_id = p_quiz_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz with ID % not found', p_quiz_id;
  END IF;

  -- Check if there are questions for this quiz
  SELECT COUNT(*) INTO v_count FROM questions WHERE quiz_id = p_quiz_id;
  IF v_count > 0 THEN
    RAISE NOTICE 'Quiz has % question(s). Proceeding with soft delete.', v_count;
  END IF;

  -- Check if there are quiz attempts for this quiz
  SELECT COUNT(*) INTO v_count FROM quiz_attempts WHERE quiz_id = p_quiz_id;
  IF v_count > 0 THEN
    RAISE NOTICE 'Quiz has % attempt(s). Proceeding with soft delete.', v_count;
  END IF;

  BEGIN
    -- Soft delete by setting deactivated_at
    UPDATE quizzes
    SET deactivated_at = CURRENT_TIMESTAMP
    WHERE quiz_id = p_quiz_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Quiz deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting quiz: %', v_error_message;
  END;
END;
$$;

-- Difficulty Levels CRUD Procedures
CREATE OR REPLACE PROCEDURE create_difficulty(
  p_difficulty_level VARCHAR(16),
  p_time_limit_seconds INT DEFAULT 10,
  p_points_on_correct INT DEFAULT 10,
  p_points_on_incorrect INT DEFAULT -10,
  INOUT p_difficulty_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_difficulty_level IS NULL OR TRIM(p_difficulty_level) = '' THEN
    RAISE EXCEPTION 'Difficulty level cannot be null or empty';
  END IF;
  
  IF p_time_limit_seconds IS NULL OR p_time_limit_seconds <= 0 THEN
    RAISE EXCEPTION 'Time limit must be a positive integer';
  END IF;
  
  IF p_points_on_correct IS NULL OR p_points_on_correct < 0 THEN
    RAISE EXCEPTION 'Points on correct must be a non-negative integer';
  END IF;
  
  IF p_points_on_incorrect IS NULL OR p_points_on_incorrect > 0 THEN
    RAISE EXCEPTION 'Points on incorrect must be a non-positive integer';
  END IF;

  BEGIN
    INSERT INTO difficulty_levels (difficulty_level, time_limit_seconds, points_on_correct, points_on_incorrect)
    VALUES (p_difficulty_level, p_time_limit_seconds, p_points_on_correct, p_points_on_incorrect)
    RETURNING difficulty_id INTO p_difficulty_id;
  EXCEPTION
    WHEN check_violation THEN
      RAISE EXCEPTION 'Check constraint violation: %', SQLERRM;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating difficulty level: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_difficulty(
  p_difficulty_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_difficulty_id IS NULL THEN
    RAISE EXCEPTION 'Difficulty ID cannot be null';
  END IF;
  
  -- Check if difficulty exists
  SELECT COUNT(*) INTO v_count FROM difficulty_levels WHERE difficulty_id = p_difficulty_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Difficulty level with ID % not found', p_difficulty_id;
  END IF;

  BEGIN
    SELECT * FROM difficulty_levels WHERE difficulty_id = p_difficulty_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading difficulty level: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_difficulty(
  p_difficulty_id INT,
  p_difficulty_level VARCHAR(16) DEFAULT NULL,
  p_time_limit_seconds INT DEFAULT NULL,
  p_points_on_correct INT DEFAULT NULL,
  p_points_on_incorrect INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_difficulty_id IS NULL THEN
    RAISE EXCEPTION 'Difficulty ID cannot be null';
  END IF;
  
  IF p_difficulty_level IS NOT NULL AND TRIM(p_difficulty_level) = '' THEN
    RAISE EXCEPTION 'Difficulty level cannot be empty';
  END IF;
  
  IF p_time_limit_seconds IS NOT NULL AND p_time_limit_seconds <= 0 THEN
    RAISE EXCEPTION 'Time limit must be a positive integer';
  END IF;
  
  IF p_points_on_correct IS NOT NULL AND p_points_on_correct < 0 THEN
    RAISE EXCEPTION 'Points on correct must be a non-negative integer';
  END IF;
  
  IF p_points_on_incorrect IS NOT NULL AND p_points_on_incorrect > 0 THEN
    RAISE EXCEPTION 'Points on incorrect must be a non-positive integer';
  END IF;

  -- Check if difficulty exists
  SELECT COUNT(*) INTO v_count FROM difficulty_levels WHERE difficulty_id = p_difficulty_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Difficulty level with ID % not found', p_difficulty_id;
  END IF;

  BEGIN
    UPDATE difficulty_levels
    SET 
      difficulty_level = COALESCE(p_difficulty_level, difficulty_level),
      time_limit_seconds = COALESCE(p_time_limit_seconds, time_limit_seconds),
      points_on_correct = COALESCE(p_points_on_correct, points_on_correct),
      points_on_incorrect = COALESCE(p_points_on_incorrect, points_on_incorrect)
    WHERE difficulty_id = p_difficulty_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Difficulty level update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN check_violation THEN
      RAISE EXCEPTION 'Check constraint violation: %', SQLERRM;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating difficulty level: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_difficulty(
  p_difficulty_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_difficulty_id IS NULL THEN
    RAISE EXCEPTION 'Difficulty ID cannot be null';
  END IF;

  -- Check if difficulty exists
  SELECT COUNT(*) INTO v_count FROM difficulty_levels WHERE difficulty_id = p_difficulty_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Difficulty level with ID % not found', p_difficulty_id;
  END IF;

  -- Check if there are questions using this difficulty
  SELECT COUNT(*) INTO v_count FROM questions WHERE difficulty_id = p_difficulty_id;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete difficulty level with ID % as it is being used by % question(s)', p_difficulty_id, v_count;
  END IF;

  BEGIN
    DELETE FROM difficulty_levels
    WHERE difficulty_id = p_difficulty_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Difficulty level deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Cannot delete difficulty level as it has dependent records';
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting difficulty level: %', v_error_message;
  END;
END;
$$;

-- Questions CRUD Procedures
CREATE OR REPLACE PROCEDURE create_question(
  p_quiz_id INT,
  p_question_text VARCHAR(256),
  p_difficulty_id INT,
  INOUT p_question_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_quiz_id IS NULL THEN
    RAISE EXCEPTION 'Quiz ID cannot be null';
  END IF;
  
  IF p_question_text IS NULL OR TRIM(p_question_text) = '' THEN
    RAISE EXCEPTION 'Question text cannot be null or empty';
  END IF;
  
  IF p_difficulty_id IS NULL THEN
    RAISE EXCEPTION 'Difficulty ID cannot be null';
  END IF;

  -- Check if quiz exists
  SELECT COUNT(*) INTO v_count FROM quizzes WHERE quiz_id = p_quiz_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz with ID % not found', p_quiz_id;
  END IF;

  -- Check if quiz is active
  SELECT COUNT(*) INTO v_count FROM quizzes WHERE quiz_id = p_quiz_id AND deactivated_at IS NULL;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz with ID % is deactivated', p_quiz_id;
  END IF;

  -- Check if difficulty exists
  SELECT COUNT(*) INTO v_count FROM difficulty_levels WHERE difficulty_id = p_difficulty_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Difficulty level with ID % not found', p_difficulty_id;
  END IF;

  BEGIN
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (p_quiz_id, p_question_text, p_difficulty_id)
    RETURNING question_id INTO p_question_id;
  EXCEPTION
    WHEN foreign_key_violation THEN
      IF NOT EXISTS (SELECT 1 FROM quizzes WHERE quiz_id = p_quiz_id) THEN
        RAISE EXCEPTION 'Quiz with ID % does not exist', p_quiz_id;
      ELSE
        RAISE EXCEPTION 'Difficulty level with ID % does not exist', p_difficulty_id;
      END IF;
    WHEN check_violation THEN
      RAISE EXCEPTION 'Check constraint violation: %', SQLERRM;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating question: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_question(
  p_question_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_question_id IS NULL THEN
    RAISE EXCEPTION 'Question ID cannot be null';
  END IF;
  
  -- Check if question exists
  SELECT COUNT(*) INTO v_count FROM questions WHERE question_id = p_question_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Question with ID % not found', p_question_id;
  END IF;

  BEGIN
    SELECT * FROM questions WHERE question_id = p_question_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading question: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_question(
  p_question_id INT,
  p_question_text VARCHAR(256) DEFAULT NULL,
  p_difficulty_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_question_id IS NULL THEN
    RAISE EXCEPTION 'Question ID cannot be null';
  END IF;
  
  IF p_question_text IS NOT NULL AND TRIM(p_question_text) = '' THEN
    RAISE EXCEPTION 'Question text cannot be empty';
  END IF;

  -- Check if question exists
  SELECT COUNT(*) INTO v_count FROM questions WHERE question_id = p_question_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Question with ID % not found', p_question_id;
  END IF;

  -- Check if difficulty exists when provided
  IF p_difficulty_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_count FROM difficulty_levels WHERE difficulty_id = p_difficulty_id;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'Difficulty level with ID % not found', p_difficulty_id;
    END IF;
  END IF;

  BEGIN
    UPDATE questions
    SET 
      question_text = COALESCE(p_question_text, question_text),
      difficulty_id = COALESCE(p_difficulty_id, difficulty_id)
    WHERE question_id = p_question_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Question update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Difficulty level with ID % does not exist', p_difficulty_id;
    WHEN check_violation THEN
      RAISE EXCEPTION 'Check constraint violation: %', SQLERRM;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating question: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_question(
  p_question_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_question_id IS NULL THEN
    RAISE EXCEPTION 'Question ID cannot be null';
  END IF;

  -- Check if question exists
  SELECT COUNT(*) INTO v_count FROM questions WHERE question_id = p_question_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Question with ID % not found', p_question_id;
  END IF;

  -- Check if there are answers for this question
  SELECT COUNT(*) INTO v_count FROM answers WHERE question_id = p_question_id;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete question with ID % as it has % answer(s)', p_question_id, v_count;
  END IF;

  -- Check if there are user responses for this question
  SELECT COUNT(*) INTO v_count FROM user_responses WHERE question_id = p_question_id;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete question with ID % as it has % user response(s)', p_question_id, v_count;
  END IF;

  BEGIN
    DELETE FROM questions
    WHERE question_id = p_question_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Question deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Cannot delete question as it has dependent records';
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting question: %', v_error_message;
  END;
END;
$$;

-- Answers CRUD Procedures
CREATE OR REPLACE PROCEDURE create_answer(
  p_question_id INT,
  p_answer_text VARCHAR(128),
  p_is_correct BOOLEAN DEFAULT FALSE,
  INOUT p_answer_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_correct_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_question_id IS NULL THEN
    RAISE EXCEPTION 'Question ID cannot be null';
  END IF;
  
  IF p_answer_text IS NULL OR TRIM(p_answer_text) = '' THEN
    RAISE EXCEPTION 'Answer text cannot be null or empty';
  END IF;
  
  IF p_is_correct IS NULL THEN
    RAISE EXCEPTION 'Is correct flag cannot be null';
  END IF;

  -- Check if question exists
  SELECT COUNT(*) INTO v_count FROM questions WHERE question_id = p_question_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Question with ID % not found', p_question_id;
  END IF;

  -- Check if there's already a correct answer for this question if adding a correct answer
  IF p_is_correct THEN
    SELECT COUNT(*) INTO v_correct_count FROM answers WHERE question_id = p_question_id AND is_correct = TRUE;
    IF v_correct_count > 0 THEN
      RAISE WARNING 'Question with ID % already has a correct answer. Multiple correct answers are now possible.', p_question_id;
    END IF;
  END IF;

  BEGIN
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES (p_question_id, p_answer_text, p_is_correct)
    RETURNING answer_id INTO p_answer_id;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Question with ID % does not exist', p_question_id;
    WHEN check_violation THEN
      RAISE EXCEPTION 'Check constraint violation: %', SQLERRM;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating answer: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_answer(
  p_answer_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_answer_id IS NULL THEN
    RAISE EXCEPTION 'Answer ID cannot be null';
  END IF;
  
  -- Check if answer exists
  SELECT COUNT(*) INTO v_count FROM answers WHERE answer_id = p_answer_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Answer with ID % not found', p_answer_id;
  END IF;

  BEGIN
    SELECT * FROM answers WHERE answer_id = p_answer_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading answer: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_answer(
  p_answer_id INT,
  p_answer_text VARCHAR(128) DEFAULT NULL,
  p_is_correct BOOLEAN DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_question_id INT;
  v_current_is_correct BOOLEAN;
  v_correct_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_answer_id IS NULL THEN
    RAISE EXCEPTION 'Answer ID cannot be null';
  END IF;
  
  IF p_answer_text IS NOT NULL AND TRIM(p_answer_text) = '' THEN
    RAISE EXCEPTION 'Answer text cannot be empty';
  END IF;

  -- Check if answer exists
  SELECT COUNT(*) INTO v_count FROM answers WHERE answer_id = p_answer_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Answer with ID % not found', p_answer_id;
  END IF;

  -- Get current values to check for changes in is_correct
  SELECT question_id, is_correct INTO v_question_id, v_current_is_correct 
  FROM answers WHERE answer_id = p_answer_id;

  -- Check if changing from incorrect to correct and there's already a correct answer
  IF p_is_correct IS NOT NULL AND p_is_correct = TRUE AND v_current_is_correct = FALSE THEN
    SELECT COUNT(*) INTO v_correct_count 
    FROM answers 
    WHERE question_id = v_question_id AND is_correct = TRUE;
    
    IF v_correct_count > 0 THEN
      RAISE WARNING 'Question already has a correct answer. Multiple correct answers are now possible.';
    END IF;
  END IF;

  BEGIN
    UPDATE answers
    SET 
      answer_text = COALESCE(p_answer_text, answer_text),
      is_correct = COALESCE(p_is_correct, is_correct)
    WHERE answer_id = p_answer_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Answer update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN check_violation THEN
      RAISE EXCEPTION 'Check constraint violation: %', SQLERRM;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating answer: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_answer(
  p_answer_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_is_correct BOOLEAN;
  v_question_id INT;
  v_remaining_correct_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_answer_id IS NULL THEN
    RAISE EXCEPTION 'Answer ID cannot be null';
  END IF;

  -- Check if answer exists
  SELECT COUNT(*) INTO v_count FROM answers WHERE answer_id = p_answer_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Answer with ID % not found', p_answer_id;
  END IF;

  -- Check if there are user responses for this answer
  SELECT COUNT(*) INTO v_count FROM user_responses WHERE chosen_answer = p_answer_id;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete answer with ID % as it has % user response(s)', p_answer_id, v_count;
  END IF;

  -- Get answer info to check for correct answer status
  SELECT is_correct, question_id INTO v_is_correct, v_question_id 
  FROM answers WHERE answer_id = p_answer_id;

  -- Check if this is the only correct answer for the question
  IF v_is_correct THEN
    SELECT COUNT(*) INTO v_remaining_correct_count 
    FROM answers 
    WHERE question_id = v_question_id AND is_correct = TRUE AND answer_id != p_answer_id;
    
    IF v_remaining_correct_count = 0 THEN
      RAISE WARNING 'Deleting the only correct answer for question ID %', v_question_id;
    END IF;
  END IF;

  BEGIN
    DELETE FROM answers
    WHERE answer_id = p_answer_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Answer deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Cannot delete answer as it has dependent records';
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting answer: %', v_error_message;
  END;
END;
$$;

-- Quiz Attempts CRUD Procedures
CREATE OR REPLACE PROCEDURE create_quiz_attempt(
  p_user_id INT,
  p_quiz_id INT,
  p_start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INOUT p_attempt_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  IF p_quiz_id IS NULL THEN
    RAISE EXCEPTION 'Quiz ID cannot be null';
  END IF;

  -- Check if user exists
  SELECT COUNT(*) INTO v_count FROM users WHERE user_id = p_user_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User with ID % not found', p_user_id;
  END IF;

  -- Check if user is active
  SELECT COUNT(*) INTO v_count FROM users WHERE user_id = p_user_id AND deactivated_at IS NULL;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User with ID % is deactivated', p_user_id;
  END IF;

  -- Check if quiz exists
  SELECT COUNT(*) INTO v_count FROM quizzes WHERE quiz_id = p_quiz_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz with ID % not found', p_quiz_id;
  END IF;

  -- Check if quiz is active
  SELECT COUNT(*) INTO v_count FROM quizzes WHERE quiz_id = p_quiz_id AND deactivated_at IS NULL;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz with ID % is deactivated', p_quiz_id;
  END IF;

  BEGIN
    INSERT INTO quiz_attempts (user_id, quiz_id, start_time)
    VALUES (p_user_id, p_quiz_id, p_start_time)
    RETURNING attempt_id INTO p_attempt_id;
  EXCEPTION
    WHEN foreign_key_violation THEN
      IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist', p_user_id;
      ELSE
        RAISE EXCEPTION 'Quiz with ID % does not exist', p_quiz_id;
      END IF;
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating quiz attempt: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_quiz_attempt(
  p_attempt_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_attempt_id IS NULL THEN
    RAISE EXCEPTION 'Attempt ID cannot be null';
  END IF;
  
  -- Check if quiz attempt exists
  SELECT COUNT(*) INTO v_count FROM quiz_attempts WHERE attempt_id = p_attempt_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz attempt with ID % not found', p_attempt_id;
  END IF;

  BEGIN
    SELECT * FROM quiz_attempts WHERE attempt_id = p_attempt_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading quiz attempt: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_quiz_attempt(
  p_attempt_id INT,
  p_end_time TIMESTAMP DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_start_time TIMESTAMP;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_attempt_id IS NULL THEN
    RAISE EXCEPTION 'Attempt ID cannot be null';
  END IF;

  -- Check if quiz attempt exists
  SELECT COUNT(*) INTO v_count FROM quiz_attempts WHERE attempt_id = p_attempt_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz attempt with ID % not found', p_attempt_id;
  END IF;

  -- Get start time to check end time is after start time
  SELECT start_time INTO v_start_time FROM quiz_attempts WHERE attempt_id = p_attempt_id;

  IF p_end_time IS NOT NULL AND p_end_time <= v_start_time THEN
    RAISE EXCEPTION 'End time must be after start time';
  END IF;

  BEGIN
    UPDATE quiz_attempts
    SET 
      end_time = p_end_time
    WHERE attempt_id = p_attempt_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Quiz attempt update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN check_violation THEN
      RAISE EXCEPTION 'Check constraint violation: end time must be after start time';
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating quiz attempt: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_quiz_attempt(
  p_attempt_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_attempt_id IS NULL THEN
    RAISE EXCEPTION 'Attempt ID cannot be null';
  END IF;

  -- Check if quiz attempt exists
  SELECT COUNT(*) INTO v_count FROM quiz_attempts WHERE attempt_id = p_attempt_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz attempt with ID % not found', p_attempt_id;
  END IF;

  -- Check if there are user responses for this attempt
  SELECT COUNT(*) INTO v_count FROM user_responses WHERE attempt_id = p_attempt_id;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete quiz attempt with ID % as it has % user response(s)', p_attempt_id, v_count;
  END IF;

  BEGIN
    DELETE FROM quiz_attempts
    WHERE attempt_id = p_attempt_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Quiz attempt deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Cannot delete quiz attempt as it has dependent records';
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting quiz attempt: %', v_error_message;
  END;
END;
$$;

-- User Responses CRUD Procedures
CREATE OR REPLACE PROCEDURE create_user_response(
  p_attempt_id INT,
  p_question_id INT,
  p_chosen_answer INT,
  p_points_earned INT,
  INOUT p_response_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_quiz_id INT;
  v_question_quiz_id INT;
  v_answer_question_id INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_attempt_id IS NULL THEN
    RAISE EXCEPTION 'Attempt ID cannot be null';
  END IF;
  
  IF p_question_id IS NULL THEN
    RAISE EXCEPTION 'Question ID cannot be null';
  END IF;
  
  IF p_chosen_answer IS NULL THEN
    RAISE EXCEPTION 'Chosen answer ID cannot be null';
  END IF;
  
  IF p_points_earned IS NULL THEN
    RAISE EXCEPTION 'Points earned cannot be null';
  END IF;
  
  IF p_points_earned < -100 OR p_points_earned > 100 THEN
    RAISE EXCEPTION 'Points earned must be between -100 and 100';
  END IF;

  -- Check if quiz attempt exists
  SELECT COUNT(*) INTO v_count FROM quiz_attempts WHERE attempt_id = p_attempt_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Quiz attempt with ID % not found', p_attempt_id;
  END IF;

  -- Check if question exists
  SELECT COUNT(*) INTO v_count FROM questions WHERE question_id = p_question_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Question with ID % not found', p_question_id;
  END IF;

  -- Check if answer exists
  SELECT COUNT(*) INTO v_count FROM answers WHERE answer_id = p_chosen_answer;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Answer with ID % not found', p_chosen_answer;
  END IF;

  -- Check if answer belongs to the question
  SELECT question_id INTO v_answer_question_id FROM answers WHERE answer_id = p_chosen_answer;
  IF v_answer_question_id != p_question_id THEN
    RAISE EXCEPTION 'Answer with ID % does not belong to question with ID %', p_chosen_answer, p_question_id;
  END IF;

  -- Check if question belongs to the quiz in the attempt
  SELECT quiz_id INTO v_quiz_id FROM quiz_attempts WHERE attempt_id = p_attempt_id;
  SELECT quiz_id INTO v_question_quiz_id FROM questions WHERE question_id = p_question_id;
  IF v_quiz_id != v_question_quiz_id THEN
    RAISE EXCEPTION 'Question with ID % does not belong to quiz with ID % in attempt %', p_question_id, v_quiz_id, p_attempt_id;
  END IF;

  -- Check if this question has already been answered in this attempt
  SELECT COUNT(*) INTO v_count FROM user_responses WHERE attempt_id = p_attempt_id AND question_id = p_question_id;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Question with ID % has already been answered in attempt %', p_question_id, p_attempt_id;
  END IF;

  BEGIN
    INSERT INTO user_responses (attempt_id, question_id, chosen_answer, points_earned)
    VALUES (p_attempt_id, p_question_id, p_chosen_answer, p_points_earned)
    RETURNING response_id INTO p_response_id;
  EXCEPTION
    WHEN foreign_key_violation THEN
      IF NOT EXISTS (SELECT 1 FROM quiz_attempts WHERE attempt_id = p_attempt_id) THEN
        RAISE EXCEPTION 'Quiz attempt with ID % does not exist', p_attempt_id;
      ELSIF NOT EXISTS (SELECT 1 FROM questions WHERE question_id = p_question_id) THEN
        RAISE EXCEPTION 'Question with ID % does not exist', p_question_id;
      ELSE
        RAISE EXCEPTION 'Answer with ID % does not exist', p_chosen_answer;
      END IF;
    WHEN check_violation THEN
      RAISE EXCEPTION 'Check constraint violation: points earned must be between -100 and 100';
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error creating user response: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE read_user_response(
  p_response_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_response_id IS NULL THEN
    RAISE EXCEPTION 'Response ID cannot be null';
  END IF;
  
  -- Check if user response exists
  SELECT COUNT(*) INTO v_count FROM user_responses WHERE response_id = p_response_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User response with ID % not found', p_response_id;
  END IF;

  BEGIN
    SELECT * FROM user_responses WHERE response_id = p_response_id;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error reading user response: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE update_user_response(
  p_response_id INT,
  p_chosen_answer INT DEFAULT NULL,
  p_points_earned INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_question_id INT;
  v_answer_question_id INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_response_id IS NULL THEN
    RAISE EXCEPTION 'Response ID cannot be null';
  END IF;
  
  IF p_points_earned IS NOT NULL AND (p_points_earned < -100 OR p_points_earned > 100) THEN
    RAISE EXCEPTION 'Points earned must be between -100 and 100';
  END IF;

  -- Check if user response exists
  SELECT COUNT(*) INTO v_count FROM user_responses WHERE response_id = p_response_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User response with ID % not found', p_response_id;
  END IF;

  -- If updating chosen answer, check if the new answer belongs to the same question
  IF p_chosen_answer IS NOT NULL THEN
    -- Check if answer exists
    SELECT COUNT(*) INTO v_count FROM answers WHERE answer_id = p_chosen_answer;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'Answer with ID % not found', p_chosen_answer;
    END IF;
    
    -- Get the question this response is for
    SELECT question_id INTO v_question_id FROM user_responses WHERE response_id = p_response_id;
    
    -- Check if the new answer belongs to the same question
    SELECT question_id INTO v_answer_question_id FROM answers WHERE answer_id = p_chosen_answer;
    IF v_answer_question_id != v_question_id THEN
      RAISE EXCEPTION 'Answer with ID % does not belong to question with ID %', p_chosen_answer, v_question_id;
    END IF;
  END IF;

  BEGIN
    UPDATE user_responses
    SET 
      chosen_answer = COALESCE(p_chosen_answer, chosen_answer),
      points_earned = COALESCE(p_points_earned, points_earned)
    WHERE response_id = p_response_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'User response update failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Answer with ID % does not exist', p_chosen_answer;
    WHEN check_violation THEN
      RAISE EXCEPTION 'Check constraint violation: points earned must be between -100 and 100';
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error updating user response: %', v_error_message;
  END;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_user_response(
  p_response_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_error_message TEXT;
BEGIN
  -- Input validation
  IF p_response_id IS NULL THEN
    RAISE EXCEPTION 'Response ID cannot be null';
  END IF;

  -- Check if user response exists
  SELECT COUNT(*) INTO v_count FROM user_responses WHERE response_id = p_response_id;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'User response with ID % not found', p_response_id;
  END IF;

  BEGIN
    DELETE FROM user_responses
    WHERE response_id = p_response_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'User response deletion failed, no rows affected';
    END IF;
  EXCEPTION
    WHEN others THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE EXCEPTION 'Error deleting user response: %', v_error_message;
  END;
END;
$$;
