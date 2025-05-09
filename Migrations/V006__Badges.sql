DO $$
DECLARE
    v_badge_id INT;
BEGIN
    CALL create_badge('Rookie', 50, v_badge_id);
    CALL create_badge('Amateur', 200, v_badge_id);
    CALL create_badge('Semi-Pro', 500, v_badge_id);
    CALL create_badge('Professional', 1000, v_badge_id);
    CALL create_badge('World Class', 2000, v_badge_id);
    CALL create_badge('Legendary', 5000, v_badge_id);
END;
$$;