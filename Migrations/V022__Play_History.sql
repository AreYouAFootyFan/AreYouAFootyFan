CREATE OR REPLACE FUNCTION get_user_play_history(p_user_id INT)
RETURNS TABLE (
    quiz_id INT,
    quiz_title VARCHAR(64),
    category_name VARCHAR(32),
    total_score INT,
    attempt_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    WITH FirstAttempts AS (
        SELECT 
            qa.quiz_id,
            qa.attempt_id,
            qa.start_time,
            ROW_NUMBER() OVER (PARTITION BY qa.quiz_id ORDER BY qa.start_time ASC) as attempt_number
        FROM quiz_attempts qa
        WHERE qa.user_id = p_user_id
    )
    SELECT 
        q.quiz_id,
        q.quiz_title,
        c.category_name,
        COALESCE(SUM(ur.points_earned)::INTEGER, 0) as total_score,
        fa.start_time as attempt_date
    FROM FirstAttempts fa
    JOIN quizzes q ON q.quiz_id = fa.quiz_id
    JOIN categories c ON c.category_id = q.category_id
    LEFT JOIN user_responses ur ON ur.attempt_id = fa.attempt_id
    WHERE fa.attempt_number = 1
    GROUP BY q.quiz_id, q.quiz_title, c.category_name, fa.start_time
    ORDER BY fa.start_time DESC;
END;
$$ LANGUAGE plpgsql;
