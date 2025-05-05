WITH role_id_query AS (
  SELECT role_id FROM roles WHERE role_name = 'Quiz Master'
)

INSERT INTO users (google_id, username, role_id)
VALUES ('temp_google_id_123', 'temp_admin', (SELECT role_id FROM role_id_query))
RETURNING user_id, username, role_id;

INSERT INTO users (google_id, username, role_id) VALUES
    ('google-uid-002', 'FootyFan1', 1);

INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
VALUES ('2010 FIFA World Cup Quiz', 'Test your knowledge about the 2010 FIFA World Cup tournament in South Africa', 6, 1)
RETURNING quiz_id;

INSERT INTO questions (quiz_id, question_text, difficulty_id)
VALUES 
(1, 'Which country hosted the 2010 FIFA World Cup?', 1),
(1, 'Who won the 2010 FIFA World Cup?', 1),
(1, 'Which player won the Golden Boot award (top scorer) in the 2010 World Cup?', 2),
(1, 'What was the name of the official match ball used in the 2010 World Cup?', 2),
(1, 'Which team did Spain defeat in the final to win the 2010 World Cup?', 1),
(1, 'Which Spanish player scored the winning goal in the final match?', 2),
(1, 'How many goals were scored in total during the 2010 World Cup tournament?', 3);

INSERT INTO answers (question_id, answer_text, is_correct)
VALUES 
(1, 'Brazil', FALSE),
(1, 'Germany', FALSE),
(1, 'South Africa', TRUE),
(1, 'Japan', FALSE),

(2, 'Brazil', FALSE),
(2, 'Germany', FALSE),
(2, 'Spain', TRUE),
(2, 'Netherlands', FALSE),

(3, 'David Villa', FALSE),
(3, 'Wesley Sneijder', FALSE),
(3, 'Thomas Müller', TRUE),
(3, 'Diego Forlán', FALSE),

(4, 'Teamgeist', FALSE),
(4, 'Jabulani', TRUE),
(4, 'Brazuca', FALSE),
(4, 'Telstar', FALSE),

(5, 'Germany', FALSE),
(5, 'Brazil', FALSE),
(5, 'Argentina', FALSE),
(5, 'Netherlands', TRUE),

(6, 'David Villa', FALSE),
(6, 'Fernando Torres', FALSE),
(6, 'Andrés Iniesta', TRUE),
(6, 'Xavi Hernández', FALSE),

(7, '145', TRUE),
(7, '171', FALSE),
(7, '157', FALSE),
(7, '132', FALSE);

INSERT INTO quizzes
    (quiz_title, quiz_description, category_id, created_by)
VALUES
    ('FIFA World Cup History', 'Test your knowledge of World Cup winners, hosts, and stats.', 1, 1),
    ('Premier League Records', 'Facts about all-time top scorers, fastest goals, and more.', 2, 1),
    ('Football Legends', 'Questions about Pelé, Maradona, Messi, and Ronaldo.', 3, 1);

-- Questions
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES 
    (2, 'Which country won the first FIFA World Cup in 1930?', 1),
    (2, 'Who is the all-time top scorer in World Cup history?', 2),
    (3, 'Which team has won the most Premier League titles?', 1),
    (3, 'Who scored the fastest Premier League hat-trick?', 3),
    (4, 'How many Ballon d''Or awards has Lionel Messi won?', 2),
    (4, 'Which legendary player is known as "The Hand of God"?', 1);

-- Answers
-- Q1
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (8, 'Brazil', false),
    (8, 'Uruguay', true),
    (8, 'Italy', false),
    (8, 'Germany', false);

-- Q2
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (9, 'Miroslav Klose', true),
    (9, 'Ronaldo Nazário', false),
    (9, 'Pelé', false),
    (9, 'Gerd Müller', false);

-- Q3
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (10, 'Liverpool', false),
    (10, 'Manchester United', true),
    (10, 'Arsenal', false),
    (10, 'Chelsea', false);

-- Q4
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (11, 'Sadio Mané', false),
    (11, 'Cristiano Ronaldo', false),
    (11, 'Sergio Agüero', false),
    (11, 'Sadio Mané', true);

-- Q5
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (12, '5', false),
    (12, '6', false),
    (12, '7', false),
    (12, '8', true);

-- Q6
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (13, 'Diego Maradona', true),
    (13, 'Zinedine Zidane', false),
    (13, 'Ronaldinho', false),
    (13, 'Pelé', false);

-- -- Quiz Attempts
-- INSERT INTO quiz_attempts (user_id, quiz_id) VALUES 
--     (2, 2),
--     (2, 3),
--     (2, 4);

-- -- User Responses
-- -- Attempt 1: User 2 takes Quiz 1 (Q1 + Q2)
-- INSERT INTO user_responses
--     (attempt_id, question_id, chosen_answer, points_earned)
-- VALUES 
--     (1, 1, 2, 5),  -- correct (Easy)
--     (1, 2, 5, 10); -- correct (Medium)

-- -- Attempt 2: User 2 takes Quiz 2 (Q3 + Q4)
-- INSERT INTO user_responses
--     (attempt_id, question_id, chosen_answer, points_earned)
-- VALUES 
--     (2, 3, 7, 5),  -- correct
--     (2, 4, 13, 20); -- correct (Hard)

-- -- Attempt 3: User 2 takes Quiz 3 (Q5 + Q6)
-- INSERT INTO user_responses
--     (attempt_id, question_id, chosen_answer, points_earned)
-- VALUES
--     (3, 5, 20, 20),  -- correct
--     (3, 6, 21, 5); -- correct

-- -- Badge History
-- INSERT INTO badge_history (user_id, badge_id) VALUES 
--     (2, 1), -- Rookie
--     (2, 2); -- Midfielder