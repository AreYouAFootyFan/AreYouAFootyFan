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
    -- Get category ID for Football History
    SELECT category_id INTO v_category_id FROM categories WHERE category_name = 'Football History';
    
    -- Get difficulty IDs
    SELECT difficulty_id INTO v_easy_difficulty FROM difficulty_levels WHERE difficulty_level = 'Easy';
    SELECT difficulty_id INTO v_medium_difficulty FROM difficulty_levels WHERE difficulty_level = 'Medium';
    SELECT difficulty_id INTO v_hard_difficulty FROM difficulty_levels WHERE difficulty_level = 'Hard';

    -- Quiz 1: World Cup Origins
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('World Cup Origins', 'Test your knowledge about the early days of the FIFA World Cup', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    -- Questions for Quiz 1
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which country hosted the first FIFA World Cup in 1930?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Uruguay', TRUE),
    (v_question_id, 'Brazil', FALSE),
    (v_question_id, 'France', FALSE),
    (v_question_id, 'Italy', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'How many teams participated in the first World Cup?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '13', TRUE),
    (v_question_id, '8', FALSE),
    (v_question_id, '16', FALSE),
    (v_question_id, '24', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Who won the first World Cup final?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Uruguay', TRUE),
    (v_question_id, 'Argentina', FALSE),
    (v_question_id, 'Brazil', FALSE),
    (v_question_id, 'Italy', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'What was the score in the first World Cup final?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '4-2', TRUE),
    (v_question_id, '2-1', FALSE),
    (v_question_id, '3-0', FALSE),
    (v_question_id, '1-0', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which European teams withdrew from the first World Cup due to the long journey to Uruguay?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'All except France, Belgium, Romania and Yugoslavia', TRUE),
    (v_question_id, 'Only England and Italy', FALSE),
    (v_question_id, 'Only Germany and Spain', FALSE),
    (v_question_id, 'No European teams withdrew', FALSE);

    -- Quiz 2: Legendary Players
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Legendary Players', 'Explore the history of football through its greatest players', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Who was nicknamed "The Black Pearl"?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Pelé', TRUE),
    (v_question_id, 'Eusébio', FALSE),
    (v_question_id, 'Garrincha', FALSE),
    (v_question_id, 'Didier Drogba', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which year did Diego Maradona lead Argentina to World Cup victory?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1986', TRUE),
    (v_question_id, '1982', FALSE),
    (v_question_id, '1990', FALSE),
    (v_question_id, '1978', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Who is the all-time top scorer in international football?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Cristiano Ronaldo', TRUE),
    (v_question_id, 'Ali Daei', FALSE),
    (v_question_id, 'Lionel Messi', FALSE),
    (v_question_id, 'Ferenc Puskás', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player was known as "The Flying Dutchman"?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Johan Cruyff', TRUE),
    (v_question_id, 'Marco van Basten', FALSE),
    (v_question_id, 'Ruud Gullit', FALSE),
    (v_question_id, 'Dennis Bergkamp', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Who was the first player to win three World Cups?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Pelé', TRUE),
    (v_question_id, 'Garrincha', FALSE),
    (v_question_id, 'Franz Beckenbauer', FALSE),
    (v_question_id, 'Mario Zagallo', FALSE);

    -- Quiz 3: Historic Matches
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Historic Matches', 'Relive some of the most memorable matches in football history', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which match is known as "The Game of the Century"?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Italy vs West Germany (4-3, 1970 World Cup)', TRUE),
    (v_question_id, 'Brazil vs Italy (4-1, 1970 World Cup Final)', FALSE),
    (v_question_id, 'Hungary vs England (6-3, 1953)', FALSE),
    (v_question_id, 'Brazil vs Uruguay (1-2, 1950 World Cup Final)', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'What was the score in the famous "Maracanazo" match of 1950?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Uruguay 2-1 Brazil', TRUE),
    (v_question_id, 'Uruguay 1-0 Brazil', FALSE),
    (v_question_id, 'Uruguay 3-1 Brazil', FALSE),
    (v_question_id, 'Uruguay 2-0 Brazil', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'In which year did England win their only World Cup?', v_easy_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1966', TRUE),
    (v_question_id, '1970', FALSE),
    (v_question_id, '1962', FALSE),
    (v_question_id, '1958', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which match featured the infamous "Hand of God" goal?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Argentina vs England (1986 World Cup)', TRUE),
    (v_question_id, 'Argentina vs Brazil (1990 World Cup)', FALSE),
    (v_question_id, 'Argentina vs Germany (1986 World Cup Final)', FALSE),
    (v_question_id, 'Argentina vs England (1982 World Cup)', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'What was the score in the 1953 match when Hungary ended England''s unbeaten home record?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '6-3', TRUE),
    (v_question_id, '5-2', FALSE),
    (v_question_id, '4-2', FALSE),
    (v_question_id, '3-1', FALSE);

    -- Quiz 4: Evolution of Football
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Evolution of Football', 'Trace the development of football through the ages', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When were the first official football rules written?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1863', TRUE),
    (v_question_id, '1850', FALSE),
    (v_question_id, '1875', FALSE),
    (v_question_id, '1890', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When was the offside rule first introduced?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1866', TRUE),
    (v_question_id, '1875', FALSE),
    (v_question_id, '1888', FALSE),
    (v_question_id, '1900', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When were substitutions first allowed in the World Cup?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1970', TRUE),
    (v_question_id, '1962', FALSE),
    (v_question_id, '1966', FALSE),
    (v_question_id, '1974', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When was the back-pass rule changed to prevent goalkeepers handling the ball?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1992', TRUE),
    (v_question_id, '1986', FALSE),
    (v_question_id, '1990', FALSE),
    (v_question_id, '1994', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When were yellow and red cards first introduced?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1970', TRUE),
    (v_question_id, '1966', FALSE),
    (v_question_id, '1974', FALSE),
    (v_question_id, '1978', FALSE);

    -- Quiz 5: Historic Clubs
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Historic Clubs', 'Test your knowledge about the most historic football clubs', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which is the oldest professional football club in the world?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Notts County', TRUE),
    (v_question_id, 'Sheffield FC', FALSE),
    (v_question_id, 'Aston Villa', FALSE),
    (v_question_id, 'Preston North End', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which team was the first to win the European Cup (now Champions League)?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Real Madrid', TRUE),
    (v_question_id, 'Benfica', FALSE),
    (v_question_id, 'AC Milan', FALSE),
    (v_question_id, 'Inter Milan', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which English club was the first to win a European trophy?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Tottenham Hotspur', TRUE),
    (v_question_id, 'Manchester United', FALSE),
    (v_question_id, 'Liverpool', FALSE),
    (v_question_id, 'Nottingham Forest', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which club won the first Serie A title?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Genoa', TRUE),
    (v_question_id, 'Juventus', FALSE),
    (v_question_id, 'AC Milan', FALSE),
    (v_question_id, 'Inter Milan', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which club was the first to win the treble (League, Cup, and European Cup)?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Celtic', TRUE),
    (v_question_id, 'Ajax', FALSE),
    (v_question_id, 'Manchester United', FALSE),
    (v_question_id, 'Bayern Munich', FALSE);

    -- Quiz 6: World Cup Records
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('World Cup Records', 'Test your knowledge of World Cup records and statistics', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which country has won the most World Cups?', v_easy_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Brazil', TRUE),
    (v_question_id, 'Germany', FALSE),
    (v_question_id, 'Italy', FALSE),
    (v_question_id, 'Argentina', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Who holds the record for most goals in a single World Cup tournament?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Just Fontaine', TRUE),
    (v_question_id, 'Gerd Müller', FALSE),
    (v_question_id, 'Miroslav Klose', FALSE),
    (v_question_id, 'Eusébio', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player has appeared in the most World Cup tournaments?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Lionel Messi', TRUE),
    (v_question_id, 'Lothar Matthäus', FALSE),
    (v_question_id, 'Cristiano Ronaldo', FALSE),
    (v_question_id, 'Diego Maradona', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'What is the highest scoring World Cup match ever?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Austria 7-5 Switzerland (1954)', TRUE),
    (v_question_id, 'Hungary 10-1 El Salvador (1982)', FALSE),
    (v_question_id, 'Yugoslavia 9-0 Zaire (1974)', FALSE),
    (v_question_id, 'Germany 8-0 Saudi Arabia (2002)', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Who is the oldest player to score in a World Cup?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Roger Milla', TRUE),
    (v_question_id, 'Peter Shilton', FALSE),
    (v_question_id, 'Pat Jennings', FALSE),
    (v_question_id, 'Dino Zoff', FALSE);

    -- Quiz 7: Football Innovations
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Football Innovations', 'Learn about the technological and rule changes that shaped modern football', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When was VAR (Video Assistant Referee) first used in a World Cup?', v_easy_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '2018', TRUE),
    (v_question_id, '2014', FALSE),
    (v_question_id, '2022', FALSE),
    (v_question_id, '2016', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When was goal-line technology first used in a major tournament?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '2014 World Cup', TRUE),
    (v_question_id, '2012 Euros', FALSE),
    (v_question_id, '2016 Euros', FALSE),
    (v_question_id, '2010 World Cup', FALSE);

    -- Additional questions for Quiz 7: Football Innovations
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When was the first electronic scoreboard used in football?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1962', TRUE),
    (v_question_id, '1954', FALSE),
    (v_question_id, '1970', FALSE),
    (v_question_id, '1958', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which World Cup first used microchipped balls?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '2006', TRUE),
    (v_question_id, '2002', FALSE),
    (v_question_id, '2010', FALSE),
    (v_question_id, '2014', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When was the first football match broadcast live on radio?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1927', TRUE),
    (v_question_id, '1920', FALSE),
    (v_question_id, '1932', FALSE),
    (v_question_id, '1925', FALSE);

    -- Quiz 8: Historic National Teams
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Historic National Teams', 'Explore the history of national team football', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which national team is known as the "Magical Magyars"?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Hungary', TRUE),
    (v_question_id, 'Portugal', FALSE),
    (v_question_id, 'Netherlands', FALSE),
    (v_question_id, 'Croatia', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which team won the first European Championship (Euro)?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Soviet Union', TRUE),
    (v_question_id, 'Spain', FALSE),
    (v_question_id, 'West Germany', FALSE),
    (v_question_id, 'Italy', FALSE);

    -- Additional questions for Quiz 8: Historic National Teams
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which national team was known as the "Golden Team"?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Hungary 1950s', TRUE),
    (v_question_id, 'Brazil 1970', FALSE),
    (v_question_id, 'Spain 2010', FALSE),
    (v_question_id, 'Netherlands 1974', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which national team has participated in every World Cup tournament?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Brazil', TRUE),
    (v_question_id, 'Germany', FALSE),
    (v_question_id, 'Argentina', FALSE),
    (v_question_id, 'Italy', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which national team was the first Asian team to reach World Cup semi-finals?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'South Korea', TRUE),
    (v_question_id, 'Japan', FALSE),
    (v_question_id, 'Saudi Arabia', FALSE),
    (v_question_id, 'Iran', FALSE);

    -- Quiz 9: Football Tactics History
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Football Tactics History', 'Learn about the evolution of football tactics', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which country invented "Total Football"?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Netherlands', TRUE),
    (v_question_id, 'Brazil', FALSE),
    (v_question_id, 'Germany', FALSE),
    (v_question_id, 'Hungary', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which formation was known as the "WM Formation"?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '3-2-2-3', TRUE),
    (v_question_id, '4-4-2', FALSE),
    (v_question_id, '3-5-2', FALSE),
    (v_question_id, '4-3-3', FALSE);

    -- Additional questions for Quiz 9: Football Tactics History
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which manager pioneered the "Catenaccio" defensive system?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Helenio Herrera', TRUE),
    (v_question_id, 'Arrigo Sacchi', FALSE),
    (v_question_id, 'Rinus Michels', FALSE),
    (v_question_id, 'Vittorio Pozzo', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which team first used the "False 9" position in modern football?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Roma (Luciano Spalletti with Totti)', TRUE),
    (v_question_id, 'Barcelona (Guardiola with Messi)', FALSE),
    (v_question_id, 'Manchester United (Ferguson with Rooney)', FALSE),
    (v_question_id, 'Real Madrid (Del Bosque with Raúl)', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which formation was known as the "Magic Square"?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Brazil''s 1982 midfield setup', TRUE),
    (v_question_id, 'Ajax''s 1995 formation', FALSE),
    (v_question_id, 'AC Milan''s 1989 system', FALSE),
    (v_question_id, 'Real Madrid''s 1960 structure', FALSE);

    -- Quiz 10: Football Culture History
    INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by)
    VALUES ('Football Culture History', 'Explore the cultural impact of football through history', v_category_id, 1)
    RETURNING quiz_id INTO v_quiz_id;

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which country started the tradition of football scarves?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'England', TRUE),
    (v_question_id, 'Scotland', FALSE),
    (v_question_id, 'Italy', FALSE),
    (v_question_id, 'Germany', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When was the first football chant recorded?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1890s', TRUE),
    (v_question_id, '1900s', FALSE),
    (v_question_id, '1920s', FALSE),
    (v_question_id, '1880s', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which club started the tradition of playing music after scoring a goal?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Liverpool', TRUE),
    (v_question_id, 'Manchester United', FALSE),
    (v_question_id, 'Arsenal', FALSE),
    (v_question_id, 'Chelsea', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'When was the first football fan club officially established?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, '1885', TRUE),
    (v_question_id, '1901', FALSE),
    (v_question_id, '1892', FALSE),
    (v_question_id, '1878', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which stadium first introduced executive boxes?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Goodison Park', TRUE),
    (v_question_id, 'Old Trafford', FALSE),
    (v_question_id, 'Highbury', FALSE),
    (v_question_id, 'Anfield', FALSE);

END $$;
