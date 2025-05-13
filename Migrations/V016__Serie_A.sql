-- Serie A Quizzes
INSERT INTO
    quizzes (quiz_title, quiz_description, category_id, created_by)
VALUES
    ('Italian Champions', 'Test your knowledge about Serie A title winners', 4, 1),
    ('Milan Dynasty', 'The golden era of AC Milan', 4, 1),
    ('Inter Glory', 'Inter Milan''s greatest achievements', 4, 1),
    ('Juventus Legacy', 'The dominance of the Old Lady', 4, 1),
    ('Italian Goal Scorers', 'Serie A''s most prolific strikers', 4, 1),
    ('Italian Stadiums', 'Famous grounds of Serie A clubs', 4, 1),
    ('Transfer Records Italy', 'Biggest transfers in Serie A history', 4, 1),
    ('Italian Managers', 'Legendary coaches of Italian football', 4, 1),
    ('Italian Derbies', 'Famous rivalries in Italian football', 4, 1),
    ('Serie A History', 'Historic moments in Italian football', 4, 1);

-- Questions for "Italian Champions" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Italian Champions'
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
        'Which team has won the most Serie A titles?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'In what year was Serie A founded?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team won the first-ever Serie A title?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'How many consecutive Serie A titles did Juventus win between 2012 and 2020?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which was the first southern Italian team to win Serie A?',
        2
    );

-- Answers for "Italian Champions" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team has won the most Serie A titles?'
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
        'Juventus',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'AC Milan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Inter Milan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Roma',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In what year was Serie A founded?'
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
        '1925',
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
        '1920',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team won the first-ever Serie A title?'
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
        'Inter Milan',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Juventus',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'AC Milan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Genoa',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'How many consecutive Serie A titles did Juventus win between 2012 and 2020?'
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
        '9',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '7',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '8',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '10',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which was the first southern Italian team to win Serie A?'
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
        'Napoli',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Roma',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Lazio',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Cagliari',
        FALSE
    );

-- Questions for "Milan Dynasty" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Milan Dynasty'
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
        'How many European Cup/Champions League titles has AC Milan won?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is AC Milan''s all-time top scorer?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which legendary Dutch trio played for Milan in the late 1980s?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'In which year did AC Milan win their first European Cup?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was AC Milan''s manager during their dominant period in the late 1980s?',
        2
    );

-- Answers for "Milan Dynasty" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'How many European Cup/Champions League titles has AC Milan won?'
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
        '7',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '6',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '8',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '5',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is AC Milan''s all-time top scorer?'
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
        'Gunnar Nordahl',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Andriy Shevchenko',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Filippo Inzaghi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Marco van Basten',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which legendary Dutch trio played for Milan in the late 1980s?'
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
        'Gullit, Van Basten, Rijkaard',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Cruyff, Neeskens, Rep',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Seedorf, Davids, Kluivert',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Van Basten, Bergkamp, Overmars',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which year did AC Milan win their first European Cup?'
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
        '1963',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1960',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1965',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1969',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was AC Milan''s manager during their dominant period in the late 1980s?'
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
        'Arrigo Sacchi',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Fabio Capello',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Carlo Ancelotti',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Nils Liedholm',
        FALSE
    );

-- Questions for "Inter Glory" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Inter Glory'
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
        'In which year did Inter win their first Champions League/European Cup?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is Inter''s all-time leading goal scorer?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which manager led Inter to their historic treble in 2010?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is Inter Milan''s nickname?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was Inter''s captain during their 2010 treble-winning season?',
        2
    );

-- Answers for "Inter Glory" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which year did Inter win their first Champions League/European Cup?'
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
        '1964',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1962',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1966',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1968',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is Inter''s all-time leading goal scorer?'
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
        'Giuseppe Meazza',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Christian Vieri',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Alessandro Altobelli',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Roberto Boninsegna',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which manager led Inter to their historic treble in 2010?'
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
        'Jose Mourinho',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Roberto Mancini',
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
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Marcello Lippi',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is Inter Milan''s nickname?'
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
        'I Nerazzurri',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'I Rossoneri',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'La Beneamata',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'I Bianconeri',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Inter''s captain during their 2010 treble-winning season?'
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
        'Javier Zanetti',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Marco Materazzi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Esteban Cambiasso',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Diego Milito',
        FALSE
    );

