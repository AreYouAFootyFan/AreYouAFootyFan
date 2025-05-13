-- World Cup Quizzes
INSERT INTO
    quizzes (quiz_title, quiz_description, category_id, created_by)
VALUES
    ('World Champions', 'Test your knowledge about World Cup winners', 6, 1),
    ('World Cup Records', 'Record breakers in World Cup history', 6, 1),
    ('Greatest Finals', 'Most memorable World Cup finals', 6, 1),
    ('World Cup Goals', 'Top scorers and memorable goals', 6, 1),
    ('Host Nations', 'Countries that hosted the World Cup', 6, 1),
    ('World Cup Legends', 'Legendary players in World Cup history', 6, 1),
    ('World Cup Managers', 'Most successful coaches in World Cup history', 6, 1),
    ('World Cup Upsets', 'Biggest surprises in World Cup history', 6, 1),
    ('World Cup Venues', 'Iconic stadiums of World Cup finals', 6, 1),
    ('World Cup History', 'Historic moments in World Cup history', 6, 1);

-- Questions for "World Champions" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'World Champions'
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
        'Which country has won the most World Cup titles?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who won the first ever World Cup in 1930?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which country won three World Cups between 1958 and 1970?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who are the current World Cup champions (2022)?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which country won their first World Cup in 2010?',
        2
    );

-- Answers for "World Champions" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which country has won the most World Cup titles?'
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
        'Brazil',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Germany',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Italy',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Argentina',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who won the first ever World Cup in 1930?'
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
        'Uruguay',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Argentina',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Brazil',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Italy',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which country won three World Cups between 1958 and 1970?'
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
        'Brazil',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Germany',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Italy',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Argentina',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who are the current World Cup champions (2022)?'
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
        'Argentina',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'France',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Brazil',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Germany',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which country won their first World Cup in 2010?'
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
        'Spain',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Netherlands',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Portugal',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Croatia',
        FALSE
    );

-- Questions for "World Cup Records" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'World Cup Records'
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
        'Who holds the record for most World Cup goals?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player has made the most World Cup appearances?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is the youngest player to score in a World Cup?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team has scored the most goals in World Cup history?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is the oldest player to score in a World Cup?',
        3
    );

-- Answers for "World Cup Records" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who holds the record for most World Cup goals?'
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
        'Miroslav Klose',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Ronaldo',
        FALSE
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
        'Just Fontaine',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player has made the most World Cup appearances?'
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
        'Paolo Maldini',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Cafu',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is the youngest player to score in a World Cup?'
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
        'Pelé',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Michael Owen',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Diego Maradona',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Kylian Mbappé',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team has scored the most goals in World Cup history?'
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
        'Brazil',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Germany',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Argentina',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Italy',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is the oldest player to score in a World Cup?'
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
        'Roger Milla',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Peter Shilton',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Pat Jennings',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Dino Zoff',
        FALSE
    );

-- Questions for "World Cup Goals" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'World Cup Goals'
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
        'Who scored the most goals in a single World Cup tournament?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player scored the fastest goal in World Cup history?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who scored the "Goal of the Century" in 1986?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player has scored in the most World Cup tournaments?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who scored the winning goal in the 2014 World Cup final?',
        2
    );

-- Answers for "World Cup Goals" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who scored the most goals in a single World Cup tournament?'
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
        'Just Fontaine',
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
        'Miroslav Klose',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Eusébio',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player scored the fastest goal in World Cup history?'
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
        'Hakan Şükür',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Bryan Robson',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Celso Ayala',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Bernard Lacombe',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who scored the "Goal of the Century" in 1986?'
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
        'Diego Maradona',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Michel Platini',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Gary Lineker',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Careca',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player has scored in the most World Cup tournaments?'
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
        'Pelé',
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
        'Cristiano Ronaldo',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Lionel Messi',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who scored the winning goal in the 2014 World Cup final?'
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
        'Mario Götze',
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
        'Miroslav Klose',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'André Schürrle',
        FALSE
    );

-- Questions for "World Cup Legends" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'World Cup Legends'
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
        'Who is the only player to win three World Cups?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which player has appeared in the most World Cup finals?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who won the Golden Ball in the 1986 World Cup?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which goalkeeper has the most World Cup clean sheets?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who is the youngest player to win a World Cup?',
        2
    );

