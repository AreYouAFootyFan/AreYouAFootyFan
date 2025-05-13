-- Premier League Quizzes
-- Note: For real migrations, IDs are auto-generated. Here, IDs are shown for clarity and should be omitted if using SERIAL/IDENTITY columns.

-- Quizzes
INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by) VALUES
('Premier League Legends', 'Test your knowledge of legendary players in the Premier League.', 1, 1),
('Premier League Managers', 'How well do you know the managers who shaped the Premier League?', 1, 1),
('Premier League Records', 'Explore the record-breaking moments in Premier League history.', 1, 1),
('Premier League Stadiums', 'Identify the iconic stadiums of Premier League clubs.', 1, 1),
('Premier League 2020s', 'Questions about the Premier League in the 2020s.', 1, 1),
('Premier League Top Scorers', 'Test your knowledge of the league''s greatest goal scorers.', 1, 1),
('Premier League Promotions', 'Facts about teams promoted to the Premier League.', 1, 1),
('Premier League Kits', 'Spot the teams by their famous kits and colors.', 1, 1),
('Premier League Rivalries', 'How much do you know about the fiercest rivalries?', 1, 1),
('Premier League Debuts', 'Memorable debut matches and players in the Premier League.', 1, 1);

-- Questions (IDs for clarity; in real use, let DB assign)
-- Quiz 1: Premier League Legends (quiz_id = 1)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(1, 'Who is the Premier League''s all-time top scorer?', 2),
(1, 'Which Frenchman captained Arsenal''s "Invincibles" in 2003-04?', 2),
(1, 'Which midfielder was known as "Captain Fantastic" for Liverpool?', 1),
(1, 'Who scored the fastest Premier League hat-trick?', 3),
(1, 'Which goalkeeper has the most Premier League clean sheets?', 3);

-- Quiz 2: Premier League Managers (quiz_id = 2)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(2, 'Who has managed the most Premier League games?', 2),
(2, 'Which manager won the treble with Manchester United in 1999?', 1),
(2, 'Who was Chelsea''s manager during their first Premier League title win in 2004-05?', 2),
(2, 'Which Spanish manager led Manchester City to 100 points in a season?', 2),
(2, 'Who was the first manager to win the Premier League with two different clubs?', 4);

-- Quiz 3: Premier League Records (quiz_id = 3)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(3, 'Which team holds the record for most points in a Premier League season?', 1),
(3, 'Who scored the fastest goal in Premier League history?', 2),
(3, 'Which club went an entire season unbeaten?', 1),
(3, 'Who has the most Premier League assists?', 3),
(3, 'Which player has the most Premier League appearances?', 3);

-- Quiz 4: Premier League Stadiums (quiz_id = 4)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(4, 'Which club plays at Old Trafford?', 1),
(4, 'What is the name of Liverpool''s home ground?', 1),
(4, 'Which London club plays at Stamford Bridge?', 1),
(4, 'Which club''s stadium is called the Etihad?', 2),
(4, 'Which club moved to the Tottenham Hotspur Stadium in 2019?', 2);

-- Quiz 5: Premier League 2020s (quiz_id = 5)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(5, 'Who won the Premier League in the 2019-20 season?', 1),
(5, 'Which player won the 2020-21 Premier League Golden Boot?', 2),
(5, 'Who managed Chelsea to the 2021 Champions League title?', 2),
(5, 'Which club finished second in the 2021-22 season?', 2),
(5, 'Who scored the most goals in the 2022-23 season?', 3);

-- Quiz 6: Premier League Top Scorers (quiz_id = 6)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(6, 'Who was the first player to score 100 Premier League goals?', 2),
(6, 'Which player scored 260 Premier League goals?', 1),
(6, 'Who is the top-scoring African player in Premier League history?', 2),
(6, 'Which player scored five goals in a single Premier League match for Manchester City in 2015?', 3),
(6, 'Who was the top scorer in the 2015-16 season?', 3);

-- Quiz 7: Premier League Promotions (quiz_id = 7)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(7, 'Which club was promoted to the Premier League for the first time in 2020?', 2),
(7, 'Who won the Championship to earn promotion in 2017-18?', 2),
(7, 'Which club returned to the Premier League after a 16-year absence in 2020?', 2),
(7, 'Who was the first club to be promoted to the Premier League?', 3),
(7, 'Which club won promotion via the playoffs in 2019?', 3);

-- Quiz 8: Premier League Kits (quiz_id = 8)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(8, 'Which club is known for their claret and blue kit?', 1),
(8, 'Which team wears black and white stripes?', 1),
(8, 'Which club''s home kit is all red?', 1),
(8, 'Which club is famous for their sky blue kit?', 2),
(8, 'Which club''s kit sponsor was "Fly Emirates" for many years?', 2);

-- Quiz 9: Premier League Rivalries (quiz_id = 9)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(9, 'Which two clubs contest the North West Derby?', 1),
(9, 'The North London Derby is between Arsenal and which club?', 1),
(9, 'Which rivalry is known as the "Merseyside Derby"?', 1),
(9, 'Which two clubs contest the Manchester Derby?', 1),
(9, 'Which rivalry is called the "Second City Derby"?', 2);

