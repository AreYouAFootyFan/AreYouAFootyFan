-- Bundesliga Quizzes
INSERT INTO
    quizzes (quiz_title, quiz_description, category_id, created_by)
VALUES
    ('German Champions', 'Test your knowledge about Bundesliga title winners', 3, 1),
    ('Bayern Dominance', 'The history of Bayern Munich''s success', 3, 1),
    ('Dortmund Glory', 'Borussia Dortmund''s greatest moments', 3, 1),
    ('Bundesliga Legends', 'The greatest players in German football history', 3, 1),
    ('German Goal Scorers', 'Top strikers in Bundesliga history', 3, 1),
    ('German Stadiums', 'Famous grounds of Bundesliga clubs', 3, 1),
    ('Transfer Records Germany', 'Biggest transfers in Bundesliga history', 3, 1),
    ('German Managers', 'Legendary coaches of the Bundesliga', 3, 1),
    ('German Derbies', 'Famous rivalries in German football', 3, 1),
    ('Bundesliga History', 'Historic moments in German football', 3, 1);

-- Questions for "German Champions" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'German Champions'
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
        'Which team has won the most Bundesliga titles?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who won the first-ever Bundesliga title in 1963?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team has won the most consecutive Bundesliga titles?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team other than Bayern Munich and Borussia Dortmund has won the most Bundesliga titles?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team was the first to win the Bundesliga and DFB-Pokal double?',
        2
    );

-- Answers for "German Champions" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team has won the most Bundesliga titles?'
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
        'Bayern Munich',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Borussia Dortmund',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Borussia Monchengladbach',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Werder Bremen',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who won the first-ever Bundesliga title in 1963?'
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
        '1. FC Koln',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Bayern Munich',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Borussia Dortmund',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Hamburg SV',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team has won the most consecutive Bundesliga titles?'
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
        'Bayern Munich',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Borussia Monchengladbach',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Borussia Dortmund',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Werder Bremen',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team other than Bayern Munich and Borussia Dortmund has won the most Bundesliga titles?'
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
        'Borussia Monchengladbach',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Werder Bremen',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Hamburg SV',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'VfB Stuttgart',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team was the first to win the Bundesliga and DFB-Pokal double?'
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
        'Bayern Munich',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Borussia Dortmund',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'FC Köln',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Werder Bremen',
        FALSE
    );

-- Questions for "Bayern Dominance" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Bayern Dominance'
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
        'How many European Cups/Champions League titles has Bayern Munich won?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is Bayern Munich''s all-time top scorer?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Bayern Munich player has won the most Bundesliga titles?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'In which year did Bayern Munich win their first Bundesliga title?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was Bayern''s manager during their 2013 treble-winning season?',
        2
    );

-- Answers for "Bayern Dominance" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'How many European Cups/Champions League titles has Bayern Munich won?'
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
        '6',
        TRUE
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
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '7',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '4',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is Bayern Munich''s all-time top scorer?'
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
        'Gerd Muller',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Robert Lewandowski',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Karl-Heinz Rummenigge',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Thomas Muller',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Bayern Munich player has won the most Bundesliga titles?'
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
        'Thomas Muller',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Sepp Maier',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Franz Beckenbauer',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Oliver Kahn',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which year did Bayern Munich win their first Bundesliga title?'
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
        '1969',
        TRUE
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
        '1970',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1967',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Bayern''s manager during their 2013 treble-winning season?'
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
        'Jupp Heynckes',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Pep Guardiola',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Louis van Gaal',
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
    );

-- Questions for "Dortmund Glory" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Dortmund Glory'
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
        'In which year did Borussia Dortmund win their first and only Champions League title?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who scored the winning goals in Dortmund''s 1997 Champions League final victory?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which manager led Dortmund to back-to-back Bundesliga titles in 2011 and 2012?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is Borussia Dortmund''s all-time top scorer?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'In which year was Borussia Dortmund founded?',
        2
    );

-- Answers for "Dortmund Glory" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which year did Borussia Dortmund win their first and only Champions League title?'
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
        '1997',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1995',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '2001',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '2013',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who scored the winning goals in Dortmund''s 1997 Champions League final victory?'
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
        'Karl-Heinz Riedle',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Andreas Moller',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Stephane Chapuisat',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Lars Ricken',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which manager led Dortmund to back-to-back Bundesliga titles in 2011 and 2012?'
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
        'Jurgen Klopp',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Thomas Tuchel',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Ottmar Hitzfeld',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Matthias Sammer',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is Borussia Dortmund''s all-time top scorer?'
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
        'Michael Zorc',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Manfred Burgsmüller',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Robert Lewandowski',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Marco Reus',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which year was Borussia Dortmund founded?'
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
        '1909',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        '1900',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        '1919',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        '1905',
        FALSE
    );

