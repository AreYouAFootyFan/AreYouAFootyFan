WITH role_id_query AS (
  SELECT role_id FROM roles WHERE role_name = 'quiz_maker'
)

INSERT INTO users (google_id, username, role_id)
VALUES ('temp_google_id_123', 'temp_admin', (SELECT role_id FROM role_id_query))
RETURNING user_id, username, role_id;

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