-- Quiz 10: Premier League Debuts (quiz_id = 10)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(10, 'Who scored a hat-trick on his Premier League debut for Manchester United in 2003?', 2),
(10, 'Which player scored on his Premier League debut for Chelsea in 2012?', 2),
(10, 'Who made his Premier League debut for Liverpool in 1997 and became club captain?', 2),
(10, 'Which goalkeeper saved a penalty on his Premier League debut for Arsenal in 2015?', 3),
(10, 'Who scored on his Premier League debut for Manchester City in 2011?', 3);

-- Answers for Quiz 1 (Premier League Legends)
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(1, 'Alan Shearer', TRUE),
(1, 'Wayne Rooney', FALSE),
(1, 'Thierry Henry', FALSE),
(1, 'Frank Lampard', FALSE),
(2, 'Patrick Vieira', TRUE),
(2, 'Thierry Henry', FALSE),
(2, 'Dennis Bergkamp', FALSE),
(2, 'Sol Campbell', FALSE),
(3, 'Steven Gerrard', TRUE),
(3, 'Frank Lampard', FALSE),
(3, 'Paul Scholes', FALSE),
(3, 'Roy Keane', FALSE),
(4, 'Sadio Mané', TRUE),
(4, 'Cristiano Ronaldo', FALSE),
(4, 'Sergio Agüero', FALSE),
(4, 'Harry Kane', FALSE),
(5, 'Petr Čech', TRUE),
(5, 'David de Gea', FALSE),
(5, 'Edwin van der Sar', FALSE),
(5, 'Alisson Becker', FALSE);
-- (Continue in this format for all quizzes/questions/answers)

-- La Liga Quizzes
-- Quizzes
INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by) VALUES
('La Liga Legends', 'Test your knowledge of legendary players in La Liga history.', 2, 1),
('La Liga Managers', 'How well do you know the managers who shaped La Liga?', 2, 1),
('La Liga Records', 'Explore the record-breaking moments in La Liga.', 2, 1),
('La Liga Stadiums', 'Identify the iconic stadiums of La Liga clubs.', 2, 1),
('La Liga 2020s', 'Questions about La Liga in the 2020s.', 2, 1),
('La Liga Top Scorers', 'Test your knowledge of the league''s greatest goal scorers.', 2, 1),
('La Liga Promotions', 'Facts about teams promoted to La Liga.', 2, 1),
('La Liga Kits', 'Spot the teams by their famous kits and colors.', 2, 1),
('La Liga Rivalries', 'How much do you know about the fiercest rivalries?', 2, 1),
('La Liga Debuts', 'Memorable debut matches and players in La Liga.', 2, 1);

-- Questions (IDs for clarity; in real use, let DB assign)
-- Quiz 11: La Liga Legends (quiz_id = 11)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(11, 'Who is La Liga''s all-time top scorer?', 2),
(11, 'Which goalkeeper has the most clean sheets in La Liga history?', 3),
(11, 'Which Brazilian played for both Barcelona and Real Madrid?', 2),
(11, 'Who captained Barcelona during their 2009 sextuple-winning year?', 2),
(11, 'Which Spanish striker was known as "El Niño"?', 1);

-- Quiz 12: La Liga Managers (quiz_id = 12)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(12, 'Who managed Real Madrid to three consecutive Champions League titles (2016-2018)?', 2),
(12, 'Which manager led Atlético Madrid to the 2014 La Liga title?', 2),
(12, 'Who was Barcelona''s manager during their 2008-09 treble?', 1),
(12, 'Which Frenchman managed Real Madrid from 2016 to 2021?', 2),
(12, 'Who managed Valencia to their last La Liga title in 2003-04?', 3);

-- Quiz 13: La Liga Records (quiz_id = 13)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(13, 'Which club has won the most La Liga titles?', 1),
(13, 'Who holds the record for most goals in a single La Liga season?', 2),
(13, 'Which player has the most La Liga appearances?', 3),
(13, 'Which team went unbeaten in the 2017-18 La Liga season?', 2),
(13, 'Who is the youngest player to score in La Liga?', 4);

-- Quiz 14: La Liga Stadiums (quiz_id = 14)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(14, 'Which club plays at Camp Nou?', 1),
(14, 'What is the name of Real Madrid''s home ground?', 1),
(14, 'Which club plays at Wanda Metropolitano?', 2),
(14, 'Which club''s stadium is called Mestalla?', 2),
(14, 'Which club plays at San Mamés?', 3);

-- Quiz 15: La Liga 2020s (quiz_id = 15)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(15, 'Who won La Liga in the 2020-21 season?', 1),
(15, 'Which player won the 2021-22 La Liga Golden Boot?', 2),
(15, 'Who managed Barcelona in the 2021-22 season?', 2),
(15, 'Which club finished second in the 2020-21 season?', 2),
(15, 'Who scored the most goals in the 2022-23 season?', 3);

-- Quiz 16: La Liga Top Scorers (quiz_id = 16)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(16, 'Who was the first player to score 200 La Liga goals?', 2),
(16, 'Which player scored 474 La Liga goals?', 1),
(16, 'Who is the top-scoring non-Spanish player in La Liga history?', 2),
(16, 'Which player scored five goals in a single La Liga match for Barcelona in 2012?', 3),
(16, 'Who was the top scorer in the 2015-16 season?', 3);

