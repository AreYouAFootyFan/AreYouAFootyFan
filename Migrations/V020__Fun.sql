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

    -- Additional questions for Quiz 1: Funny Moments
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which goalkeeper ran to celebrate a clean sheet before the match was over, only to concede?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Shay Given', TRUE),
    (v_question_id, 'David Seaman', FALSE),
    (v_question_id, 'Peter Schmeichel', FALSE),
    (v_question_id, 'Edwin van der Sar', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player accidentally scored while trying to give the ball back to the opposing team?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Luiz Adriano', TRUE),
    (v_question_id, 'Miroslav Klose', FALSE),
    (v_question_id, 'Paolo Di Canio', FALSE),
    (v_question_id, 'Robbie Fowler', FALSE);

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

    -- Additional questions for Quiz 2: Unusual Records
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player holds the record for fastest hat-trick in Premier League history?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Sadio Mané', TRUE),
    (v_question_id, 'Alan Shearer', FALSE),
    (v_question_id, 'Robbie Fowler', FALSE),
    (v_question_id, 'Ole Gunnar Solskjær', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which match holds the record for most penalties in a shootout?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'KK Palace vs Namibia Natives (48 penalties)', TRUE),
    (v_question_id, 'Frankfurt vs Waldorf Mannheim (42 penalties)', FALSE),
    (v_question_id, 'Brockenhurst vs Andover Town (29 penalties)', FALSE),
    (v_question_id, 'Liverpool vs Middlesbrough (30 penalties)', FALSE);

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

    -- Additional questions for Quiz 3: Animals on the Pitch
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which bird is famous for landing on James Rodriguez during a Colombia match?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Green Grasshopper', TRUE),
    (v_question_id, 'White Dove', FALSE),
    (v_question_id, 'Yellow Canary', FALSE),
    (v_question_id, 'Blue Jay', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which animal invaded a Swiss Super League match in 2021, causing a delay?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Pine Marten', TRUE),
    (v_question_id, 'Red Fox', FALSE),
    (v_question_id, 'Wild Rabbit', FALSE),
    (v_question_id, 'Mountain Goat', FALSE);

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

    -- Additional questions for Quiz 4: Funny Names
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which Brazilian player''s name translates to "Little Onion"?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Cebollinha', TRUE),
    (v_question_id, 'Alface', FALSE),
    (v_question_id, 'Tomate', FALSE),
    (v_question_id, 'Batata', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player''s name means "Thanks Dad" in English?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Thankgod Amaefule', TRUE),
    (v_question_id, 'Papa Bouba Diop', FALSE),
    (v_question_id, 'Sunday Oliseh', FALSE),
    (v_question_id, 'Emmanuel Adebayor', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player was nicknamed "Three Lungs"?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Park Ji-sung', TRUE),
    (v_question_id, 'N''Golo Kanté', FALSE),
    (v_question_id, 'Dirk Kuyt', FALSE),
    (v_question_id, 'James Milner', FALSE);

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

    -- Additional questions for Quiz 5: Unusual Celebrations
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player celebrated by pretending to be a dog?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Finidi George', TRUE),
    (v_question_id, 'Emmanuel Adebayor', FALSE),
    (v_question_id, 'Luis Suarez', FALSE),
    (v_question_id, 'Daniel Sturridge', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player celebrated by sitting in a chair?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Tim Cahill', TRUE),
    (v_question_id, 'Robbie Keane', FALSE),
    (v_question_id, 'Peter Crouch', FALSE),
    (v_question_id, 'Wayne Rooney', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player famously celebrated by hiding in a bin?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Clinton Morrison', TRUE),
    (v_question_id, 'Jimmy Bullard', FALSE),
    (v_question_id, 'Craig Bellamy', FALSE),
    (v_question_id, 'Kevin Nolan', FALSE);

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

    -- Additional questions for Quiz 6: Weather Chaos
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which stadium had a match postponed due to a swarm of moths in 2016?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Stade de France', TRUE),
    (v_question_id, 'Wembley Stadium', FALSE),
    (v_question_id, 'Allianz Arena', FALSE),
    (v_question_id, 'San Siro', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which English ground is famous for games being called off due to waterlogged pitch despite no rain?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'The Dell', TRUE),
    (v_question_id, 'Highbury', FALSE),
    (v_question_id, 'Maine Road', FALSE),
    (v_question_id, 'White Hart Lane', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which stadium had its roof collapse due to snow in 2010?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Metrodome', TRUE),
    (v_question_id, 'Allianz Arena', FALSE),
    (v_question_id, 'Amsterdam Arena', FALSE),
    (v_question_id, 'Millennium Stadium', FALSE);

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

    -- Additional questions for Quiz 7: Mascot Mayhem
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which club''s mascot was "saved" after a crowdfunding campaign in 2020?', v_easy_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Arsenal (Gunnersaurus)', TRUE),
    (v_question_id, 'Chelsea (Stamford)', FALSE),
    (v_question_id, 'Liverpool (Mighty Red)', FALSE),
    (v_question_id, 'Manchester United (Fred the Red)', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which mascot got into a fight with a rival team''s fan?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Deepdale Duck', TRUE),
    (v_question_id, 'Hammerhead', FALSE),
    (v_question_id, 'Chirpy', FALSE),
    (v_question_id, 'Hercules the Lion', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which mascot performed a dance routine that went viral on social media?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Boiler Man', TRUE),
    (v_question_id, 'Harry the Hornet', FALSE),
    (v_question_id, 'Sammy the Saint', FALSE),
    (v_question_id, 'Changy the Elephant', FALSE);

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

    -- Additional questions for Quiz 8: Stadium Oddities
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which stadium has a windmill next to it?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Het Kasteel', TRUE),
    (v_question_id, 'Johan Cruyff Arena', FALSE),
    (v_question_id, 'De Kuip', FALSE),
    (v_question_id, 'Philips Stadion', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which stadium has a castle in its name and structure?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Estadio da Luz', TRUE),
    (v_question_id, 'Stamford Bridge', FALSE),
    (v_question_id, 'Anfield', FALSE),
    (v_question_id, 'Old Trafford', FALSE);

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

    -- Additional questions for Quiz 9: Superstitions
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player always waited for his teammates to leave the dressing room before leaving himself?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Kolo Touré', TRUE),
    (v_question_id, 'Didier Drogba', FALSE),
    (v_question_id, 'Frank Lampard', FALSE),
    (v_question_id, 'Rio Ferdinand', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which player always touched the grass and crossed himself before entering the pitch?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Cristiano Ronaldo', TRUE),
    (v_question_id, 'Lionel Messi', FALSE),
    (v_question_id, 'Neymar', FALSE),
    (v_question_id, 'Kaká', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which goalkeeper always chewed gum during matches for good luck?', v_hard_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Gary Lineker', TRUE),
    (v_question_id, 'Peter Schmeichel', FALSE),
    (v_question_id, 'Oliver Kahn', FALSE),
    (v_question_id, 'Gianluigi Buffon', FALSE);

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

    -- Additional questions for Quiz 10: Funny Commentary
    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Who famously said "And Solskjær has won it!" in 1999?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Clive Tyldesley', TRUE),
    (v_question_id, 'Martin Tyler', FALSE),
    (v_question_id, 'John Motson', FALSE),
    (v_question_id, 'Barry Davies', FALSE);

    INSERT INTO questions (quiz_id, question_text, difficulty_id)
    VALUES (v_quiz_id, 'Which commentator is known for saying "Magisterial!"?', v_medium_difficulty)
    RETURNING question_id INTO v_question_id;
    
    INSERT INTO answers (question_id, answer_text, is_correct)
    VALUES 
    (v_question_id, 'Ray Hudson', TRUE),
    (v_question_id, 'Peter Drury', FALSE),
    (v_question_id, 'Jon Champion', FALSE),
    (v_question_id, 'Ian Darke', FALSE);

END $$;
