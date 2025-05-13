-- La Liga Quizzes
INSERT INTO
    quizzes (quiz_title, quiz_description, category_id, created_by)
VALUES
    ('Spanish Champions', 'Test your knowledge about La Liga title winners', 2, 1),
    ('El Clasico History', 'The greatest rivalry between Barcelona and Real Madrid', 2, 1),
    ('Golden Era Barcelona', 'The dominant years of FC Barcelona', 2, 1),
    ('Real Madrid Legends', 'Test your knowledge about Real Madrid''s greatest players', 2, 1),
    ('Spanish Goal Scorers', 'La Liga''s most prolific strikers and their records', 2, 1),
    ('Spanish Stadiums', 'Famous grounds of La Liga clubs', 2, 1),
    ('Transfer Records Spain', 'Biggest transfers in La Liga history', 2, 1),
    ('Spanish Managers', 'Legendary coaches who shaped La Liga', 2, 1),
    ('Spanish Derby Matches', 'Famous rivalries in Spanish football', 2, 1),
    ('La Liga Milestones', 'Historic moments in Spanish football', 2, 1);

-- Questions for "Spanish Champions" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Spanish Champions'
        LIMIT
            1
    )
INSERT INTO
    questions (quiz_id, question_text, difficulty_id)
VALUES
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team has won the most La Liga titles?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'In what year was La Liga founded?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team won the first-ever La Liga title?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team other than Real Madrid and Barcelona has won the most La Liga titles?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who holds the record for most La Liga titles as a player?',
        2
    );

-- Answers for "Spanish Champions" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team has won the most La Liga titles?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Real Madrid',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Barcelona',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Atletico Madrid',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Athletic Bilbao',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In what year was La Liga founded?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '1929',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '1920',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '1932',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '1925',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team won the first-ever La Liga title?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Barcelona',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Real Madrid',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Athletic Bilbao',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Valencia',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team other than Real Madrid and Barcelona has won the most La Liga titles?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Atletico Madrid',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Valencia',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Athletic Bilbao',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Real Sociedad',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who holds the record for most La Liga titles as a player?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Francisco Gento',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Lionel Messi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Andres Iniesta',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Sergio Ramos',
        FALSE
    );

-- Questions for "El Clasico History" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'El Clasico History'
        LIMIT
            1
    )
INSERT INTO
    questions (quiz_id, question_text, difficulty_id)
VALUES
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who has scored the most goals in El Clasico history?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the biggest margin of victory in El Clasico history?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player has made the most El Clasico appearances?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'In which stadium was the first El Clasico played?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who scored the fastest goal in El Clasico history?',
        3
    );

-- Answers for "El Clasico History" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who has scored the most goals in El Clasico history?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Lionel Messi',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Cristiano Ronaldo',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Alfredo Di Stefano',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Ferenc Puskas',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the biggest margin of victory in El Clasico history?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '11-1',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '8-0',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '7-0',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '6-0',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player has made the most El Clasico appearances?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Sergio Ramos',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Xavi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Lionel Messi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Iker Casillas',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which stadium was the first El Clasico played?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Hipódromo',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Camp Nou',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Santiago Bernabeu',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Les Corts',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who scored the fastest goal in El Clasico history?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Karim Benzema',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Luis Suarez',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Cristiano Ronaldo',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Lionel Messi',
        FALSE
    );

-- Questions for "Golden Era Barcelona" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Golden Era Barcelona'
        LIMIT
            1
    )
INSERT INTO
    questions (quiz_id, question_text, difficulty_id)
VALUES
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was Barcelona''s manager during their historic 2009 sextuple-winning season?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Barcelona player won the Ballon d''Or a record six times?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What was the nickname given to Barcelona''s midfield trio of Xavi, Iniesta, and Busquets?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'In which year did Barcelona win their first UEFA Champions League/European Cup?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who scored Barcelona''s winning goal in the 2009 Champions League final against Manchester United?',
        2
    );

-- Answers for "Golden Era Barcelona" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Barcelona''s manager during their historic 2009 sextuple-winning season?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Pep Guardiola',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Frank Rijkaard',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Luis Enrique',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Tito Vilanova',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Barcelona player won the Ballon d''Or a record six times?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Lionel Messi',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Johan Cruyff',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Ronaldinho',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Luis Suarez',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What was the nickname given to Barcelona''s midfield trio of Xavi, Iniesta, and Busquets?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'The Holy Trinity',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'The Golden Triangle',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'The Magic Trio',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'The Dream Team',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which year did Barcelona win their first UEFA Champions League/European Cup?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1992',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1986',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1989',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1995',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who scored Barcelona''s winning goal in the 2009 Champions League final against Manchester United?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Lionel Messi',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Samuel Eto''o',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Thierry Henry',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Andres Iniesta',
        FALSE
    );