-- Quiz 17: La Liga Promotions (quiz_id = 17)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(17, 'Which club was promoted to La Liga for the first time in 2020?', 2),
(17, 'Who won the Segunda División to earn promotion in 2017-18?', 2),
(17, 'Which club returned to La Liga after a 13-year absence in 2020?', 2),
(17, 'Who was the first club to be promoted to La Liga?', 3),
(17, 'Which club won promotion via the playoffs in 2019?', 3);

-- Quiz 18: La Liga Kits (quiz_id = 18)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(18, 'Which club is known for their white kit?', 1),
(18, 'Which team wears red and white stripes?', 1),
(18, 'Which club''s home kit is all blue?', 1),
(18, 'Which club is famous for their yellow kit?', 2),
(18, 'Which club''s kit sponsor was "Qatar Airways" for many years?', 2);

-- Quiz 19: La Liga Rivalries (quiz_id = 19)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(19, 'Which two clubs contest El Clásico?', 1),
(19, 'The Seville Derby is between Sevilla and which club?', 1),
(19, 'Which rivalry is known as the "Basque Derby"?', 1),
(19, 'Which two clubs contest the Madrid Derby?', 1),
(19, 'Which rivalry is called the "Valencian Derby"?', 2);

-- Quiz 20: La Liga Debuts (quiz_id = 20)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(20, 'Who scored a hat-trick on his La Liga debut for Real Madrid in 2009?', 2),
(20, 'Which player scored on his La Liga debut for Barcelona in 2004?', 2),
(20, 'Who made his La Liga debut for Atlético Madrid in 2014 and became club captain?', 2),
(20, 'Which goalkeeper saved a penalty on his La Liga debut for Valencia in 2015?', 3),
(20, 'Who scored on his La Liga debut for Sevilla in 2011?', 3);

-- Answers for Quiz 11 (La Liga Legends)
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(51, 'Lionel Messi', TRUE),
(51, 'Cristiano Ronaldo', FALSE),
(51, 'Raúl', FALSE),
(51, 'Telmo Zarra', FALSE),
(52, 'Andoni Zubizarreta', TRUE),
(52, 'Iker Casillas', FALSE),
(52, 'Victor Valdés', FALSE),
(52, 'Jan Oblak', FALSE),
(53, 'Ronaldo Nazário', TRUE),
(53, 'Ronaldinho', FALSE),
(53, 'Samuel Eto''o', FALSE),
(53, 'Neymar', FALSE),
(54, 'Carles Puyol', TRUE),
(54, 'Xavi', FALSE),
(54, 'Andrés Iniesta', FALSE),
(54, 'Gerard Piqué', FALSE),
(55, 'Fernando Torres', TRUE),
(55, 'David Villa', FALSE),
(55, 'Raúl', FALSE),
(55, 'Fernando Morientes', FALSE);
-- (Continue in this format for all quizzes/questions/answers)

-- Bundesliga Quizzes
-- Quizzes
INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by) VALUES
('Bundesliga Legends', 'Test your knowledge of legendary players in Bundesliga history.', 3, 1),
('Bundesliga Managers', 'How well do you know the managers who shaped the Bundesliga?', 3, 1),
('Bundesliga Records', 'Explore the record-breaking moments in the Bundesliga.', 3, 1),
('Bundesliga Stadiums', 'Identify the iconic stadiums of Bundesliga clubs.', 3, 1),
('Bundesliga 2020s', 'Questions about the Bundesliga in the 2020s.', 3, 1),
('Bundesliga Top Scorers', 'Test your knowledge of the league''s greatest goal scorers.', 3, 1),
('Bundesliga Promotions', 'Facts about teams promoted to the Bundesliga.', 3, 1),
('Bundesliga Kits', 'Spot the teams by their famous kits and colors.', 3, 1),
('Bundesliga Rivalries', 'How much do you know about the fiercest rivalries?', 3, 1),
('Bundesliga Debuts', 'Memorable debut matches and players in the Bundesliga.', 3, 1);

-- Questions (IDs for clarity; in real use, let DB assign)
-- Quiz 21: Bundesliga Legends (quiz_id = 21)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(21, 'Who is the Bundesliga''s all-time top scorer?', 2),
(21, 'Which goalkeeper has the most clean sheets in Bundesliga history?', 3),
(21, 'Which Frenchman starred for Bayern Munich and won the 2013 Ballon d''Or?', 2),
(21, 'Who captained Borussia Dortmund to back-to-back titles in 2011 and 2012?', 2),
(21, 'Which German striker was known as "Der Bomber"?', 1);

-- Quiz 22: Bundesliga Managers (quiz_id = 22)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(22, 'Who managed Bayern Munich to the 2013 treble?', 2),
(22, 'Which manager led Borussia Dortmund to two consecutive Bundesliga titles (2011, 2012)?', 2),
(22, 'Who was the longest-serving manager in Bundesliga history?', 3),
(22, 'Which Austrian managed RB Leipzig to their first Champions League semi-final?', 2),
(22, 'Who managed Schalke 04 to their highest Bundesliga finish in 2010?', 3);

