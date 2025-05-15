CREATE OR REPLACE VIEW
    user_quiz_scores AS
SELECT
    qa.user_id,
    u.username,
    qa.quiz_id,
    q.quiz_title,
    SUM(ur.points_earned) AS total_points
FROM
    quiz_attempts qa
    INNER JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
    INNER JOIN users u ON qa.user_id = u.user_id
    INNER JOIN quizzes q ON qa.quiz_id = q.quiz_id
GROUP BY
    qa.user_id,
    u.username,
    qa.quiz_id,
    q.quiz_title
ORDER BY
    total_points DESC;

CREATE OR REPLACE VIEW
    user_total_points AS
SELECT
    u.user_id,
    u.username,
    COALESCE(SUM(ur.points_earned), 0) AS user_total_points
FROM
    users u
    LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
    LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
WHERE
    u.role_id = 1
GROUP BY
    u.user_id,
    u.username;

CREATE OR REPLACE VIEW
    user_category_scores AS
SELECT
    u.user_id,
    u.username,
    c.category_id,
    c.category_name,
    SUM(ur.points_earned) AS total_points
FROM
    users u
    INNER JOIN quiz_attempts qa ON u.user_id = qa.user_id
    INNER JOIN quizzes q ON qa.quiz_id = q.quiz_id
    INNER JOIN categories c ON q.category_id = c.category_id
    INNER JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
GROUP BY
    u.user_id,
    u.username,
    c.category_id,
    c.category_name;

CREATE OR REPLACE VIEW
    leaderboard AS
SELECT
    u.user_id,
    u.username,
    COALESCE(SUM(ur.points_earned), 0) AS total_points
FROM
    users u
    LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
    LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
WHERE
    u.role_id = 1
GROUP BY
    u.username,
    u.user_id
ORDER BY
    total_points DESC;

CREATE OR REPLACE VIEW
    quiz_statistics AS
SELECT
    q.quiz_id,
    q.quiz_title,
    COUNT(DISTINCT qa.attempt_id) AS num_attempts,
    AVG(ur.points_earned) AS avg_points_per_response
FROM
    quizzes q
    LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
    LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
GROUP BY
    q.quiz_id,
    q.quiz_title;

CREATE OR REPLACE VIEW
    active_categories AS
SELECT
    category_id,
    category_name,
    category_description
FROM
    categories
WHERE
    deactivated_at IS NULL
ORDER BY
    category_name ASC;

CREATE OR REPLACE VIEW
    active_questions AS
SELECT
    question_id,
    quiz_id,
    question_text,
    difficulty_id
FROM
    questions
WHERE
    deactivated_at IS NULL;

CREATE OR REPLACE VIEW
    active_quizzes AS
SELECT
    q.quiz_id,
    q.quiz_title,
    q.quiz_description,
    q.category_id,
    q.created_by,
    q.created_at,
    c.category_name,
    c.category_description 
FROM
    quizzes q
LEFT JOIN
    categories c ON q.category_id = c.category_id
WHERE
    q.deactivated_at IS NULL
    AND (c.deactivated_at IS NULL OR q.category_id IS NULL)
ORDER BY
    q.created_at DESC;