-- Questions for "Bundesliga Legends" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Bundesliga Legends'
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
        'Who holds the record for most Bundesliga appearances?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player is known as "Der Kaiser"?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is the Bundesliga''s all-time top scorer?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which goalkeeper holds the record for most clean sheets in Bundesliga history?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was the first player to score 100 Bundesliga goals?',
        3
    );

-- Answers for "Bundesliga Legends" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who holds the record for most Bundesliga appearances?'
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
        'Karl-Heinz Körbel',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Manfred Kaltz',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Oliver Kahn',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Klaus Fichtel',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player is known as "Der Kaiser"?'
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
        'Franz Beckenbauer',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Lothar Matthäus',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Gerd Müller',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Karl-Heinz Rummenigge',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is the Bundesliga''s all-time top scorer?'
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
        'Gerd Müller',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Robert Lewandowski',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Klaus Fischer',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Jupp Heynckes',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which goalkeeper holds the record for most clean sheets in Bundesliga history?'
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
        'Manuel Neuer',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Oliver Kahn',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Sepp Maier',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Jens Lehmann',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was the first player to score 100 Bundesliga goals?'
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
        'Uwe Seeler',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Gerd Müller',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Klaus Fischer',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Jupp Heynckes',
        FALSE
    );

-- Questions for "German Goal Scorers" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'German Goal Scorers'
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
        'Who holds the record for most goals in a single Bundesliga season?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player scored the fastest hat-trick in Bundesliga history?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who holds the record for most goals scored in a single Bundesliga match?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which striker is nicknamed "Der Bomber"?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is the youngest player to score 50 Bundesliga goals?',
        2
    );

-- Answers for "German Goal Scorers" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who holds the record for most goals in a single Bundesliga season?'
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
        'Robert Lewandowski',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Gerd Müller',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Pierre-Emerick Aubameyang',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Klaus Fischer',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player scored the fastest hat-trick in Bundesliga history?'
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
        'Robert Lewandowski',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Klaus Allofs',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Gerd Müller',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Michael Tönnies',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who holds the record for most goals scored in a single Bundesliga match?'
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
        'Robert Lewandowski',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Gerd Müller',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Dieter Müller',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Claudio Pizarro',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which striker is nicknamed "Der Bomber"?'
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
        'Gerd Müller',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Miroslav Klose',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Karl-Heinz Rummenigge',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Jürgen Klinsmann',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is the youngest player to score 50 Bundesliga goals?'
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
        'Erling Haaland',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Thomas Müller',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Mario Götze',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Kai Havertz',
        FALSE
    );

-- Questions for "German Stadiums" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'German Stadiums'
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
        'Which German stadium has the largest capacity?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the name of Borussia Dortmund''s stadium?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which stadium is known as the "Football Temple"?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What was the Allianz Arena called before its current name?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which Bundesliga stadium is famous for its solar panels on the roof?',
        2
    );

-- Answers for "German Stadiums" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which German stadium has the largest capacity?'
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
        'Signal Iduna Park',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Allianz Arena',
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
        'Veltins-Arena',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of Borussia Dortmund''s stadium?'
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
        'Signal Iduna Park',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Westfalenstadion',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'BVB Arena',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Yellow Wall Stadium',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which stadium is known as the "Football Temple"?'
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
        'Volksparkstadion',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Red Bull Arena',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Mercedes-Benz Arena',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'WWK Arena',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What was the Allianz Arena called before its current name?'
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
        'München Arena',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Bayern Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Fröttmaning Arena',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Olympic Stadium',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which Bundesliga stadium is famous for its solar panels on the roof?'
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
        'SC-Stadion',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Commerzbank Arena',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'BayArena',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Borussia-Park',
        FALSE
    );

-- Questions for "Transfer Records Germany" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Transfer Records Germany'
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
        'Who is Bayern Munich''s record signing?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player''s transfer from Dortmund to Bayern set a Bundesliga record in 2013?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was Borussia Dortmund''s most expensive signing?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which German player became the most expensive defender in Bundesliga history in 2021?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was RB Leipzig''s record signing?',
        2
    );