-- Quiz 23: Bundesliga Records (quiz_id = 23)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(23, 'Which club has won the most Bundesliga titles?', 1),
(23, 'Who holds the record for most goals in a single Bundesliga season?', 2),
(23, 'Which player has the most Bundesliga appearances?', 3),
(23, 'Which team went unbeaten in the 2012-13 Bundesliga season?', 2),
(23, 'Who is the youngest player to score in the Bundesliga?', 4);

-- Quiz 24: Bundesliga Stadiums (quiz_id = 24)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(24, 'Which club plays at Allianz Arena?', 1),
(24, 'What is the name of Borussia Dortmund''s home ground?', 1),
(24, 'Which club plays at Red Bull Arena?', 2),
(24, 'Which club''s stadium is called Olympiastadion?', 2),
(24, 'Which club plays at RheinEnergieStadion?', 3);

-- Quiz 25: Bundesliga 2020s (quiz_id = 25)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(25, 'Who won the Bundesliga in the 2020-21 season?', 1),
(25, 'Which player won the 2021-22 Bundesliga Golden Boot?', 2),
(25, 'Who managed Bayern Munich in the 2021-22 season?', 2),
(25, 'Which club finished second in the 2020-21 season?', 2),
(25, 'Who scored the most goals in the 2022-23 season?', 3);

-- Quiz 26: Bundesliga Top Scorers (quiz_id = 26)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(26, 'Who was the first player to score 200 Bundesliga goals?', 2),
(26, 'Which player scored 365 Bundesliga goals?', 1),
(26, 'Who is the top-scoring non-German player in Bundesliga history?', 2),
(26, 'Which player scored five goals in nine minutes for Bayern Munich in 2015?', 3),
(26, 'Who was the top scorer in the 2015-16 season?', 3);

-- Quiz 27: Bundesliga Promotions (quiz_id = 27)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(27, 'Which club was promoted to the Bundesliga for the first time in 2020?', 2),
(27, 'Who won the 2. Bundesliga to earn promotion in 2017-18?', 2),
(27, 'Which club returned to the Bundesliga after a 28-year absence in 2020?', 2),
(27, 'Who was the first club to be promoted to the Bundesliga?', 3),
(27, 'Which club won promotion via the playoffs in 2019?', 3);

-- Quiz 28: Bundesliga Kits (quiz_id = 28)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(28, 'Which club is known for their red kit?', 1),
(28, 'Which team wears yellow and black?', 1),
(28, 'Which club''s home kit is all blue?', 1),
(28, 'Which club is famous for their green kit?', 2),
(28, 'Which club''s kit sponsor was "Opel" for many years?', 2);

-- Quiz 29: Bundesliga Rivalries (quiz_id = 29)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(29, 'Which two clubs contest Der Klassiker?', 1),
(29, 'The Revierderby is between Borussia Dortmund and which club?', 1),
(29, 'Which rivalry is known as the "Berlin Derby"?', 1),
(29, 'Which two clubs contest the Hamburg Derby?', 1),
(29, 'Which rivalry is called the "Baden Derby"?', 2);

-- Quiz 30: Bundesliga Debuts (quiz_id = 30)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(30, 'Who scored a hat-trick on his Bundesliga debut for Borussia Dortmund in 2020?', 2),
(30, 'Which player scored on his Bundesliga debut for Bayern Munich in 2014?', 2),
(30, 'Who made his Bundesliga debut for RB Leipzig in 2016 and became club captain?', 2),
(30, 'Which goalkeeper saved a penalty on his Bundesliga debut for Schalke 04 in 2015?', 3),
(30, 'Who scored on his Bundesliga debut for Werder Bremen in 2011?', 3);

-- Answers for Quiz 21 (Bundesliga Legends)
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(101, 'Gerd Müller', TRUE),
(101, 'Robert Lewandowski', FALSE),
(101, 'Klaus Fischer', FALSE),
(101, 'Jupp Heynckes', FALSE),
(102, 'Oliver Kahn', TRUE),
(102, 'Manuel Neuer', FALSE),
(102, 'Sepp Maier', FALSE),
(102, 'Roman Weidenfeller', FALSE),
(103, 'Franck Ribéry', TRUE),
(103, 'Arjen Robben', FALSE),
(103, 'Bastian Schweinsteiger', FALSE),
(103, 'Thomas Müller', FALSE),
(104, 'Sebastian Kehl', TRUE),
(104, 'Mats Hummels', FALSE),
(104, 'Marco Reus', FALSE),
(104, 'Ilkay Gündogan', FALSE),
(105, 'Gerd Müller', TRUE),
(105, 'Miroslav Klose', FALSE),
(105, 'Uwe Seeler', FALSE),
(105, 'Rudi Völler', FALSE);
-- (Continue in this format for all quizzes/questions/answers)

