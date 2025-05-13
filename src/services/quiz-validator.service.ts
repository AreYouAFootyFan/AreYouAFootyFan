import { QuizModel } from "../models/quiz.model";
import { QuestionModel } from "../models/question.model";
import { AnswerModel } from "../models/answer.model";
import { ErrorUtils } from "../utils/error.utils";
import { Config, Message } from "../utils/enums";
import { 
  QuestionValidation 
} from "../types/question.types";

export interface QuizValidationResult {
  quiz_id: number;
  quiz_title: string;
  total_questions: number;
  valid_questions: number;
  is_valid: boolean;
  validation_message: string;
  questions: QuestionValidation[];
}

export class QuizValidatorService {
  
  static async validateQuiz(quizId: number): Promise<QuizValidationResult> {
    const quiz = await QuizModel.findById(quizId);

    if (!quiz) {
      throw ErrorUtils.notFound(Message.Error.Quiz.NOT_FOUND);
    }

    const questions = await QuestionModel.findByQuizId(quizId);

    const questionValidations: QuestionValidation[] = [];

    for (const question of questions) {
      const validation = await this.validateQuestion(question.question_id);
      questionValidations.push(validation);
    }

    const validQuestions = questionValidations.filter((question) => question.is_valid).length;

    const isValid = validQuestions >= Config.Value.MIN_QUESTIONS_PER_QUIZ;

    return {
      quiz_id: quizId,
      quiz_title: quiz.quiz_title,
      total_questions: questions.length,
      valid_questions: validQuestions,
      is_valid: isValid,
      validation_message: isValid
        ? "Quiz is valid and ready to play"
        : `Quiz needs at least ${Config.Value.MIN_QUESTIONS_PER_QUIZ} valid questions (currently has ${validQuestions})`,
      questions: questionValidations,
    };
  }

  static async validateQuestion(
    questionId: number
  ): Promise<QuestionValidation> {
    const question = await QuestionModel.findByIdWithDifficulty(questionId);

    if (!question) {
      throw ErrorUtils.notFound(Message.Error.Question.NOT_FOUND);
    }

    const answers = await AnswerModel.findByQuestionId(questionId);

    const correctAnswers = answers.filter((answer) => answer.is_correct);

    const validationMessages: string[] = [];

    if (answers.length <  Config.Value.DEFAULT_ANSWERS_PER_QUESTION) {
      validationMessages.push(
        `Question needs ${ Config.Value.DEFAULT_ANSWERS_PER_QUESTION - answers.length} more answer(s)`
      );
    } else if (answers.length > Config.Value.DEFAULT_ANSWERS_PER_QUESTION) {
      validationMessages.push(
        `Question has ${answers.length -  Config.Value.DEFAULT_ANSWERS_PER_QUESTION} too many answers`
      );
    }

    if (correctAnswers.length === 0) {
      validationMessages.push("Question needs 1 correct answer");
    } else if (correctAnswers.length > 1) {
      validationMessages.push(
        `Question has ${correctAnswers.length - 1} too many correct answers`
      );
    }

    const isValid = answers.length ===  Config.Value.DEFAULT_ANSWERS_PER_QUESTION && correctAnswers.length === 1;

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