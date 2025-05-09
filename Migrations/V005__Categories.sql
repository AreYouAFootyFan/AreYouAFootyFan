DO $$
DECLARE
    v_category_id INT;
BEGIN
    CALL create_category('Premier League', 'Top tier of English football with legendary clubs.', v_category_id);
    CALL create_category('La Liga', 'Spain''s premier league with world-class teams.', v_category_id);
    CALL create_category('Bundesliga', 'Germany''s elite league, famous for high-scoring matches.', v_category_id);
    CALL create_category('Serie A', 'Italy''s top league, known for tactics and rivalries.', v_category_id);
    CALL create_category('Champions League', 'Europe''s top clubs compete for ultimate glory.', v_category_id);
    CALL create_category('World Cup', 'Global tournament for football''s most coveted trophy.', v_category_id);
    CALL create_category('Football History', 'Explore legendary players, matches, and milestones.', v_category_id);
END;
$$;