-- Serie A Quizzes
-- Quizzes
INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by) VALUES
('Serie A Legends', 'Test your knowledge of legendary players in Serie A history.', 4, 1),
('Serie A Managers', 'How well do you know the managers who shaped Serie A?', 4, 1),
('Serie A Records', 'Explore the record-breaking moments in Serie A.', 4, 1),
('Serie A Stadiums', 'Identify the iconic stadiums of Serie A clubs.', 4, 1),
('Serie A 2020s', 'Questions about Serie A in the 2020s.', 4, 1),
('Serie A Top Scorers', 'Test your knowledge of the league''s greatest goal scorers.', 4, 1),
('Serie A Promotions', 'Facts about teams promoted to Serie A.', 4, 1),
('Serie A Kits', 'Spot the teams by their famous kits and colors.', 4, 1),
('Serie A Rivalries', 'How much do you know about the fiercest rivalries?', 4, 1),
('Serie A Debuts', 'Memorable debut matches and players in Serie A.', 4, 1);

-- Questions (IDs for clarity; in real use, let DB assign)
-- Quiz 31: Serie A Legends (quiz_id = 31)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(31, 'Who is Serie A''s all-time top scorer?', 2),
(31, 'Which goalkeeper has the most clean sheets in Serie A history?', 3),
(31, 'Which Swedish striker starred for Juventus, Inter, and AC Milan?', 2),
(31, 'Who captained Roma to their 2001 Serie A title?', 2),
(31, 'Which Italian striker was known as "Il Bisonte"?', 1);

-- Quiz 32: Serie A Managers (quiz_id = 32)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(32, 'Who managed Inter Milan to the 2010 treble?', 2),
(32, 'Which manager led Juventus to nine consecutive Serie A titles?', 2),
(32, 'Who was AC Milan''s manager during their 2006-07 Champions League win?', 1),
(32, 'Which Italian managed Napoli to their first Serie A title in 1987?', 2),
(32, 'Who managed Lazio to their last Serie A title in 1999-2000?', 3);

-- Quiz 33: Serie A Records (quiz_id = 33)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(33, 'Which club has won the most Serie A titles?', 1),
(33, 'Who holds the record for most goals in a single Serie A season?', 2),
(33, 'Which player has the most Serie A appearances?', 3),
(33, 'Which team went unbeaten in the 2011-12 Serie A season?', 2),
(33, 'Who is the youngest player to score in Serie A?', 4);

-- Quiz 34: Serie A Stadiums (quiz_id = 34)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(34, 'Which club plays at San Siro?', 1),
(34, 'What is the name of Juventus''s home ground?', 1),
(34, 'Which club plays at Stadio Olimpico?', 2),
(34, 'Which club''s stadium is called Stadio Artemio Franchi?', 2),
(34, 'Which club plays at Stadio Diego Armando Maradona?', 3);

-- Quiz 35: Serie A 2020s (quiz_id = 35)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(35, 'Who won Serie A in the 2020-21 season?', 1),
(35, 'Which player won the 2021-22 Serie A Golden Boot?', 2),
(35, 'Who managed AC Milan in the 2021-22 season?', 2),
(35, 'Which club finished second in the 2020-21 season?', 2),
(35, 'Who scored the most goals in the 2022-23 season?', 3);

-- Quiz 36: Serie A Top Scorers (quiz_id = 36)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(36, 'Who was the first player to score 200 Serie A goals?', 2),
(36, 'Which player scored 274 Serie A goals?', 1),
(36, 'Who is the top-scoring non-Italian player in Serie A history?', 2),
(36, 'Which player scored five goals in a single Serie A match for Torino in 1947?', 3),
(36, 'Who was the top scorer in the 2015-16 season?', 3);

-- Quiz 37: Serie A Promotions (quiz_id = 37)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(37, 'Which club was promoted to Serie A for the first time in 2020?', 2),
(37, 'Who won Serie B to earn promotion in 2017-18?', 2),
(37, 'Which club returned to Serie A after a 19-year absence in 2020?', 2),
(37, 'Who was the first club to be promoted to Serie A?', 3),
(37, 'Which club won promotion via the playoffs in 2019?', 3);

-- Quiz 38: Serie A Kits (quiz_id = 38)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(38, 'Which club is known for their black and white kit?', 1),
(38, 'Which team wears red and black stripes?', 1),
(38, 'Which club''s home kit is all blue?', 1),
(38, 'Which club is famous for their purple kit?', 2),
(38, 'Which club''s kit sponsor was "Pirelli" for many years?', 2);

-- Quiz 39: Serie A Rivalries (quiz_id = 39)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(39, 'Which two clubs contest the Derby d''Italia?', 1),
(39, 'The Rome Derby is between Roma and which club?', 1),
(39, 'Which rivalry is known as the "Derby della Madonnina"?', 1),
(39, 'Which two clubs contest the Derby della Mole?', 1),
(39, 'Which rivalry is called the "Derby del Sole"?', 2);

-- Quiz 40: Serie A Debuts (quiz_id = 40)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(40, 'Who scored a hat-trick on his Serie A debut for Napoli in 2013?', 2),
(40, 'Which player scored on his Serie A debut for Juventus in 2011?', 2),
(40, 'Who made his Serie A debut for Inter Milan in 2010 and became club captain?', 2),
(40, 'Which goalkeeper saved a penalty on his Serie A debut for Roma in 2015?', 3),
(40, 'Who scored on his Serie A debut for Fiorentina in 2011?', 3);