-- Questions for "Real Madrid Legends" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Real Madrid Legends'
        LIMIT
            1
    )
INSERT INTO
    questions (quiz_id, question_text, difficulty_id)
VALUES
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is Real Madrid''s all-time top scorer?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Real Madrid player won five consecutive European Cups between 1956 and 1960?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is known as "San Iker" among Real Madrid fans?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Real Madrid striker was nicknamed "The Vulture"?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who holds the record for most appearances for Real Madrid?',
        2
    );

-- Answers for "Real Madrid Legends" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is Real Madrid''s all-time top scorer?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Cristiano Ronaldo',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Raul',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Alfredo Di Stefano',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Ferenc Puskas',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Real Madrid player won five consecutive European Cups between 1956 and 1960?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Francisco Gento',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Alfredo Di Stefano',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Raymond Kopa',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Ferenc Puskas',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is known as "San Iker" among Real Madrid fans?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Iker Casillas',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Raul Gonzalez',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Fernando Hierro',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Michel Salgado',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Real Madrid striker was nicknamed "The Vulture"?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Hugo Sanchez',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Emilio Butragueno',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Raul',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Ivan Zamorano',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who holds the record for most appearances for Real Madrid?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Raul',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Iker Casillas',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Manuel Sanchis',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Fernando Hierro',
        FALSE
    );

-- Questions for "Spanish Goal Scorers" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Spanish Goal Scorers'
        LIMIT
            1
    )
INSERT INTO
    questions (quiz_id, question_text, difficulty_id)
VALUES
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who holds the record for most goals in a single La Liga season?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Spanish striker is known as "El Guaje"?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is Athletic Bilbao''s all-time top scorer?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which striker scored the most goals for Atletico Madrid?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was the first player to score 300 La Liga goals?',
        2
    );

-- Answers for "Spanish Goal Scorers" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who holds the record for most goals in a single La Liga season?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Lionel Messi',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Cristiano Ronaldo',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Telmo Zarra',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Hugo Sanchez',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Spanish striker is known as "El Guaje"?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'David Villa',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Fernando Torres',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Raul',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Fernando Morientes',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is Athletic Bilbao''s all-time top scorer?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Telmo Zarra',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Aritz Aduriz',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Ismael Urzaiz',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Joseba Etxeberria',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which striker scored the most goals for Atletico Madrid?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Luis Aragones',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Antoine Griezmann',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Fernando Torres',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Diego Forlan',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was the first player to score 300 La Liga goals?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Telmo Zarra',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Hugo Sanchez',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Alfredo Di Stefano',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Raul',
        FALSE
    );

-- Questions for "Spanish Stadiums" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Spanish Stadiums'
        LIMIT
            1
    )
INSERT INTO
    questions (quiz_id, question_text, difficulty_id)
VALUES
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Spanish stadium has the largest capacity?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the name of Atletico Madrid''s new stadium that opened in 2017?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which stadium is known as "The Cathedral" in Spanish football?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What was the former name of the Santiago Bernabeu stadium?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which La Liga stadium is nicknamed "El Madrigal"?',
        2
    );

-- Answers for "Spanish Stadiums" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Spanish stadium has the largest capacity?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Camp Nou',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Santiago Bernabeu',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Metropolitano',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Sanchez Pizjuan',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of Atletico Madrid''s new stadium that opened in 2017?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Wanda Metropolitano',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Vicente Calderon',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Estadio Atletico',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Nuevo Manzanares',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which stadium is known as "The Cathedral" in Spanish football?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'San Mames',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Mestalla',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Riazor',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'La Romareda',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What was the former name of the Santiago Bernabeu stadium?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Nuevo Chamartin',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Estadio Real',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Campo de O''Donnell',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Estadio Madrid',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which La Liga stadium is nicknamed "El Madrigal"?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Villarreal CF Stadium',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Valencia CF Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Sevilla FC Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Real Betis Stadium',
        FALSE
    );

-- Questions for "Transfer Records Spain" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Transfer Records Spain'
        LIMIT
            1
    )
INSERT INTO
    questions (quiz_id, question_text, difficulty_id)
VALUES
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was Barcelona''s record signing in 2017?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player''s transfer to Real Madrid in 2009 set a world record at the time?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was Atletico Madrid''s record signing in 2019?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Brazilian player became Real Madrid''s record signing in 2018?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was the most expensive Spanish player transfer within La Liga?',
        3
    );

