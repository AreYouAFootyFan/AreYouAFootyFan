DO $$
DECLARE
    v_difficulty_id INT;
BEGIN
    CALL create_difficulty('Easy', 15, 5, -2, v_difficulty_id);
    CALL create_difficulty('Medium', 20, 10, -5, v_difficulty_id);
    CALL create_difficulty('Hard', 30, 20, -10, v_difficulty_id);
    CALL create_difficulty('Impossible', 40, 40, -20, v_difficulty_id);
END;
$$;