-- Answers for Quiz 31 (Serie A Legends)
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(151, 'Silvio Piola', TRUE),
(151, 'Francesco Totti', FALSE),
(151, 'Gunnar Nordahl', FALSE),
(151, 'Roberto Baggio', FALSE),
(152, 'Gianluigi Buffon', TRUE),
(152, 'Dino Zoff', FALSE),
(152, 'Walter Zenga', FALSE),
(152, 'Samir Handanović', FALSE),
(153, 'Zlatan Ibrahimović', TRUE),
(153, 'Henrik Larsson', FALSE),
(153, 'Andriy Shevchenko', FALSE),
(153, 'Gabriel Batistuta', FALSE),
(154, 'Francesco Totti', TRUE),
(154, 'Daniele De Rossi', FALSE),
(154, 'Aldair', FALSE),
(154, 'Vincenzo Montella', FALSE),
(155, 'Christian Vieri', TRUE),
(155, 'Filippo Inzaghi', FALSE),
(155, 'Roberto Mancini', FALSE),
(155, 'Luca Toni', FALSE);
-- (Continue in this format for all quizzes/questions/answers)

-- Champions League Quizzes
-- Quizzes
INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by) VALUES
('Champions League Legends', 'Test your knowledge of legendary players in Champions League history.', 5, 1),
('Champions League Managers', 'How well do you know the managers who shaped the Champions League?', 5, 1),
('Champions League Records', 'Explore the record-breaking moments in the Champions League.', 5, 1),
('Champions League Finals', 'Memorable finals and their outcomes.', 5, 1),
('Champions League 2020s', 'Questions about the Champions League in the 2020s.', 5, 1),
('Champions League Top Scorers', 'Test your knowledge of the competition''s greatest goal scorers.', 5, 1),
('Champions League Comebacks', 'Famous comebacks in Champions League history.', 5, 1),
('Champions League Kits', 'Spot the teams by their famous kits and colors.', 5, 1),
('Champions League Rivalries', 'How much do you know about the fiercest rivalries?', 5, 1),
('Champions League Debuts', 'Memorable debut matches and players in the Champions League.', 5, 1);

-- Questions (IDs for clarity; in real use, let DB assign)
-- Quiz 41: Champions League Legends (quiz_id = 41)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(41, 'Who is the Champions League''s all-time top scorer?', 2),
(41, 'Which goalkeeper has the most clean sheets in Champions League history?', 3),
(41, 'Which Brazilian won the Champions League with both Real Madrid and AC Milan?', 2),
(41, 'Who captained Liverpool to their 2005 Champions League win?', 2),
(41, 'Which Spanish striker scored in two different Champions League finals?', 1);

-- Quiz 42: Champions League Managers (quiz_id = 42)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(42, 'Who has won the most Champions League titles as a manager?', 2),
(42, 'Which manager led Barcelona to two Champions League titles in 2009 and 2011?', 2),
(42, 'Who managed Real Madrid to three consecutive Champions League titles (2016-2018)?', 1),
(42, 'Which German managed Bayern Munich to the 2020 title?', 2),
(42, 'Who managed Chelsea to their first Champions League title in 2012?', 3);

-- Quiz 43: Champions League Records (quiz_id = 43)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(43, 'Which club has won the most Champions League titles?', 1),
(43, 'Who holds the record for most goals in a single Champions League season?', 2),
(43, 'Which player has the most Champions League appearances?', 3),
(43, 'Which team won the Champions League unbeaten in 1999?', 2),
(43, 'Who is the youngest player to score in the Champions League?', 4);

-- Quiz 44: Champions League Finals (quiz_id = 44)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(44, 'Which club won the 2019 Champions League final?', 1),
(44, 'Who scored the winning goal in the 2012 final?', 2),
(44, 'Which stadium hosted the 2018 final?', 3),
(44, 'Who captained Bayern Munich in the 2013 final?', 2),
(44, 'Which team lost the 2014 final in extra time?', 2);

-- Quiz 45: Champions League 2020s (quiz_id = 45)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(45, 'Who won the Champions League in the 2020-21 season?', 1),
(45, 'Which player won the 2021-22 Champions League Golden Boot?', 2),
(45, 'Who managed Chelsea in the 2020-21 season?', 2),
(45, 'Which club finished runner-up in the 2021-22 season?', 2),
(45, 'Who scored the most goals in the 2022-23 season?', 3);

-- Quiz 46: Champions League Top Scorers (quiz_id = 46)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(46, 'Who was the first player to score 50 Champions League goals?', 2),
(46, 'Which player scored 140 Champions League goals?', 1),
(46, 'Who is the top-scoring non-European player in Champions League history?', 2),
(46, 'Which player scored five goals in a single Champions League match for Barcelona in 2012?', 3),
(46, 'Who was the top scorer in the 2015-16 season?', 3);

-- Quiz 47: Champions League Comebacks (quiz_id = 47)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(47, 'Which club came back from 3-0 down to win the 2005 final?', 1),
(47, 'Who scored the equalizer for Manchester United in the 1999 final?', 2),
(47, 'Which team overturned a 4-0 first-leg deficit in 2017-18?', 2),
(47, 'Who scored the decisive goal in the 2012 semi-final comeback for Chelsea?', 3),
(47, 'Which club lost a 4-1 first-leg lead in the 2016-17 round of 16?', 3);

