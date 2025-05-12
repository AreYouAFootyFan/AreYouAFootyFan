-- Returns the user's top 3 categories based on accuracy score
CREATE OR REPLACE FUNCTION get_user_top_categories(p_user_id INT) 
RETURNS TABLE (
    category_id INT,
    category_name VARCHAR(32),
    accuracy_rate NUMERIC,
    total_questions INT
) AS $$
BEGIN
    RETURN QUERY
    WITH category_stats AS (
        -- Get user's responses for each question
        SELECT 
            c.category_id,
            c.category_name,
            -- Count correct answers
            COUNT(CASE WHEN a.is_correct = TRUE THEN 1 END) AS correct_answers,
            -- Count total answers
            COUNT(ur.response_id) AS total_questions
        FROM 
            user_responses ur
            INNER JOIN quiz_attempts qa ON ur.attempt_id = qa.attempt_id
            INNER JOIN questions qn ON ur.question_id = qn.question_id
            INNER JOIN quizzes qz ON qn.quiz_id = qz.quiz_id
            INNER JOIN categories c ON qz.category_id = c.category_id
            LEFT JOIN answers a ON ur.chosen_answer = a.answer_id
        WHERE 
            qa.user_id = p_user_id
            AND ur.chosen_answer IS NOT NULL -- Only count questions that were answered
        GROUP BY 
            c.category_id, c.category_name
        HAVING 
            COUNT(ur.response_id) > 0 -- Only include categories with at least one answered question
    )
    SELECT 
        cs.category_id,
        cs.category_name,
        -- Calculate accuracy rate (correct answers / total questions)
        CASE 
            WHEN cs.total_questions > 0 
            THEN (cs.correct_answers::NUMERIC / cs.total_questions::NUMERIC)
            ELSE 0
        END AS accuracy_rate,
        cs.total_questions
    FROM 
        category_stats cs
    ORDER BY 
        accuracy_rate DESC, -- Primary sort by accuracy
        total_questions DESC, -- Secondary sort by number of questions answered (more questions = more meaningful)
        category_name ASC -- Tertiary sort alphabetically for consistency
    LIMIT 3; -- Return only top 3 categories
END;
$$ LANGUAGE plpgsql;

-- Returns all quizzes created by a user with Manager role (role_id = 2)
CREATE OR REPLACE FUNCTION get_quizzes_created_by_manager(p_user_id INT) 
RETURNS TABLE (
    quiz_id INT,
    quiz_title VARCHAR(64),
    quiz_description VARCHAR(128),
    category_id INT,
    category_name VARCHAR(32),
    created_at TIMESTAMP,
    question_count BIGINT
) AS $$
DECLARE
    v_is_manager BOOLEAN;
BEGIN
    -- Check if the user has the Manager role (role_id = 2)
    SELECT EXISTS (
        SELECT 1 
        FROM users 
        WHERE user_id = p_user_id AND role_id = 2
    ) INTO v_is_manager;
    
    -- If user is not a manager, return empty result
    IF NOT v_is_manager THEN
        RAISE EXCEPTION 'User with ID % does not have Manager role', p_user_id;
        RETURN;
    END IF;
    
    -- Return quizzes created by the user
    RETURN QUERY
    SELECT 
        q.quiz_id,
        q.quiz_title,
        q.quiz_description,
        q.category_id,
        c.category_name,
        q.created_at,
        COUNT(qn.question_id) AS question_count
    FROM 
        quizzes q
        INNER JOIN categories c ON q.category_id = c.category_id
        LEFT JOIN questions qn ON q.quiz_id = qn.quiz_id
    WHERE 
        q.created_by = p_user_id
        AND q.deactivated_at IS NULL
    GROUP BY 
        q.quiz_id, 
        q.quiz_title, 
        q.quiz_description, 
        q.category_id, 
        c.category_name, 
        q.created_at
    ORDER BY 
        q.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Returns the average accuracy score of all users on quizzes created by a specific manager
CREATE OR REPLACE FUNCTION get_manager_quizzes_accuracy(p_manager_id INT)
RETURNS TABLE (
    quiz_id INT,
    quiz_title VARCHAR(64),
    category_name VARCHAR(32),
    total_attempts BIGINT,
    user_count BIGINT,
    avg_accuracy NUMERIC
) AS $$
DECLARE
    v_is_manager BOOLEAN;
