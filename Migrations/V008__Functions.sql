-- Returns all answers (id, text, correctness) for a specific question
CREATE
OR REPLACE FUNCTION get_answers (p_question_id INT) RETURNS TABLE (
    answer_id INT,
    answer_text VARCHAR,
    is_correct BOOL
) AS $$
BEGIN
    RETURN QUERY
    SELECT a.answer_id, a.answer_text, a.is_correct
    FROM answers a
    WHERE a.question_id = p_question_id;
END;
$$ LANGUAGE plpgsql;

-- Returns all questions for a specific quiz
CREATE
OR REPLACE FUNCTION get_questions (p_quiz_id INT) RETURNS TABLE (
    question_id INT,
    question_text VARCHAR,
    difficulty_id INT,
    difficulty_level VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT q.question_id, q.question_text, q.difficulty_id, d.difficulty_level
    FROM questions q
    JOIN difficulty_levels d ON q.difficulty_id = d.difficulty_id
    WHERE q.quiz_id = p_quiz_id;
END;
$$ LANGUAGE plpgsql;

-- Returns the total points for a specific user (only if user is a Quiz Taker)
CREATE
OR REPLACE FUNCTION get_total_points (p_user_id INT) RETURNS INT AS $$
DECLARE
    total_points INT;
BEGIN
    SELECT COALESCE(SUM(ur.points_earned), 0) INTO total_points
    FROM users u
    LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
    LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
    WHERE u.role_id = 1 AND u.user_id = p_user_id;
    RETURN total_points;
END;
$$ LANGUAGE plpgsql;

-- Returns the correct answer (id, text) for a specific question
CREATE
OR REPLACE FUNCTION get_correct_answer (p_question_id INT) RETURNS TABLE (answer_id INT, answer_text VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT a.answer_id, a.answer_text
    FROM answers a
    WHERE a.question_id = p_question_id AND a.is_correct = true;
END;
$$ LANGUAGE plpgsql;

-- Returns all badges earned by a specific user
CREATE
OR REPLACE FUNCTION get_badges (p_user_id INT) RETURNS TABLE (badge_name VARCHAR, achieved_at TIMESTAMP) AS $$
BEGIN
    RETURN QUERY
    SELECT b.badge_name, bh.achieved_at
    FROM badge_history bh
    JOIN badges b ON bh.badge_id = b.badge_id
    WHERE bh.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Returns all quiz attempts for a user, with quiz title and total score
CREATE
OR REPLACE FUNCTION get_quiz_attempts (p_user_id INT) RETURNS TABLE (
    quiz_title VARCHAR,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    total_points INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.quiz_title,
        qa.start_time,
        qa.end_time,
        COALESCE(SUM(ur.points_earned), 0)::INT
    FROM quiz_attempts qa
    JOIN quizzes q ON qa.quiz_id = q.quiz_id
    LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
    WHERE qa.user_id = p_user_id
    GROUP BY q.quiz_title, qa.start_time, qa.end_time;
END;
$$ LANGUAGE plpgsql;

-- Returns all quizzes with an additional column for the user's quiz end 
-- timestamp
CREATE
OR REPLACE FUNCTION get_quizzes_for_user (p_user_id INT) RETURNS TABLE (
    quiz_id INT,
    quiz_title VARCHAR(64),
    quiz_description VARCHAR(128),
    category_name VARCHAR(32),
    created_by VARCHAR(16),
    created_at TIMESTAMP,
    end_time TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        q.quiz_id,
        q.quiz_title,
        q.quiz_description,
        c.category_name,
        u.username AS created_by,
        q.created_at,
        qa.end_time
    FROM quizzes q
    INNER JOIN categories c ON q.category_id = c.category_id
    INNER JOIN users u ON q.created_by = u.user_id
    LEFT JOIN quiz_attempts qa
        ON q.quiz_id = qa.quiz_id AND qa.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Returns the number of quizzes a specific user has done
CREATE
OR REPLACE FUNCTION get_num_quizzes_done (p_user_id INT) RETURNS INT AS $$
DECLARE
    num_quizzes INT;
BEGIN
    SELECT COUNT(DISTINCT quiz_id)
    INTO num_quizzes
    FROM quiz_attempts
    WHERE user_id = p_user_id;
    RETURN num_quizzes;
END;
$$ LANGUAGE plpgsql;

-- Returns the number of questions a specific user has answered
CREATE
OR REPLACE FUNCTION get_num_questions_answered (p_user_id INT) RETURNS INT AS $$
DECLARE
    num_questions INT;
BEGIN
    SELECT COUNT(ur.response_id)
    INTO num_questions
    FROM user_responses ur
    INNER JOIN quiz_attempts qa ON ur.attempt_id = qa.attempt_id
    WHERE qa.user_id = p_user_id;
    RETURN num_questions;
END;
$$ LANGUAGE plpgsql;

-- Returns the accuracy rate (correct/total) of a specific user
CREATE
OR REPLACE FUNCTION get_accuracy_rate (p_user_id INT) RETURNS NUMERIC AS $$
DECLARE
    num_correct INT;
    num_total INT;
    accuracy NUMERIC;
BEGIN
    SELECT COUNT(*) INTO num_correct
    FROM user_responses ur
    INNER JOIN quiz_attempts qa ON ur.attempt_id = qa.attempt_id
    INNER JOIN answers a ON ur.chosen_answer = a.answer_id
    WHERE qa.user_id = p_user_id AND a.is_correct = TRUE;

    SELECT COUNT(*) INTO num_total
    FROM user_responses ur
    INNER JOIN quiz_attempts qa ON ur.attempt_id = qa.attempt_id
    WHERE qa.user_id = p_user_id;

    IF num_total = 0 THEN
        RETURN 0;
    END IF;

    accuracy := num_correct::NUMERIC / num_total;
    RETURN accuracy;
END;
$$ LANGUAGE plpgsql;

-- Returns the user's rank on the leaderboard (by total points, 1 = highest)
CREATE
OR REPLACE FUNCTION get_user_rank (p_user_id INT) RETURNS INT AS $$
DECLARE
    user_rank INT;
BEGIN
    WITH ranked AS (
        SELECT
            u.user_id,
            RANK() OVER (ORDER BY COALESCE(SUM(ur.points_earned),0) DESC) AS rank
        FROM users u
        LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
        LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
        WHERE u.role_id = 1
        GROUP BY u.user_id
    )
    SELECT rank INTO user_rank FROM ranked WHERE ranked.user_id = p_user_id;
    RETURN user_rank;
END;
$$ LANGUAGE plpgsql;