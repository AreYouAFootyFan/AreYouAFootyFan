CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id INT;
    v_total_points INT;
    v_badge RECORD;
    v_badge_count INT;
BEGIN
    v_user_id := NEW.user_id;
    
    IF NEW.end_time IS NULL THEN
        RETURN NEW;
    END IF;
    
    SELECT user_total_points INTO v_total_points
    FROM user_total_points
    WHERE user_id = v_user_id;
    
    IF v_total_points IS NULL THEN
        RETURN NEW;
    END IF;
    
    FOR v_badge IN
        SELECT b.badge_id, b.badge_name, b.minimum_points
        FROM badges b
        WHERE b.minimum_points <= v_total_points
        ORDER BY b.minimum_points ASC
    LOOP
        SELECT COUNT(*) INTO v_badge_count
        FROM badge_history bh
        WHERE bh.user_id = v_user_id AND bh.badge_id = v_badge.badge_id;
        
        IF v_badge_count = 0 THEN
            INSERT INTO badge_history (user_id, badge_id)
            VALUES (v_user_id, v_badge.badge_id);
            
            RAISE NOTICE 'User ID % awarded the "%" badge for reaching % points', 
                v_user_id, v_badge.badge_name, v_total_points;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_badges_after_quiz_completion
AFTER UPDATE OF end_time ON quiz_attempts
FOR EACH ROW
WHEN (OLD.end_time IS NULL AND NEW.end_time IS NOT NULL)
EXECUTE FUNCTION check_and_award_badges();

CREATE OR REPLACE FUNCTION award_badges_for_user(p_user_id INT)
RETURNS VOID AS $$
DECLARE
    v_total_points INT;
    v_badge RECORD;
    v_badge_count INT;
BEGIN
    SELECT user_total_points INTO v_total_points
    FROM user_total_points
    WHERE user_id = p_user_id;
    
    IF v_total_points IS NULL THEN
        RETURN;
    END IF;
    
    FOR v_badge IN
        SELECT b.badge_id, b.badge_name, b.minimum_points
        FROM badges b
        WHERE b.minimum_points <= v_total_points
        ORDER BY b.minimum_points ASC
    LOOP
        SELECT COUNT(*) INTO v_badge_count
        FROM badge_history bh
        WHERE bh.user_id = p_user_id AND bh.badge_id = v_badge.badge_id;
        
        IF v_badge_count = 0 THEN
            INSERT INTO badge_history (user_id, badge_id)
            VALUES (p_user_id, v_badge.badge_id);
            
            RAISE NOTICE 'User ID % awarded the "%" badge for reaching % points', 
                p_user_id, v_badge.badge_name, v_total_points;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_points_on_answer_correctness_change()
RETURNS TRIGGER AS $$
DECLARE
    v_difficulty_id INT;
    v_points_on_correct INT;
    v_points_on_incorrect INT;
    v_question_id INT;
BEGIN
    v_question_id := NEW.question_id;
    
    IF OLD.is_correct IS DISTINCT FROM NEW.is_correct THEN
        SELECT q.difficulty_id INTO v_difficulty_id
        FROM questions q
        WHERE q.question_id = v_question_id;
        
        SELECT dl.points_on_correct, dl.points_on_incorrect INTO v_points_on_correct, v_points_on_incorrect
        FROM difficulty_levels dl
        WHERE dl.difficulty_id = v_difficulty_id;
        
        IF NEW.is_correct = TRUE THEN
            UPDATE user_responses ur
            SET points_earned = v_points_on_correct
            FROM quiz_attempts qa
            WHERE ur.chosen_answer = NEW.answer_id
            AND ur.attempt_id = qa.attempt_id
            AND qa.end_time IS NOT NULL;
        ELSE
            UPDATE user_responses ur
            SET points_earned = v_points_on_incorrect
            FROM quiz_attempts qa
            WHERE ur.chosen_answer = NEW.answer_id
            AND ur.attempt_id = qa.attempt_id
            AND qa.end_time IS NOT NULL;          
        END IF;
        
        PERFORM award_badges_for_user(qa.user_id)
        FROM user_responses ur
        JOIN quiz_attempts qa ON ur.attempt_id = qa.attempt_id
        WHERE ur.chosen_answer = NEW.answer_id
        AND qa.end_time IS NOT NULL
        GROUP BY qa.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_points_on_answer_correctness_change
AFTER UPDATE OF is_correct ON answers
FOR EACH ROW
EXECUTE FUNCTION update_points_on_answer_correctness_change();