BEGIN
    -- Check if the user has the Manager role (role_id = 2)
    SELECT EXISTS (
        SELECT 1 
        FROM users 
        WHERE user_id = p_manager_id AND role_id = 2
    ) INTO v_is_manager;
    
    -- If user is not a manager, raise an exception
    IF NOT v_is_manager THEN
        RAISE EXCEPTION 'User with ID % does not have Manager role', p_manager_id;
        RETURN;
    END IF;
    
    -- Return accuracy statistics for each quiz created by the manager
    RETURN QUERY
    WITH quiz_stats AS (
        SELECT
            q.quiz_id,
            q.quiz_title,
            c.category_name,
            qa.attempt_id,
            qa.user_id,
            -- Count correct answers in this attempt
            COUNT(CASE WHEN a.is_correct = TRUE THEN 1 END) AS correct_answers,
            -- Count total answers in this attempt
            COUNT(ur.response_id) AS total_answers
        FROM
            quizzes q
            INNER JOIN categories c ON q.category_id = c.category_id
            INNER JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
            INNER JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
            LEFT JOIN answers a ON ur.chosen_answer = a.answer_id
        WHERE
            q.created_by = p_manager_id
            AND q.deactivated_at IS NULL
            AND ur.chosen_answer IS NOT NULL -- Only count questions that were answered
        GROUP BY
            q.quiz_id,
            q.quiz_title,
            c.category_name,
            qa.attempt_id,
            qa.user_id
    )
    SELECT
        qs.quiz_id,
        qs.quiz_title,
        qs.category_name,
        COUNT(DISTINCT qs.attempt_id) AS total_attempts,
        COUNT(DISTINCT qs.user_id) AS user_count,
        CASE
            WHEN SUM(qs.total_answers) > 0
            THEN (SUM(qs.correct_answers)::NUMERIC / SUM(qs.total_answers))
            ELSE 0
        END AS avg_accuracy
    FROM
        quiz_stats qs
    GROUP BY
        qs.quiz_id,
        qs.quiz_title,
        qs.category_name
    ORDER BY
        avg_accuracy DESC,
        total_attempts DESC;
END;
$$ LANGUAGE plpgsql;

-- Returns the number of quiz attempts on quizzes created by a specific manager
CREATE OR REPLACE FUNCTION get_manager_quiz_attempts(p_manager_id INT)
RETURNS TABLE (
    quiz_id INT,
    quiz_title VARCHAR(64),
    category_name VARCHAR(32),
    attempt_count BIGINT,
    unique_users BIGINT,
    complete_attempts BIGINT,
    incomplete_attempts BIGINT,
    avg_score NUMERIC
) AS $$
DECLARE
    v_is_manager BOOLEAN;
BEGIN
    -- Check if the user has the Manager role (role_id = 2)
    SELECT EXISTS (
        SELECT 1 
        FROM users 
        WHERE user_id = p_manager_id AND role_id = 2
    ) INTO v_is_manager;
    
    -- If user is not a manager, raise an exception
    IF NOT v_is_manager THEN
        RAISE EXCEPTION 'User with ID % does not have Manager role', p_manager_id;
        RETURN;
    END IF;
    
    -- Return attempt statistics for each quiz created by the manager
    RETURN QUERY
    SELECT
        q.quiz_id,
        q.quiz_title,
        c.category_name,
        COUNT(qa.attempt_id) AS attempt_count,
        COUNT(DISTINCT qa.user_id) AS unique_users,
        COUNT(CASE WHEN qa.end_time IS NOT NULL THEN 1 END) AS complete_attempts,
        COUNT(CASE WHEN qa.end_time IS NULL THEN 1 END) AS incomplete_attempts,
        COALESCE(AVG(
            (SELECT SUM(ur.points_earned) 
             FROM user_responses ur 
             WHERE ur.attempt_id = qa.attempt_id)
        ), 0)::NUMERIC AS avg_score
    FROM
        quizzes q
        INNER JOIN categories c ON q.category_id = c.category_id
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
    WHERE
        q.created_by = p_manager_id
        AND q.deactivated_at IS NULL
    GROUP BY
        q.quiz_id,
        q.quiz_title,
        c.category_name
    ORDER BY
        attempt_count DESC,
        unique_users DESC;
END;
$$ LANGUAGE plpgsql;

-- Returns the top categories where a manager has created quizzes
CREATE OR REPLACE FUNCTION get_manager_top_categories(p_manager_id INT)
RETURNS TABLE (
    category_id INT,
    category_name VARCHAR(32),
    category_description VARCHAR(64),
    quiz_count BIGINT,
    question_count BIGINT,
    attempt_count BIGINT
) AS $$
DECLARE
    v_is_manager BOOLEAN;
    v_category_count INT;
