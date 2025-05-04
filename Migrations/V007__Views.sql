/*
    View: user_quiz_scores
    Shows the total accumulated score for each user on each quiz they have attempted.
    Columns: user_id, username, quiz_id, quiz_title, total_points
    Ordered by total_points descending (highest first).
*/
CREATE OR REPLACE VIEW user_quiz_scores AS
SELECT 
    qa.user_id,
    u.username,
    qa.quiz_id,
    q.quiz_title,
    SUM(ur.points_earned) AS total_points
FROM 
    quiz_attempts qa
INNER JOIN 
    user_responses ur ON qa.attempt_id = ur.attempt_id
INNER JOIN 
    users u ON qa.user_id = u.user_id
INNER JOIN 
    quizzes q ON qa.quiz_id = q.quiz_id
GROUP BY 
    qa.user_id, u.username, qa.quiz_id, q.quiz_title
ORDER BY
    total_points DESC;

/*
    View: user_total_points
    Shows the total accumulated points for each user with the 'Quiz Taker' role.
    Columns: user_id, username, total_points
*/
CREATE OR REPLACE VIEW user_total_points AS
SELECT 
    u.user_id,
    u.username,
    COALESCE(SUM(ur.points_earned), 0) AS total_points
FROM 
    users u
JOIN 
    roles r ON u.role_id = r.role_id
LEFT JOIN 
    quiz_attempts qa ON u.user_id = qa.user_id
LEFT JOIN 
    user_responses ur ON qa.attempt_id = ur.attempt_id
WHERE 
    r.role_name = 'Quiz Taker'
GROUP BY 
    u.user_id, u.username;

/*
    View: user_category_scores
    Shows each user's accumulated score for quizzes in each category.
    Columns: user_id, username, category_id, category_name, total_points
*/
CREATE OR REPLACE VIEW user_category_scores AS
SELECT
    u.user_id,
    u.username,
    c.category_id,
    c.category_name,
    SUM(ur.points_earned) AS total_points
FROM
    users u
JOIN
    quiz_attempts qa ON u.user_id = qa.user_id
JOIN
    quizzes q ON qa.quiz_id = q.quiz_id
JOIN
    categories c ON q.category_id = c.category_id
JOIN
    user_responses ur ON qa.attempt_id = ur.attempt_id
GROUP BY
    u.user_id, u.username, c.category_id, c.category_name;

/*
    View: leaderboard
    Shows the top users by total points (only Quiz Takers)
*/
CREATE OR REPLACE VIEW leaderboard AS
SELECT
    u.user_id,
    u.username,
    COALESCE(SUM(ur.points_earned), 0) AS total_points
FROM users u
JOIN roles r ON u.role_id = r.role_id
LEFT JOIN quiz_attempts qa ON u.user_id = qa.user_id
LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
WHERE r.role_name = 'Quiz Taker'
GROUP BY u.user_id, u.username
ORDER BY total_points DESC
LIMIT 10;

/*
    View: quiz_statistics
    Shows number of attempts and average score for each quiz
*/
CREATE OR REPLACE VIEW quiz_statistics AS
SELECT
    q.quiz_id,
    q.quiz_title,
    COUNT(DISTINCT qa.attempt_id) AS num_attempts,
    AVG(ur.points_earned) AS avg_points_per_response
FROM quizzes q
LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id
LEFT JOIN user_responses ur ON qa.attempt_id = ur.attempt_id
GROUP BY q.quiz_id, q.quiz_title;