-- Answers for "World Cup Legends" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is the only player to win three World Cups?'
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
        'Pelé',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Franz Beckenbauer',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Diego Maradona',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Cafu',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which player has appeared in the most World Cup finals?'
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
        'Cafu',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Paolo Maldini',
        FALSE
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
        'Diego Maradona',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who won the Golden Ball in the 1986 World Cup?'
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
        'Diego Maradona',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Michel Platini',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Gary Lineker',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Karl-Heinz Rummenigge',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which goalkeeper has the most World Cup clean sheets?'
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
        'Peter Shilton',
        TRUE
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
        'Dino Zoff',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Fabien Barthez',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who is the youngest player to win a World Cup?'
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
        'Pelé',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Giuseppe Bergomi',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Kylian Mbappé',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Norman Whiteside',
        FALSE
    );

-- Questions for "World Cup Upsets" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'World Cup Upsets'
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
        'Which team famously defeated England in the 1950 World Cup?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who knocked out defending champions France in 2002?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team stunned Argentina in their opening 2022 World Cup match?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Who eliminated Brazil in the 2014 World Cup semi-final with a shocking score?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which underdog team reached the semi-finals in 2002?',
        2
    );

-- Answers for "World Cup Upsets" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team famously defeated England in the 1950 World Cup?'
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
        'USA',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Brazil',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Uruguay',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Spain',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who knocked out defending champions France in 2002?'
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
        'Senegal',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Nigeria',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'South Korea',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Denmark',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team stunned Argentina in their opening 2022 World Cup match?'
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
        'Saudi Arabia',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Mexico',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Poland',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Tunisia',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Who eliminated Brazil in the 2014 World Cup semi-final with a shocking score?'
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
        'Germany (7-1)',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Netherlands (5-1)',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Spain (4-0)',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        'Argentina (3-0)',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which underdog team reached the semi-finals in 2002?'
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
        'South Korea',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Turkey',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'Senegal',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        'USA',
        FALSE
    );

-- Questions for "World Cup Venues" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'World Cup Venues'
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
        'Which stadium hosted the 2022 World Cup final?',
        1
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'What is the largest stadium to ever host a World Cup final?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which stadium hosted the famous 1950 final between Brazil and Uruguay?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Where was the first World Cup held?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team has participated in every World Cup tournament?',
        2
    );

-- Answers for "World Cup Venues" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which stadium hosted the 2022 World Cup final?'
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
        'Luzhniki Stadium',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Al Bayt Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Khalifa International Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        'Ahmad Bin Ali Stadium',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'What is the largest stadium to ever host a World Cup final?'
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
        'Luzhniki Stadium',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Maracanã Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Stade de France',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Stadium 974',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which stadium hosted the famous 1950 final between Brazil and Uruguay?'
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
        'Estadio Centenario',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Maracanã Stadium',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Stade de France',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        'Nilton Santos Stadium',
        FALSE
    );

-- Questions for "World Cup History" quiz
WITH
    quiz_id AS (
        SELECT
            quiz_id
        FROM
            quizzes
        WHERE
            quiz_title = 'World Cup History'
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
        'In which year was the first World Cup held?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which team has participated in every World Cup tournament?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'When was the World Cup trophy stolen and later recovered?',
        3
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'Which was the first World Cup to be televised?',
        2
    ),
    (
        (
            SELECT
                quiz_id
            FROM
                quiz_id
        ),
        'When was the World Cup expanded to 32 teams?',
        2
    );

-- Answers for "World Cup History" quiz questions
WITH
    q1 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'In which year was the first World Cup held?'
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
        '1930',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1934',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1928',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q1
        ),
        '1926',
        FALSE
    );

WITH
    q2 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which team has participated in every World Cup tournament?'
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
        'Brazil',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Germany',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Argentina',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q2
        ),
        'Italy',
        FALSE
    );

WITH
    q3 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'When was the World Cup trophy stolen and later recovered?'
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
        '1966',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        '1970',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        '1962',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q3
        ),
        '1974',
        FALSE
    );

WITH
    q4 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'Which was the first World Cup to be televised?'
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
        '1954',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1950',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1958',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q4
        ),
        '1962',
        FALSE
    );

WITH
    q5 AS (
        SELECT
            question_id
        FROM
            questions
        WHERE
            question_text = 'When was the World Cup expanded to 32 teams?'
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
        '1998',
        TRUE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        '1994',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        '2002',
        FALSE
    ),
    (
        (
            SELECT
                question_id
            FROM
                q5
        ),
        '1990',
        FALSE
    );