-- Quiz 48: Champions League Kits (quiz_id = 48)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(48, 'Which club is known for their all-white kit?', 1),
(48, 'Which team wears red and blue stripes?', 1),
(48, 'Which club''s home kit is all red?', 1),
(48, 'Which club is famous for their black and white kit?', 2),
(48, 'Which club''s kit sponsor was "Fly Emirates" for many years?', 2);

-- Quiz 49: Champions League Rivalries (quiz_id = 49)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(49, 'Which two clubs contested the 2011 final at Wembley?', 1),
(49, 'The Madrid Derby final in 2014 was between Real Madrid and which club?', 1),
(49, 'Which rivalry is known as the "Der Klassiker"?', 1),
(49, 'Which two clubs contested the 2008 final in Moscow?', 1),
(49, 'Which rivalry is called the "Derby della Madonnina"?', 2);

-- Quiz 50: Champions League Debuts (quiz_id = 50)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(50, 'Who scored a hat-trick on his Champions League debut for Manchester United in 2004?', 2),
(50, 'Which player scored on his Champions League debut for Barcelona in 2004?', 2),
(50, 'Who made his Champions League debut for Real Madrid in 2009 and became club captain?', 2),
(50, 'Which goalkeeper saved a penalty on his Champions League debut for Chelsea in 2012?', 3),
(50, 'Who scored on his Champions League debut for Bayern Munich in 2011?', 3);

-- Answers for Quiz 41 (Champions League Legends)
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(201, 'Cristiano Ronaldo', TRUE),
(201, 'Lionel Messi', FALSE),
(201, 'Raúl', FALSE),
(201, 'Robert Lewandowski', FALSE),
(202, 'Iker Casillas', TRUE),
(202, 'Gianluigi Buffon', FALSE),
(202, 'Manuel Neuer', FALSE),
(202, 'Petr Čech', FALSE),
(203, 'Cafu', TRUE),
(203, 'Roberto Carlos', FALSE),
(203, 'Kaká', FALSE),
(203, 'Ronaldo Nazário', FALSE),
(204, 'Steven Gerrard', TRUE),
(204, 'Jamie Carragher', FALSE),
(204, 'Xabi Alonso', FALSE),
(204, 'Sami Hyypiä', FALSE),
(205, 'Fernando Morientes', TRUE),
(205, 'David Villa', FALSE),
(205, 'Raúl', FALSE),
(205, 'Fernando Torres', FALSE);
-- (Continue in this format for all quizzes/questions/answers)

-- World Cup Quizzes
-- Quizzes
INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by) VALUES
('World Cup Legends', 'Test your knowledge of legendary players in World Cup history.', 6, 1),
('World Cup Managers', 'How well do you know the managers who shaped the World Cup?', 6, 1),
('World Cup Records', 'Explore the record-breaking moments in the World Cup.', 6, 1),
('World Cup Finals', 'Memorable finals and their outcomes.', 6, 1),
('World Cup 2010s', 'Questions about the World Cup in the 2010s.', 6, 1),
('World Cup Top Scorers', 'Test your knowledge of the tournament''s greatest goal scorers.', 6, 1),
('World Cup Upsets', 'Famous upsets in World Cup history.', 6, 1),
('World Cup Kits', 'Spot the teams by their famous kits and colors.', 6, 1),
('World Cup Rivalries', 'How much do you know about the fiercest rivalries?', 6, 1),
('World Cup Debuts', 'Memorable debut matches and players in the World Cup.', 6, 1);

-- Questions (IDs for clarity; in real use, let DB assign)
-- Quiz 51: World Cup Legends (quiz_id = 51)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(51, 'Who is the World Cup''s all-time top scorer?', 2),
(51, 'Which goalkeeper has the most clean sheets in World Cup history?', 3),
(51, 'Which Brazilian won three World Cups?', 2),
(51, 'Who captained France to their 1998 World Cup win?', 2),
(51, 'Which German striker scored in three different World Cups?', 1);

-- Quiz 52: World Cup Managers (quiz_id = 52)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(52, 'Who has won the most World Cups as a manager?', 2),
(52, 'Which manager led Germany to the 2014 World Cup title?', 2),
(52, 'Who managed Spain to their 2010 World Cup win?', 1),
(52, 'Which Frenchman managed France to the 2018 title?', 2),
(52, 'Who managed Argentina to the 1986 World Cup win?', 3);

-- Quiz 53: World Cup Records (quiz_id = 53)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(53, 'Which country has won the most World Cups?', 1),
(53, 'Who holds the record for most goals in a single World Cup tournament?', 2),
(53, 'Which player has the most World Cup appearances?', 3),
(53, 'Which team won the World Cup unbeaten in 2010?', 2),
(53, 'Who is the youngest player to score in a World Cup?', 4);

-- Quiz 54: World Cup Finals (quiz_id = 54)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(54, 'Which country won the 2014 World Cup final?', 1),
(54, 'Who scored the winning goal in the 2010 final?', 2),
(54, 'Which stadium hosted the 2018 final?', 3),
(54, 'Who captained Brazil in the 2002 final?', 2),
(54, 'Which team lost the 2006 final on penalties?', 2);

