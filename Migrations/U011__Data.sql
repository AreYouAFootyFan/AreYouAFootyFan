-- Undo data insertions from V011__Data.sql
DO $$
BEGIN
  -- Delete user responses first (referential integrity)
  DELETE FROM user_responses 
  WHERE attempt_id IN (1, 2, 3);
  
  -- Delete quiz attempts
  DELETE FROM quiz_attempts 
  WHERE attempt_id IN (1, 2, 3);
  
  -- Delete answers for all added questions
  -- First for quizzes 2, 3, 4
  DELETE FROM answers 
  WHERE question_id IN (8, 9, 10, 11, 12, 13);
  
  -- Delete answers for first quiz (quiz_id = 1)
  DELETE FROM answers 
  WHERE question_id IN (1, 2, 3, 4, 5, 6, 7);
  
  -- Delete questions for all added quizzes
  DELETE FROM questions 
  WHERE quiz_id IN (1, 2, 3, 4);
  
  -- Delete quizzes
  DELETE FROM quizzes 
  WHERE quiz_id IN (1, 2, 3, 4);
  
  -- Delete users (last, since other records depend on them)
  DELETE FROM users 
  WHERE username IN ('temp_admin', 'FootyFan1');
  
  RAISE NOTICE 'All data from V011__Data.sql has been removed';
END;
$$; 