-- Answers for "Transfer Records Germany" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is Bayern Munich''s record signing?'
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
        'Lucas Hernandez',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Leroy Sane',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Manuel Neuer',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Javi Martinez',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player''s transfer from Dortmund to Bayern set a Bundesliga record in 2013?'
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
        'Mario Götze',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Robert Lewandowski',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Mats Hummels',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Marco Reus',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was Borussia Dortmund''s most expensive signing?'
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
        'Sebastien Haller',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Andre Schürrle',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Mats Hummels',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Thorgan Hazard',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which German player became the most expensive defender in Bundesliga history in 2021?'
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
        'Dayot Upamecano',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Niklas Süle',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Benjamin Pavard',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Matthias Ginter',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was RB Leipzig''s record signing?'
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
        'Naby Keita',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Timo Werner',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Emil Forsberg',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Christopher Nkunku',
        FALSE
    );

-- Questions for "German Managers" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'German Managers'
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
        'Who is the most successful manager in Bundesliga history?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which manager led Bayern Munich to their 2013 treble?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was the youngest manager in Bundesliga history?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which manager has the record for most Bundesliga matches?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who was the first foreign manager to win the Bundesliga?',
        3
    );

-- Answers for "German Managers" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is the most successful manager in Bundesliga history?'
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
        'Ottmar Hitzfeld',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Udo Lattek',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Jupp Heynckes',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Felix Magath',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which manager led Bayern Munich to their 2013 treble?'
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
        'Jupp Heynckes',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Pep Guardiola',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Louis van Gaal',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Carlo Ancelotti',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was the youngest manager in Bundesliga history?'
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
        'Julian Nagelsmann',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Thomas Tuchel',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Domenico Tedesco',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Andre Schubert',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which manager has the record for most Bundesliga matches?'
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
        'Otto Rehhagel',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Jupp Heynckes',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Thomas Schaaf',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Friedhelm Funkel',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who was the first foreign manager to win the Bundesliga?'
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
        'Zlatko Čajkovski',
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
        'Pep Guardiola',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Louis van Gaal',
        FALSE
    );

-- Questions for "German Derbies" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'German Derbies'
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
        'Which two teams contest the Revierderby?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the name of the derby between Bayern Munich and 1860 Munich?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which two teams play in the Northern Derby?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the name of the derby between FC Köln and Borussia Mönchengladbach?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which derby is known as the "Battle of the Borussias"?',
        2
    );

-- Answers for "German Derbies" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which two teams contest the Revierderby?'
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
        'Borussia Dortmund and Schalke 04',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Bayern Munich and 1860 Munich',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Hamburg and Werder Bremen',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'FC Köln and Bayer Leverkusen',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of the derby between Bayern Munich and 1860 Munich?'
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
        'Munich Derby',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Bavarian Derby',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Southern Derby',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Allianz Derby',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which two teams play in the Northern Derby?'
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
        'Hamburg and Werder Bremen',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Wolfsburg and Hannover 96',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'St. Pauli and Holstein Kiel',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Hamburg and St. Pauli',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the name of the derby between FC Köln and Borussia Mönchengladbach?'
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
        'Rheinderby',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Westderby',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Niederrheinderby',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Kölschderby',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which derby is known as the "Battle of the Borussias"?'
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
        'Dortmund vs Mönchengladbach',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Dortmund vs Bayern',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Mönchengladbach vs Schalke',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Dortmund vs Leipzig',
        FALSE
    );

-- Questions for "Bundesliga History" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'Bundesliga History'
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
        'In which year was the Bundesliga founded?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team has never been relegated from the Bundesliga since its foundation?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What was the first ever Bundesliga match?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who scored the first goal in Bundesliga history?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team has played the most seasons in the Bundesliga?',
        2
    );

-- Answers for "Bundesliga History" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which year was the Bundesliga founded?'
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
        '1963',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1960',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1965',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1958',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team has never been relegated from the Bundesliga since its foundation?'
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
        'Bayern Munich',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Borussia Dortmund',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Werder Bremen',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Hamburg SV',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What was the first ever Bundesliga match?'
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
        'Werder Bremen vs Borussia Dortmund',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Bayern Munich vs 1860 Munich',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        '1. FC Köln vs Schalke 04',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Hamburg SV vs Preußen Münster',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who scored the first goal in Bundesliga history?'
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
        'Friedhelm Konietzka',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Uwe Seeler',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Max Morlock',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Hans Schäfer',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team has played the most seasons in the Bundesliga?'
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
        'Bayern Munich',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Werder Bremen',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Hamburg SV',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Borussia Dortmund',
        FALSE
    );