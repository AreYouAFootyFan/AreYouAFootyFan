import { QuizModel } from "../models/quiz.model";
import { QuestionModel } from "../models/question.model";
import { AnswerModel } from "../models/answer.model";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

export interface QuestionValidationResult {
  question_id: number;
  question_text: string;
  difficulty_id: number;
  difficulty_level: string;
  is_valid: boolean;
  answer_count: number;
  correct_answer_count: number;
  validation_messages: string[];
}

export interface QuizValidationResult {
  quiz_id: number;
  quiz_title: string;
  total_questions: number;
  valid_questions: number;
  is_valid: boolean;
  validation_message: string;
  questions: QuestionValidationResult[];
}

export class QuizValidatorService {
  static async validateQuiz(quizId: number): Promise<QuizValidationResult> {
    const quiz = await QuizModel.findById(quizId);

    if (!quiz) {
      throw ErrorUtils.notFound(Message.Error.Quiz.NOT_FOUND);
    }

    const questions = await QuestionModel.findByQuizId(quizId);

    const questionValidations: QuestionValidationResult[] = [];

    for (const question of questions) {
      const validation = await this.validateQuestion(question.question_id);
      questionValidations.push(validation);
    }

    const validQuestions = questionValidations.filter((q) => q.is_valid).length;

    const isValid = validQuestions >= 5;

    return {
      quiz_id: quizId,
      quiz_title: quiz.quiz_title,
      total_questions: questions.length,
      valid_questions: validQuestions,
      is_valid: isValid,
      validation_message: isValid
        ? "Quiz is valid and ready to play"
        : `Quiz needs at least 5 valid questions (currently has ${validQuestions})`,
      questions: questionValidations,
    };
  }

  static async validateQuestion(
    questionId: number
  ): Promise<QuestionValidationResult> {
    const question = await QuestionModel.findByIdWithDifficulty(questionId);

    if (!question) {
      throw ErrorUtils.notFound(Message.Error.Question.NOT_FOUND);
    }

    const answers = await AnswerModel.findByQuestionId(questionId);

    const correctAnswers = answers.filter((a) => a.is_correct);

    const validationMessages: string[] = [];

    if (answers.length < 4) {
      validationMessages.push(
        `Question needs ${4 - answers.length} more answer(s)`
      );
    } else if (answers.length > 4) {
      validationMessages.push(
        `Question has ${answers.length - 4} too many answers`
      );
    }

    if (correctAnswers.length === 0) {
      validationMessages.push("Question needs 1 correct answer");
    } else if (correctAnswers.length > 1) {
      validationMessages.push(
        `Question has ${correctAnswers.length - 1} too many correct answers`
      );
    }

    const isValid = answers.length === 4 && correctAnswers.length === 1;

    if (isValid) {
      validationMessages.push("Question is valid");
    }

    return {
      question_id: questionId,
      question_text: question.question_text,
      difficulty_id: question.difficulty_id,
      difficulty_level: question.difficulty_level,
      is_valid: isValid,
      answer_count: answers.length,
      correct_answer_count: correctAnswers.length,
      validation_messages: validationMessages,
    };
  }
}
