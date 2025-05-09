DO $$
DECLARE
    v_role_id INT;
BEGIN
    CALL create_role('Player', v_role_id);
    CALL create_role('Manager', v_role_id);
END;
$$;