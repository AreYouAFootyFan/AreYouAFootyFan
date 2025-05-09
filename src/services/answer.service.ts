import { AnswerModel, Answer } from "../models/answer.model";
import { CreateAnswerDto, UpdateAnswerDto } from "../DTOs/answer.dto";
import { QuestionModel } from "../models/question.model";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

export class AnswerService {
  static async getAnswersByQuestionId(questionId: number): Promise<Answer[]> {
    const question = await QuestionModel.findById(questionId);

    if (!question) {
      throw ErrorUtils.notFound(Message.Error.QuestionError.NOT_FOUND);
    }

    return AnswerModel.findByQuestionId(questionId);
  }

  static async getAnswerById(id: number): Promise<Answer> {
    const answer = await AnswerModel.findById(id);

    if (!answer) {
      throw ErrorUtils.notFound(Message.Error.AnswerError.NOT_FOUND);
    }

    return answer;
  }

  static async createAnswer(data: CreateAnswerDto): Promise<Answer> {
    const question = await QuestionModel.findById(data.question_id);

    if (!question) {
      throw ErrorUtils.badRequest(Message.Error.QuestionError.INVALID_ID);
    }

    const answerCount = await QuestionModel.countAnswers(data.question_id);

    if (answerCount >= 4) {
      throw ErrorUtils.badRequest(
        Message.Error.AnswerError.MAX_ANSWERS_REACHED
      );
    }

    if (data.is_correct) {
      const answer = await AnswerModel.create({
        ...data,
        is_correct: false, // Temporarily set to false
      });

      await AnswerModel.markAsCorrect(answer.answer_id, data.question_id);

      return AnswerModel.findById(answer.answer_id) as Promise<Answer>;
    }

    return AnswerModel.create(data);
  }

  static async updateAnswer(
    id: number,
    data: UpdateAnswerDto
  ): Promise<Answer> {
    const existingAnswer = await AnswerModel.findById(id);

    if (!existingAnswer) {
      throw ErrorUtils.notFound(Message.Error.AnswerError.NOT_FOUND);
    }

    if (data.is_correct === true) {
      await AnswerModel.markAsCorrect(id, existingAnswer.question_id);

      return AnswerModel.findById(id) as Promise<Answer>;
    }

    if (data.is_correct === false && existingAnswer.is_correct) {
      const correctAnswerCount = await QuestionModel.countCorrectAnswers(
        existingAnswer.question_id
      );

      if (correctAnswerCount === 1) {
        throw ErrorUtils.badRequest(
          Message.Error.AnswerError.CANNOT_REMOVE_ONLY_CORRECT
        );
      }
    }

    const updatedAnswer = await AnswerModel.update(id, data);

    if (!updatedAnswer) {
      throw ErrorUtils.internal(Message.Error.AnswerError.UPDATE_FAILED);
    }

    return updatedAnswer;
  }

  static async deleteAnswer(id: number): Promise<void> {
    const existingAnswer = await AnswerModel.findById(id);

    if (!existingAnswer) {
      throw ErrorUtils.notFound(Message.Error.AnswerError.NOT_FOUND);
    }

    if (existingAnswer.is_correct) {
      const correctAnswerCount = await QuestionModel.countCorrectAnswers(
        existingAnswer.question_id
      );

      if (correctAnswerCount === 1) {
        throw ErrorUtils.badRequest(
          Message.Error.AnswerError.CANNOT_DELETE_ONLY_CORRECT
        );
      }
    }

    const deleted = await AnswerModel.delete(id);

    if (!deleted) {
      throw ErrorUtils.internal(Message.Error.AnswerError.DELETE_FAILED);
    }
  }

  static async markAsCorrect(answerId: number): Promise<Answer> {
    const existingAnswer = await AnswerModel.findById(answerId);

    if (!existingAnswer) {
      throw ErrorUtils.notFound(Message.Error.AnswerError.NOT_FOUND);
    }

    await AnswerModel.markAsCorrect(answerId, existingAnswer.question_id);

    return AnswerModel.findById(answerId) as Promise<Answer>;
  }
}
