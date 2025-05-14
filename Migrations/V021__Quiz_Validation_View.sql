-- Create view for valid questions
CREATE OR REPLACE VIEW valid_questions AS
SELECT 
    q.question_id,
    q.quiz_id,
    q.question_text,
    q.difficulty_id,
    q.deactivated_at,
    (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.question_id) as answer_count,
    (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.question_id AND a.is_correct = true) as correct_answer_count,
    CASE WHEN 
        (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.question_id) = 4 AND
        (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.question_id AND a.is_correct = true) = 1
    THEN true ELSE false END as is_valid
FROM questions q
WHERE q.deactivated_at IS NULL;

-- Create view for valid quizzes that uses the valid_questions view
CREATE OR REPLACE VIEW valid_quizzes AS
WITH quiz_validation AS (
    SELECT 
        q.quiz_id,
        COUNT(q.question_id) as total_questions,
        COUNT(CASE WHEN q.is_valid THEN 1 END) as valid_questions
    FROM valid_questions q
    GROUP BY q.quiz_id
)
SELECT 
    qz.*,
    c.category_name,
    c.category_description,
    COALESCE(qv.total_questions, 0) as total_questions,
    COALESCE(qv.valid_questions, 0) as valid_questions,
    CASE WHEN 
        COALESCE(qv.valid_questions, 0) >= 5 AND
        COALESCE(qv.valid_questions, 0) = COALESCE(qv.total_questions, 0)
    THEN true ELSE false END as is_valid
FROM quizzes qz
LEFT JOIN categories c ON qz.category_id = c.category_id
LEFT JOIN quiz_validation qv ON qz.quiz_id = qv.quiz_id
WHERE qz.deactivated_at IS NULL;

-- Create indexes to improve view performance
CREATE INDEX IF NOT EXISTS idx_answers_question_validation ON answers(question_id, is_correct);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_active ON questions(quiz_id, deactivated_at);
CREATE INDEX IF NOT EXISTS idx_quizzes_category_active ON quizzes(category_id, deactivated_at); 