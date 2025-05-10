import express from "express";
import path from "path";
import dotenv from "dotenv";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

dotenv.config();

import categoryRoutes from "./routes/category.routes";
import difficultyRoutes from "./routes/difficulty.routes";
import quizRoutes from "./routes/quiz.routes";
import questionRoutes from "./routes/question.routes";
import answerRoutes from "./routes/answer.routes";
import quizAttemptRoutes from "./routes/quiz-attempt.routes";
import userResponseRoutes from "./routes/user-response.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import validatorRoutes from "./routes/quiz-validator.routes";
import statsRoutes from "./routes/stats.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "../public/static")));

app.use("/api/categories", categoryRoutes);
app.use("/api/difficulty-levels", difficultyRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/quiz-attempts", quizAttemptRoutes);
app.use("/api/user-responses", userResponseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/validator", validatorRoutes);
app.use("/api/stats", statsRoutes);

app.get("/{*any}", (_request, response) => {
  response.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
