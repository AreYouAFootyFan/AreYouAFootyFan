-- Returns the number of quizzes a specific user has done
CREATE OR REPLACE FUNCTION get_num_quizzes_done(p_user_id INT)
RETURNS INT AS $$
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
CREATE OR REPLACE FUNCTION get_num_questions_answered(p_user_id INT)
RETURNS INT AS $$
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
CREATE OR REPLACE FUNCTION get_accuracy_rate(p_user_id INT)
RETURNS NUMERIC AS $$
DECLARE
    num_correct INT;
    num_total INT;
    accuracy NUMERIC;
BEGIN
    SELECT COUNT(*)
    INTO num_correct
    FROM user_responses ur
    INNER JOIN quiz_attempts qa ON ur.attempt_id = qa.attempt_id
    INNER JOIN answers a ON ur.chosen_answer = a.answer_id
    WHERE qa.user_id = p_user_id AND a.is_correct = TRUE;

    SELECT COUNT(*)
    INTO num_total
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
CREATE OR REPLACE FUNCTION get_user_rank(p_user_id INT)
RETURNS INT AS $$
DECLARE
    user_rank INT;
BEGIN
    WITH ranked AS (
        SELECT u.user_id, RANK() OVER (ORDER BY COALESCE(SUM(ur.points_earned),0) DESC) AS rank
        FROM users u
        INNER JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
        LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
        WHERE r.role_name = 'Quiz Taker'
        GROUP BY u.user_id
    )
    SELECT rank INTO user_rank FROM ranked WHERE ranked.user_id = p_user_id;
    RETURN user_rank;
END;
$$ LANGUAGE plpgsql;