BEGIN
    -- Check if the user has the Manager role (role_id = 2)
    SELECT EXISTS (
        SELECT 1 
        FROM users 
        WHERE user_id = p_manager_id AND role_id = 2
    ) INTO v_is_manager;
    
    -- If user is not a manager, raise an exception
    IF NOT v_is_manager THEN
        RAISE EXCEPTION 'User with ID % does not have Manager role', p_manager_id;
        RETURN;
    END IF;
    
    -- Count how many categories the manager has created quizzes in
    SELECT COUNT(DISTINCT q.category_id)
    INTO v_category_count
    FROM quizzes q
    WHERE q.created_by = p_manager_id 
    AND q.deactivated_at IS NULL;
    
    -- Return all categories if the manager has created quizzes in 3 or fewer categories
    -- Otherwise return the top 3 categories with the most quizzes
    IF v_category_count <= 3 THEN
        RETURN QUERY
        SELECT
            c.category_id,
            c.category_name,
            c.category_description,
            COUNT(DISTINCT q.quiz_id) AS quiz_count,
            COUNT(DISTINCT qn.question_id) AS question_count,
            COUNT(DISTINCT qa.attempt_id) AS attempt_count
        FROM
            categories c
            INNER JOIN quizzes q ON c.category_id = q.category_id
            LEFT JOIN questions qn ON q.quiz_id = qn.quiz_id
            LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
        WHERE
            q.created_by = p_manager_id
            AND q.deactivated_at IS NULL
        GROUP BY
            c.category_id,
            c.category_name,
            c.category_description
        ORDER BY
            quiz_count DESC,
            attempt_count DESC;
    ELSE
        RETURN QUERY
        SELECT
            c.category_id,
            c.category_name,
            c.category_description,
            COUNT(DISTINCT q.quiz_id) AS quiz_count,
            COUNT(DISTINCT qn.question_id) AS question_count,
            COUNT(DISTINCT qa.attempt_id) AS attempt_count
        FROM
            categories c
            INNER JOIN quizzes q ON c.category_id = q.category_id
            LEFT JOIN questions qn ON q.quiz_id = qn.quiz_id
            LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
        WHERE
            q.created_by = p_manager_id
            AND q.deactivated_at IS NULL
        GROUP BY
            c.category_id,
            c.category_name,
            c.category_description
        ORDER BY
            quiz_count DESC,
            attempt_count DESC
        LIMIT 3;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Creates a view that ranks managers based on number of quizzes created
CREATE OR REPLACE VIEW manager_leaderboard AS
WITH manager_stats AS (
    SELECT 
        u.user_id,
        u.username,
        COUNT(DISTINCT q.quiz_id) AS quizzes_created,
        COUNT(DISTINCT qn.question_id) AS questions_created,
        COUNT(DISTINCT qa.attempt_id) AS quiz_attempts,
        COUNT(DISTINCT qa.user_id) AS unique_players,
        SUM(CASE WHEN qa.end_time IS NOT NULL THEN 1 ELSE 0 END) AS completed_attempts
    FROM 
        users u
        LEFT JOIN quizzes q ON u.user_id = q.created_by AND q.deactivated_at IS NULL
        LEFT JOIN questions qn ON q.quiz_id = qn.quiz_id AND qn.deactivated_at IS NULL
        LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
    WHERE 
        u.role_id = 2  -- Manager role
        AND u.deactivated_at IS NULL
    GROUP BY 
        u.user_id, 
        u.username
)
SELECT 
    ms.user_id,
    ms.username,
    ms.quizzes_created,
    ms.questions_created,
    ms.quiz_attempts,
    ms.unique_players,
    ms.completed_attempts,
    RANK() OVER (ORDER BY ms.quizzes_created DESC) AS rank_by_quizzes,
    RANK() OVER (ORDER BY ms.questions_created DESC) AS rank_by_questions,
    RANK() OVER (ORDER BY ms.quiz_attempts DESC) AS rank_by_attempts,
    RANK() OVER (ORDER BY ms.unique_players DESC) AS rank_by_players,
    CASE 
        WHEN ms.quiz_attempts > 0 
        THEN (ms.completed_attempts::NUMERIC / ms.quiz_attempts::NUMERIC)
        ELSE 0
    END AS completion_rate
FROM 
    manager_stats ms
ORDER BY 
    ms.quizzes_created DESC,
    ms.quiz_attempts DESC;