-- Answers for "Transfer Records Spain" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Barcelona''s record signing in 2017?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Ousmane Dembele',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Philippe Coutinho',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Antoine Griezmann',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Neymar',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player''s transfer to Real Madrid in 2009 set a world record at the time?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Cristiano Ronaldo',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Kaka',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Zinedine Zidane',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Gareth Bale',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Atletico Madrid''s record signing in 2019?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Joao Felix',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Thomas Lemar',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Diego Costa',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Alvaro Morata',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Brazilian player became Real Madrid''s record signing in 2018?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Vinicius Junior',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Rodrygo',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Reinier',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Casemiro',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was the most expensive Spanish player transfer within La Liga?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Kepa Arrizabalaga',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Fernando Torres',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'David Villa',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Alvaro Morata',
        FALSE
    );

-- Questions for "Spanish Managers" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Spanish Managers'
        LIMIT
            1
    )
INSERT INTO
    questions (quiz_id, question_text, difficulty_id)
VALUES
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is the longest-serving manager in La Liga history?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Spanish manager won the first treble with Barcelona?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was Real Madrid''s first Spanish manager?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which manager led Atletico Madrid to their first La Liga title in 18 years in 2014?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was Spain''s manager during their 2010 World Cup victory?',
        1
    );

-- Answers for "Spanish Managers" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is the longest-serving manager in La Liga history?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Miguel Munoz',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Luis Aragones',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Johan Cruyff',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Diego Simeone',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Spanish manager won the first treble with Barcelona?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Pep Guardiola',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Luis Enrique',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Frank Rijkaard',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Tito Vilanova',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Real Madrid''s first Spanish manager?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Santiago Bernabeu',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Miguel Munoz',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Vicente Del Bosque',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Rafael Benitez',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which manager led Atletico Madrid to their first La Liga title in 18 years in 2014?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Diego Simeone',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Quique Sanchez Flores',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Gregorio Manzano',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Javier Aguirre',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Spain''s manager during their 2010 World Cup victory?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Vicente del Bosque',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Luis Aragones',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Jose Antonio Camacho',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Javier Clemente',
        FALSE
    );

-- Questions for "Spanish Derby Matches" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Spanish Derby Matches'
        LIMIT
            1
    )
INSERT INTO
    questions (quiz_id, question_text, difficulty_id)
VALUES
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the name of the derby between Sevilla and Real Betis?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which two teams contest the Basque Derby?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the name of the Madrid Derby?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which two teams play in the Valencian Derby?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the name of the Catalan Derby between Barcelona and Espanyol?',
        2
    );

-- Answers for "Spanish Derby Matches" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of the derby between Sevilla and Real Betis?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'El Gran Derbi',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'El Clasico Andaluz',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Derbi Sevillano',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'El Derbi del Sur',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which two teams contest the Basque Derby?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Real Sociedad and Athletic Bilbao',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Athletic Bilbao and Osasuna',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Real Sociedad and Alaves',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Athletic Bilbao and Eibar',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of the Madrid Derby?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'El Derbi Madrileno',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'El Clasico Madrid',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Derbi de la Capital',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'El Derbi Real',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which two teams play in the Valencian Derby?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Valencia and Levante',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Valencia and Villarreal',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Levante and Elche',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Valencia and Castellon',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of the Catalan Derby between Barcelona and Espanyol?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Derbi Barceloni',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'El Clasico Catalan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Derbi de Catalunya',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'El Derbi del Mediterraneo',
        FALSE
    );

-- Questions for "La Liga Milestones" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'La Liga Milestones'
        LIMIT
            1
    )
INSERT INTO
    questions (quiz_id, question_text, difficulty_id)
VALUES
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'In which year was La Liga founded?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who scored the 6000th goal in Barcelona''s La Liga history?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team became the first non-Barcelona/Real Madrid club to win La Liga in the 21st century?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was the first foreign player to win the Pichichi Trophy?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team has played the most seasons in La Liga without being relegated?',
        2
    );

-- Answers for "La Liga Milestones" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which year was La Liga founded?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1929',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1925',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1932',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1920',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who scored the 6000th goal in Barcelona''s La Liga history?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Lionel Messi',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Luis Suarez',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Neymar',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'David Villa',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team became the first non-Barcelona/Real Madrid club to win La Liga in the 21st century?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Valencia',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Atletico Madrid',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Deportivo La Coruna',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Sevilla',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was the first foreign player to win the Pichichi Trophy?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Ferenc Puskas',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Alfredo Di Stefano',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Johan Cruyff',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Hugo Sanchez',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team has played the most seasons in La Liga without being relegated?'
        LIMIT
            1
    )
INSERT INTO
    answers (question_id, answer_text, is_correct)
VALUES
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Athletic Bilbao',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Real Madrid',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Barcelona',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Valencia',
        FALSE
    );