-- Questions for "Juventus Legacy" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Juventus Legacy'
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
        'How many Serie A titles has Juventus won?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'In what year was Juventus founded?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player holds the record for most Serie A appearances?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is Juventus''s all-time top scorer?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player has won the most Serie A titles?',
        2
    );

-- Answers for "Juventus Legacy" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'How many Serie A titles has Juventus won?'
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
        '36',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '34',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '38',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '32',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In what year was Juventus founded?'
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
        '1897',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '1890',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '1901',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        '1910',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player holds the record for most Serie A appearances?'
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
        'Gianluigi Buffon',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Paolo Maldini',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Juve',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Andrea Pirlo',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is Juventus''s all-time top scorer?'
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
        'Alessandro Del Piero',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Gianluigi Buffon',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Zlatan Ibrahimovic',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'David Trezeguet',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player has won the most Serie A titles?'
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
        'Gianluigi Buffon',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Alessandro Del Piero',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Zlatan Ibrahimovic',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'David Trezeguet',
        FALSE
    );

-- Questions for "Italian Goal Scorers" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Italian Goal Scorers'
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
        'Who holds the record for most goals in Serie A history?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Italian striker is known as "Il Fenomeno"?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who holds the record for most goals in a single Serie A season?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player has scored the most hat-tricks in Serie A history?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is Inter Milan''s all-time top scorer?',
        2
    );

-- Answers for "Italian Goal Scorers" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who holds the record for most goals in Serie A history?'
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
        'Gianluigi Buffon',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Alessandro Del Piero',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Filippo Inzaghi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Roberto Baggio',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Italian striker is known as "Il Fenomeno"?'
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
        'Giuseppe Meazza',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Giovanni Trapattoni',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Alessandro Altobelli',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Roberto Baggio',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who holds the record for most goals in a single Serie A season?'
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
        'Gonzalo Higuain',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Ciro Immobile',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Gunnar Nordahl',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Antonio Angelillo',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player has scored the most hat-tricks in Serie A history?'
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
        'Filippo Inzaghi',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Roberto Baggio',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Giovanni Trapattoni',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Alessandro Altobelli',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is Inter Milan''s all-time top scorer?'
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
        'Roberto Baggio',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Giuseppe Meazza',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Alessandro Altobelli',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Roberto Boninsegna',
        FALSE
    );

-- Questions for "Italian Stadiums" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Italian Stadiums'
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
        'Which Italian stadium has the largest capacity?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the name of Juventus''s stadium?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which stadium is known as "The Cathedral" in Italian football?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What was the former name of the San Siro stadium?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Serie A stadium is nicknamed "The Cathedral"?',
        2
    );

-- Answers for "Italian Stadiums" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Italian stadium has the largest capacity?'
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
        'San Siro',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Juventus Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Olympiastadion',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Stadio Olimpico',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of Juventus''s stadium?'
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
        'Juventus Stadium',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Allianz Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Stadio delle Alpi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Stadio Olimpico',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which stadium is known as "The Cathedral" in Italian football?'
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
        'San Siro',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Stadio Olimpico',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Allianz Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Stadio delle Alpi',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What was the former name of the San Siro stadium?'
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
        'Stadio Giuseppe Meazza',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Stadio San Siro',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Stadio Giovanni Battista',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Stadio Luigi Ferraris',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Serie A stadium is nicknamed "The Cathedral"?'
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
        'San Siro',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Stadio Olimpico',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Allianz Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Stadio delle Alpi',
        FALSE
    );

-- Questions for "Transfer Records Italy" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Transfer Records Italy'
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
        'Who was Juventus''s record signing in 2017?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player''s transfer to Inter Milan in 2019 set a world record at the time?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was AC Milan''s most expensive signing in 2018?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Italian player became the most expensive defender in Serie A history in 2021?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was the most expensive Italian player transfer within Serie A?',
        3
    );

