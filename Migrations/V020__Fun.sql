-- Declare variables for category and difficulty IDs
DO $$
DECLARE
    v_category_id INT;
    v_easy_difficulty INT;
    v_medium_difficulty INT;
    v_hard_difficulty INT;
    v_quiz_id INT;
    v_question_id INT;
BEGIN
    -- Get category ID for Fun & Miscellaneous
    SELECT category_id INTO v_category_id FROM categories WHERE category_name = 'Fun & Miscellaneous';
    
    -- Get difficulty IDs
    SELECT difficulty_id INTO v_easy_difficulty FROM difficulty_levels WHERE difficulty_level = 'Easy';
    SELECT difficulty_id INTO v_medium_difficulty FROM difficulty_levels WHERE difficulty_level = 'Medium';
    SELECT difficulty_id INTO v_hard_difficulty FROM difficulty_levels WHERE difficulty_level = 'Hard';

    -- Quiz 1: Funny Moments
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Funny Football Moments', 'Test your knowledge of hilarious incidents in football history', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player famously missed an open goal by trying to backheel it in while playing for Manchester City?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Mario Balotelli', TRUE),
    (v_question_id, 'Sergio Agüero', FALSE),
    (v_question_id, 'Carlos Tevez', FALSE),
    (v_question_id, 'Edin Džeko', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which goalkeeper ran to celebrate a goal only to watch the ball bounce over the net?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Massimo Taibi', TRUE),
    (v_question_id, 'Peter Schmeichel', FALSE),
    (v_question_id, 'David James', FALSE),
    (v_question_id, 'Fabien Barthez', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player celebrated a goal by getting a yellow card for taking a selfie with fans?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Francesco Totti', TRUE),
    (v_question_id, 'Mario Balotelli', FALSE),
    (v_question_id, 'Zlatan Ibrahimović', FALSE),
    (v_question_id, 'Paul Pogba', FALSE);

    -- Quiz 2: Unusual Records
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Unusual Football Records', 'Discover the weirdest records in football', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'What is the fastest red card in football history?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '2 seconds', TRUE),
    (v_question_id, '5 seconds', FALSE),
    (v_question_id, '10 seconds', FALSE),
    (v_question_id, '15 seconds', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which match holds the record for most own goals in a single game?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Madagascar league match (149-0 with 149 own goals)', TRUE),
    (v_question_id, 'Brazilian league match (11-0 with 8 own goals)', FALSE),
    (v_question_id, 'Scottish league match (36-0 with 15 own goals)', FALSE),
    (v_question_id, 'Nigerian league match (79-0 with 72 own goals)', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which goalkeeper holds the record for most goals scored?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Rogério Ceni', TRUE),
    (v_question_id, 'José Luis Chilavert', FALSE),
    (v_question_id, 'René Higuita', FALSE),
    (v_question_id, 'Jorge Campos', FALSE);

    -- Quiz 3: Animal Invasions
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Animals on the Pitch', 'Test your knowledge about famous animal pitch invasions', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which animal famously interrupted a match at Anfield in 2019?', v_easy_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Cat', TRUE),
    (v_question_id, 'Dog', FALSE),
    (v_question_id, 'Squirrel', FALSE),
    (v_question_id, 'Fox', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'In which country did a kangaroo stop play in 2018?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Australia', TRUE),
    (v_question_id, 'New Zealand', FALSE),
    (v_question_id, 'South Africa', FALSE),
    (v_question_id, 'England', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which bird species is famous for landing on football pitches in Turkey?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Eagle', TRUE),
    (v_question_id, 'Seagull', FALSE),
    (v_question_id, 'Pigeon', FALSE),
    (v_question_id, 'Crow', FALSE);

    -- Quiz 4: Funny Names
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Funny Football Names', 'Test your knowledge of players with unusual names', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player''s full name is "Bongo Christ"?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Danny Shittu', TRUE),
    (v_question_id, 'Norman Conquest', FALSE),
    (v_question_id, 'Johnny Mustard', FALSE),
    (v_question_id, 'Wolfgang Wolf', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which German team once had a coach with the same name as the team?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Wolfsburg (Wolfgang Wolf)', TRUE),
    (v_question_id, 'Hamburg (Hans Hamburg)', FALSE),
    (v_question_id, 'Bremen (Werner Bremen)', FALSE),
    (v_question_id, 'Stuttgart (Stefan Stuttgart)', FALSE);

    -- Quiz 5: Unusual Celebrations
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Unusual Goal Celebrations', 'Test your knowledge of the weirdest goal celebrations', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player celebrated by sitting in a car on the sidelines?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Pierre-Emerick Aubameyang', TRUE),
    (v_question_id, 'Mario Balotelli', FALSE),
    (v_question_id, 'Neymar', FALSE),
    (v_question_id, 'Paul Pogba', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player famously celebrated by playing the corner flag like a guitar?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Robbie Fowler', TRUE),
    (v_question_id, 'Alan Shearer', FALSE),
    (v_question_id, 'Eric Cantona', FALSE),
    (v_question_id, 'Paul Gascoigne', FALSE);

    -- Quiz 6: Weather Incidents
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Weather Chaos', 'Test your knowledge of weather-related football incidents', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'What weather phenomenon caused a match to be abandoned in Manchester in 2020?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Snow', TRUE),
    (v_question_id, 'Lightning', FALSE),
    (v_question_id, 'Fog', FALSE),
    (v_question_id, 'Hurricane', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which stadium is famous for having a match stopped due to solar glare?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Tottenham Hotspur Stadium', TRUE),
    (v_question_id, 'Allianz Arena', FALSE),
    (v_question_id, 'Emirates Stadium', FALSE),
    (v_question_id, 'Santiago Bernabéu', FALSE);

    -- Quiz 7: Mascot Mayhem
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Mascot Mayhem', 'Test your knowledge of football mascots and their antics', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which Premier League mascot was once sent off by the referee?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Cyril the Swan (Swansea)', TRUE),
    (v_question_id, 'Fred the Red (Manchester United)', FALSE),
    (v_question_id, 'Gunnersaurus (Arsenal)', FALSE),
    (v_question_id, 'Moonchester (Manchester City)', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which club''s mascot is a superhero called "Captain Blade"?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Sheffield United', TRUE),
    (v_question_id, 'West Ham United', FALSE),
    (v_question_id, 'Newcastle United', FALSE),
    (v_question_id, 'Leeds United', FALSE);

    -- Quiz 8: Stadium Oddities
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Stadium Oddities', 'Test your knowledge of unusual football grounds', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which stadium has a ship in it?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Raymond James Stadium', TRUE),
    (v_question_id, 'Allianz Arena', FALSE),
    (v_question_id, 'San Siro', FALSE),
    (v_question_id, 'Camp Nou', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which stadium has a pitch that slides out of the stadium?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Tottenham Hotspur Stadium', TRUE),
    (v_question_id, 'Allianz Arena', FALSE),
    (v_question_id, 'Emirates Stadium', FALSE),
    (v_question_id, 'Etihad Stadium', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which stadium has a corner missing because of a road?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Estadio Municipal de Braga', TRUE),
    (v_question_id, 'San Mamés', FALSE),
    (v_question_id, 'Parc des Princes', FALSE),
    (v_question_id, 'Stamford Bridge', FALSE);

    -- Quiz 9: Superstitions
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Football Superstitions', 'Test your knowledge of player and team superstitions', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player always stepped onto the pitch right foot first?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Paul Ince', TRUE),
    (v_question_id, 'David Beckham', FALSE),
    (v_question_id, 'John Terry', FALSE),
    (v_question_id, 'Steven Gerrard', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player always kissed his goalkeeper''s bald head before matches?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Laurent Blanc', TRUE),
    (v_question_id, 'Zinedine Zidane', FALSE),
    (v_question_id, 'Thierry Henry', FALSE),
    (v_question_id, 'Patrick Vieira', FALSE);

    -- Quiz 10: Funny Commentary
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Memorable Commentary', 'Test your knowledge of famous commentary moments', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Who said the famous line "They think it''s all over... it is now!"?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Kenneth Wolstenholme', TRUE),
    (v_question_id, 'John Motson', FALSE),
    (v_question_id, 'Barry Davies', FALSE),
    (v_question_id, 'Martin Tyler', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which commentator is famous for shouting "GOAL!" for almost a minute?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Andrés Cantor', TRUE),
    (v_question_id, 'Martin Tyler', FALSE),
    (v_question_id, 'Peter Drury', FALSE),
    (v_question_id, 'Jon Champion', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Who coined the phrase "Unbelievable Jeff!"?', v_easy_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Chris Kamara', TRUE),
    (v_question_id, 'Gary Neville', FALSE),
    (v_question_id, 'Jamie Carragher', FALSE),
    (v_question_id, 'Alan Smith', FALSE);

END $$;
