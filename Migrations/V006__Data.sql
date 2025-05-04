INSERT INTO users (google_id, username, role_id) VALUES
    ('google-uid-001', 'Tevlen Naidoo', 2),
    ('google-uid-002', 'FootyFan1', 1);

INSERT INTO quizzes
    (quiz_title, quiz_description, category_id, created_by)
VALUES
    ('FIFA World Cup History', 'Test your knowledge of World Cup winners, hosts, and stats.', 1, 1),
    ('Premier League Records', 'Facts about all-time top scorers, fastest goals, and more.', 2, 1),
    ('Football Legends', 'Questions about Pelé, Maradona, Messi, and Ronaldo.', 3, 1);

-- Questions
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES 
    (1, 'Which country won the first FIFA World Cup in 1930?', 1),
    (1, 'Who is the all-time top scorer in World Cup history?', 2),
    (2, 'Which team has won the most Premier League titles?', 1),
    (2, 'Who scored the fastest Premier League hat-trick?', 3),
    (3, 'How many Ballon d''Or awards has Lionel Messi won?', 2),
    (3, 'Which legendary player is known as "The Hand of God"?', 1);

-- Answers
-- Q1
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (1, 'Brazil', false),
    (1, 'Uruguay', true),
    (1, 'Italy', false),
    (1, 'Germany', false);

-- Q2
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (2, 'Miroslav Klose', true),
    (2, 'Ronaldo Nazário', false),
    (2, 'Pelé', false),
    (2, 'Gerd Müller', false);

-- Q3
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (3, 'Liverpool', false),
    (3, 'Manchester United', true),
    (3, 'Arsenal', false),
    (3, 'Chelsea', false);

-- Q4
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (4, 'Sadio Mané', false),
    (4, 'Cristiano Ronaldo', false),
    (4, 'Sergio Agüero', false),
    (4, 'Sadio Mané', true);

-- Q5
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (5, '5', false),
    (5, '6', false),
    (5, '7', false),
    (5, '8', true);

-- Q6
INSERT INTO answers (question_id, answer_text, is_correct) VALUES 
    (6, 'Diego Maradona', true),
    (6, 'Zinedine Zidane', false),
    (6, 'Ronaldinho', false),
    (6, 'Pelé', false);

-- Quiz Attempts
INSERT INTO quiz_attempts (user_id, quiz_id) VALUES 
    (2, 1),
    (2, 2),
    (2, 3);

-- User Responses
-- Attempt 1: User 2 takes Quiz 1 (Q1 + Q2)
INSERT INTO user_responses
    (attempt_id, question_id, chosen_answer, points_earned)
VALUES 
    (1, 1, 2, 5),  -- correct (Easy)
    (1, 2, 5, 10); -- correct (Medium)

-- Attempt 2: User 2 takes Quiz 2 (Q3 + Q4)
INSERT INTO user_responses
    (attempt_id, question_id, chosen_answer, points_earned)
VALUES 
    (2, 3, 7, 5),  -- correct
    (2, 4, 13, 20); -- correct (Hard)

-- Attempt 3: User 2 takes Quiz 3 (Q5 + Q6)
INSERT INTO user_responses
    (attempt_id, question_id, chosen_answer, points_earned)
VALUES
    (3, 5, 20, 20),  -- correct
    (3, 6, 21, 5); -- correct

-- Badge History
INSERT INTO badge_history (user_id, badge_id) VALUES 
    (2, 1), -- Rookie
    (2, 2); -- Midfielder