-- Answers for "Transfer Records Italy" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Juventus''s record signing in 2017?'
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
        'Gonzalo Higuaín',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Paulo Dybala',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Douglas Costa',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player''s transfer to Inter Milan in 2019 set a world record at the time?'
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
        'Romelu Lukaku',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Mauro Icardi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Lautaro Martínez',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Ivan Perisic',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was AC Milan''s most expensive signing in 2018?'
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
        'Hakan Calhanoglu',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Franck Kessie',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Hirving Lozano',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Ciro Immobile',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Italian player became the most expensive defender in Serie A history in 2021?'
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
        'Giorgio Chiellini',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Leonardo Bonucci',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Matthijs de Ligt',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Federico Chiesa',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was the most expensive Italian player transfer within Serie A?'
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
        'Cristiano Ronaldo',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Gonzalo Higuaín',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Paulo Dybala',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Douglas Costa',
        FALSE
    );

-- Questions for "Italian Managers" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Italian Managers'
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
        'Who is the longest-serving manager in Serie A history?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Italian manager won the first treble with Juventus?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was Inter Milan''s first Italian manager?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which manager led AC Milan to their "Invincibles" season?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was Italy''s manager during their 2006 World Cup victory?',
        1
    );

-- Answers for "Italian Managers" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is the longest-serving manager in Serie A history?'
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
        'Massimiliano Allegri',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Giovanni Trapattoni',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Carlo Ancelotti',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Nils Liedholm',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Italian manager won the first treble with Juventus?'
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
        'Nils Liedholm',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Giovanni Trapattoni',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Marcello Lippi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Fabio Capello',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Inter Milan''s first Italian manager?'
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
        'Giovanni Trapattoni',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Nils Liedholm',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Marcello Lippi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Fabio Capello',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which manager led AC Milan to their "Invincibles" season?'
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
        'Arrigo Sacchi',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Nils Liedholm',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Giovanni Trapattoni',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Fabio Capello',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Italy''s manager during their 2006 World Cup victory?'
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
        'Marcello Lippi',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Giovanni Trapattoni',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Nils Liedholm',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Fabio Capello',
        FALSE
    );

-- Questions for "Italian Derbies" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Italian Derbies'
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
        'What is the name of the derby between Inter Milan and AC Milan?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which two teams contest the Derby della Madonnina?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the name of the derby between Juventus and Inter Milan?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which two teams play in the Derby della Mole?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the name of the derby between Juventus and AC Milan?',
        2
    );

-- Answers for "Italian Derbies" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of the derby between Inter Milan and AC Milan?'
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
        'Derby della Madonnina',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Derby of the Two Towers',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Derby of the Old Lady',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Derby of the Devils',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which two teams contest the Derby della Madonnina?'
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
        'Inter Milan and AC Milan',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Inter Milan and Juventus',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'AC Milan and Juventus',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Inter Milan and Roma',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of the derby between Juventus and Inter Milan?'
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
        'Derby della Madonnina',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Derby of the Two Towers',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Derby of the Old Lady',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Derby of the Devils',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which two teams play in the Derby della Mole?'
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
        'Juventus and Torino',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Juventus and Milan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Milan and Inter Milan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Inter Milan and Roma',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of the derby between Juventus and AC Milan?'
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
        'Derby della Madonnina',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Derby of the Two Towers',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Derby of the Old Lady',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Derby of the Devils',
        FALSE
    );

-- Questions for "Serie A History" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Serie A History'
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
        'In which year was Serie A founded?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team has never been relegated from Serie A since its foundation?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What was the first ever Serie A match?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who scored the first goal in Serie A history?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team has played the most seasons in Serie A?',
        2
    );

-- Answers for "Serie A History" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which year was Serie A founded?'
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
            question_text = 'Which team has never been relegated from Serie A since its foundation?'
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
        'Juventus',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Inter Milan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'AC Milan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Milan',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What was the first ever Serie A match?'
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
        'Inter Milan vs AC Milan',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Juventus vs Milan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Inter Milan vs Roma',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Milan vs Napoli',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who scored the first goal in Serie A history?'
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
        'Giovanni Ferrari',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Giuseppe Meazza',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Guglielmo Gabetto',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Giovanni De Biasi',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team has played the most seasons in Serie A?'
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
        'Juventus',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Inter Milan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'AC Milan',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Milan',
        FALSE
    );