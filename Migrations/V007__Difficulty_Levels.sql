INSERT INTO
    difficulty_levels (
        difficulty_level,
        time_limit_seconds,
        points_on_correct,
        points_on_incorrect,
        points_on_no_answer
    )
VALUES
    ('Easy', 15, 5, -2, -1),
    ('Medium', 20, 10, -5, -3),
    ('Hard', 30, 20, -10, -5),
    ('Impossible', 40, 40, -20, -10);