-- Quiz 55: World Cup 2010s (quiz_id = 55)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(55, 'Who won the World Cup in 2010?', 1),
(55, 'Which player won the 2014 World Cup Golden Boot?', 2),
(55, 'Who managed Germany in the 2014 World Cup?', 2),
(55, 'Which club finished runner-up in the 2018 World Cup?', 2),
(55, 'Who scored the most goals in the 2018 World Cup?', 3);

-- Quiz 56: World Cup Top Scorers (quiz_id = 56)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(56, 'Who was the first player to score 10 World Cup goals?', 2),
(56, 'Which player scored 16 World Cup goals?', 1),
(56, 'Who is the top-scoring African player in World Cup history?', 2),
(56, 'Which player scored five goals in a single World Cup match for Russia in 1994?', 3),
(56, 'Who was the top scorer in the 2018 World Cup?', 3);

-- Quiz 57: World Cup Upsets (quiz_id = 57)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(57, 'Which country defeated England in the 2018 group stage?', 1),
(57, 'Who scored the winning goal for South Korea against Italy in 2002?', 2),
(57, 'Which African team knocked out France in 2002?', 2),
(57, 'Who scored the decisive goal for Senegal in 2002?', 3),
(57, 'Which team eliminated defending champions Spain in 2014?', 3);

-- Quiz 58: World Cup Kits (quiz_id = 58)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(58, 'Which country is known for their yellow kit?', 1),
(58, 'Which team wears blue shirts and white shorts?', 1),
(58, 'Which country''s home kit is all red?', 1),
(58, 'Which team is famous for their orange kit?', 2),
(58, 'Which country''s kit sponsor was "Adidas" for many years?', 2);

-- Quiz 59: World Cup Rivalries (quiz_id = 59)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(59, 'Which two countries contest the "Superclásico de las Américas"?', 1),
(59, 'The "Battle of Santiago" was between Chile and which country?', 1),
(59, 'Which rivalry is known as the "Der Klassiker"?', 1),
(59, 'Which two countries contested the 2014 final?', 1),
(59, 'Which rivalry is called the "Derby della Madonnina"?', 2);

-- Quiz 60: World Cup Debuts (quiz_id = 60)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(60, 'Who scored a hat-trick on his World Cup debut for Portugal in 2018?', 2),
(60, 'Which player scored on his World Cup debut for England in 2018?', 2),
(60, 'Who made his World Cup debut for Brazil in 1958 and became a legend?', 2),
(60, 'Which goalkeeper saved a penalty on his World Cup debut for Costa Rica in 2014?', 3),
(60, 'Who scored on his World Cup debut for France in 1998?', 3);

-- Answers for Quiz 51 (World Cup Legends)
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(251, 'Miroslav Klose', TRUE),
(251, 'Ronaldo Nazário', FALSE),
(251, 'Pelé', FALSE),
(251, 'Gerd Müller', FALSE),
(252, 'Fabien Barthez', TRUE),
(252, 'Manuel Neuer', FALSE),
(252, 'Gianluigi Buffon', FALSE),
(252, 'Iker Casillas', FALSE),
(253, 'Pelé', TRUE),
(253, 'Cafu', FALSE),
(253, 'Ronaldo Nazário', FALSE),
(253, 'Romário', FALSE),
(254, 'Didier Deschamps', TRUE),
(254, 'Zinedine Zidane', FALSE),
(254, 'Laurent Blanc', FALSE),
(254, 'Marcel Desailly', FALSE),
(255, 'Jürgen Klinsmann', TRUE),
(255, 'Miroslav Klose', FALSE),
(255, 'Gerd Müller', FALSE),
(255, 'Lothar Matthäus', FALSE);
-- (Continue in this format for all quizzes/questions/answers)

-- Football History Quizzes
-- Quizzes
INSERT INTO quizzes (quiz_title, quiz_description, category_id, created_by) VALUES
('Football History Legends', 'Test your knowledge of legendary players throughout football history.', 7, 1),
('Football History Managers', 'How well do you know the managers who shaped football history?', 7, 1),
('Football History Records', 'Explore the record-breaking moments in football history.', 7, 1),
('Historic Finals', 'Memorable finals and their outcomes across football history.', 7, 1),
('Football in the 20th Century', 'Questions about football in the 1900s.', 7, 1),
('Top Scorers in History', 'Test your knowledge of the greatest goal scorers in football history.', 7, 1),
('Historic Upsets', 'Famous upsets in football history.', 7, 1),
('Historic Kits', 'Spot the teams by their famous historic kits and colors.', 7, 1),
('Historic Rivalries', 'How much do you know about the fiercest rivalries in football history?', 7, 1),
('Historic Debuts', 'Memorable debut matches and players in football history.', 7, 1);

-- Questions (IDs for clarity; in real use, let DB assign)
-- Quiz 61: Football History Legends (quiz_id = 61)
INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES
(61, 'Who is widely regarded as the greatest footballer of the 20th century?', 2),
(61, 'Which goalkeeper was known as the "Black Spider"?', 3),
(61, 'Which Dutchman led the "Total Football" revolution?', 2),