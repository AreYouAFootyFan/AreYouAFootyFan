-- Returns all answers (id, text, correctness) for a specific question
CREATE OR REPLACE FUNCTION get_answers(p_question_id INT)
RETURNS TABLE(answer_id INT, answer_text VARCHAR, is_correct BOOL) AS $$
BEGIN
    RETURN QUERY
    SELECT a.answer_id, a.answer_text, a.is_correct
    FROM answers a
    WHERE a.question_id = p_question_id;
END;
$$ LANGUAGE plpgsql;

-- Returns all questions for a specific quiz
CREATE OR REPLACE FUNCTION get_questions(p_quiz_id INT)
RETURNS TABLE(question_id INT, question_text VARCHAR, difficulty_id INT, difficulty_level VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT q.question_id, q.question_text, q.difficulty_id, d.difficulty_level
    FROM questions q
    JOIN difficulty_levels d ON q.difficulty_id = d.difficulty_id
    WHERE q.quiz_id = p_quiz_id;
END;
$$ LANGUAGE plpgsql;

-- Returns the total points for a specific user (only if user is a Quiz Taker)
CREATE OR REPLACE FUNCTION get_total_points(p_user_id INT)
RETURNS INT AS $$
DECLARE
    total_points INT;
BEGIN
    SELECT COALESCE(SUM(ur.points_earned), 0)
    INTO total_points
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
    LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
    WHERE r.role_name = 'Quiz Taker' AND u.user_id = p_user_id;
    RETURN total_points;
END;
$$ LANGUAGE plpgsql;

-- Returns the correct answer (id, text) for a specific question
CREATE OR REPLACE FUNCTION get_correct_answer(p_question_id INT)
RETURNS TABLE(answer_id INT, answer_text VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT a.answer_id, a.answer_text
    FROM answers a
    WHERE a.question_id = p_question_id AND a.is_correct = true;
END;
$$ LANGUAGE plpgsql;

-- Returns all badges earned by a specific user
CREATE OR REPLACE FUNCTION get_badges(p_user_id INT)
RETURNS TABLE(badge_name VARCHAR, achieved_at TIMESTAMP) AS $$
BEGIN
    RETURN QUERY
    SELECT b.badge_name, bh.achieved_at
    FROM badge_history bh
    JOIN badges b ON bh.badge_id = b.badge_id
    WHERE bh.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Returns all quiz attempts for a user, with quiz title and total score
CREATE OR REPLACE FUNCTION get_quiz_attempts(p_user_id INT)
RETURNS TABLE(quiz_title VARCHAR, start_time TIMESTAMP, end_time TIMESTAMP, total_points INT) AS $$
BEGIN
    RETURN QUERY
    SELECT q.quiz_title, qa.start_time, qa.end_time, COALESCE(SUM(ur.points_earned), 0)::INT
    FROM quiz_attempts qa
    JOIN quizzes q ON qa.quiz_id = q.quiz_id
    LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
    WHERE qa.user_id = p_user_id
    GROUP BY q.quiz_title, qa.start_time, qa.end_time;
END;
$$ LANGUAGE plpgsql;