-- Function to check and award badges to a user based on their current total points
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id INT;
    v_total_points INT;
    v_badge RECORD;
    v_badge_count INT;
BEGIN
    -- The trigger is now designed to fire when an attempt is ended
    -- NEW.end_time will be set when the quiz attempt ends
    -- Get the user ID directly from the updated quiz attempt
    v_user_id := NEW.user_id;
    
    -- Only proceed if the end_time has been set (quiz is complete)
    IF NEW.end_time IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Get user's current total points
    SELECT user_total_points INTO v_total_points
    FROM user_total_points
    WHERE user_id = v_user_id;
    
    -- If no points found, return
    IF v_total_points IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Check each badge that the user qualifies for but doesn't have yet
    FOR v_badge IN
        SELECT b.badge_id, b.badge_name, b.minimum_points
        FROM badges b
        WHERE b.minimum_points <= v_total_points
        ORDER BY b.minimum_points ASC
    LOOP
        -- Check if user already has this badge
        SELECT COUNT(*) INTO v_badge_count
        FROM badge_history bh
        WHERE bh.user_id = v_user_id AND bh.badge_id = v_badge.badge_id;
        
        -- If user doesn't have the badge yet, award it
        IF v_badge_count = 0 THEN
            INSERT INTO badge_history (user_id, badge_id)
            VALUES (v_user_id, v_badge.badge_id);
            
            -- Log the badge award
            RAISE NOTICE 'User ID % awarded the "%" badge for reaching % points', 
                v_user_id, v_badge.badge_name, v_total_points;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger that runs when a quiz attempt is updated, specifically when end_time is set
CREATE TRIGGER check_badges_after_quiz_completion
AFTER UPDATE OF end_time ON quiz_attempts
FOR EACH ROW
WHEN (OLD.end_time IS NULL AND NEW.end_time IS NOT NULL)
EXECUTE FUNCTION check_and_award_badges();

-- Function to award badges when calculating total points directly
CREATE OR REPLACE FUNCTION award_badges_for_user(p_user_id INT)
RETURNS VOID AS $$
DECLARE
    v_total_points INT;
    v_badge RECORD;
    v_badge_count INT;
BEGIN
    -- Get user's current total points
    SELECT user_total_points INTO v_total_points
    FROM user_total_points
    WHERE user_id = p_user_id;
    
    -- If no points found, return
    IF v_total_points IS NULL THEN
        RETURN;
    END IF;
    
    -- Check each badge that the user qualifies for but doesn't have yet
    FOR v_badge IN
        SELECT b.badge_id, b.badge_name, b.minimum_points
        FROM badges b
        WHERE b.minimum_points <= v_total_points
        ORDER BY b.minimum_points ASC
    LOOP
        -- Check if user already has this badge
        SELECT COUNT(*) INTO v_badge_count
        FROM badge_history bh
        WHERE bh.user_id = p_user_id AND bh.badge_id = v_badge.badge_id;
        
        -- If user doesn't have the badge yet, award it
        IF v_badge_count = 0 THEN
            INSERT INTO badge_history (user_id, badge_id)
            VALUES (p_user_id, v_badge.badge_id);
            
            -- Log the badge award
            RAISE NOTICE 'User ID % awarded the "%" badge for reaching % points', 
                p_user_id, v_badge.badge_name, v_total_points;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a comment to explain usage
COMMENT ON FUNCTION award_badges_for_user IS 
'This function can be called manually to award badges to a specific user based on their total points.
Example usage: SELECT award_badges_for_user(123);';

CREATE OR REPLACE FUNCTION update_points_on_answer_correctness_change()
RETURNS TRIGGER AS $$
DECLARE
    v_difficulty_id INT;
    v_points_on_correct INT;
    v_points_on_incorrect INT;
    v_question_id INT;
BEGIN
    -- Get the question_id for this answer
    v_question_id := NEW.question_id;
    
    -- Only proceed if the is_correct status has changed
    IF OLD.is_correct IS DISTINCT FROM NEW.is_correct THEN
        -- Get the difficulty level info for this question
        SELECT q.difficulty_id INTO v_difficulty_id
        FROM questions q
        WHERE q.question_id = v_question_id;
        
        -- Get the points values from the difficulty level
        SELECT dl.points_on_correct, dl.points_on_incorrect INTO v_points_on_correct, v_points_on_incorrect
        FROM difficulty_levels dl
        WHERE dl.difficulty_id = v_difficulty_id;
        
        -- Update all user responses that chose this answer
        IF NEW.is_correct = TRUE THEN
            -- Answer was marked as correct, update points to correct value
            UPDATE user_responses ur
            SET points_earned = v_points_on_correct
            FROM quiz_attempts qa
            WHERE ur.chosen_answer = NEW.answer_id
            AND ur.attempt_id = qa.attempt_id
            AND qa.end_time IS NOT NULL; -- Only update completed quiz attempts
        ELSE
            -- Answer was marked as incorrect, update points to incorrect value
            UPDATE user_responses ur
            SET points_earned = v_points_on_incorrect
            FROM quiz_attempts qa
            WHERE ur.chosen_answer = NEW.answer_id
            AND ur.attempt_id = qa.attempt_id
            AND qa.end_time IS NOT NULL; -- Only update completed quiz attempts
            
        END IF;
        
        -- Now let's check for badges that might need to be awarded after point changes
        -- We need to get all affected users from the updated responses
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