import { UserResponseModel } from '../models/user-response.model';
import { QuizAttemptModel } from '../models/quiz-attempt.model';
import { QuestionModel } from '../models/question.model';
import { AnswerModel } from '../models/answer.model';
import { ErrorUtils } from '../utils/error.utils';
import { CreateUserResponseDto } from '../DTOs/user-response.dto';

export class UserResponseService {
  
  static async getAttemptResponses(attemptId: number): Promise<any[]> {
    const attempt = await QuizAttemptModel.findById(attemptId);
    
    if (!attempt) {
      throw ErrorUtils.notFound('Quiz attempt not found');
    }
    
    const responses = await UserResponseModel.findByAttemptId(attemptId);
    
    const detailedResponses = await Promise.all(
      responses.map(async response => {
        const details = await UserResponseModel.getResponseDetails(response.response_id);
        return details;
      })
    );
    
    return detailedResponses;
  }

  
  static async submitResponse(data: CreateUserResponseDto, userRole: string): Promise<any> {
    const attempt = await QuizAttemptModel.findById(data.attempt_id);
    
    if (userRole !== "Quiz Taker") {
      throw ErrorUtils.forbidden('Only Quiz Takers can submit responses');
    }

    if (!attempt) {
      throw ErrorUtils.notFound('Quiz attempt not found');
    }
    
    if (attempt.end_time) {
      throw ErrorUtils.badRequest('Quiz attempt is already completed');
    }
    
    const question = await QuestionModel.findById(data.question_id);
    
    if (!question) {
      throw ErrorUtils.notFound('Question not found');
    }
    
    if (question.quiz_id !== attempt.quiz_id) {
      throw ErrorUtils.badRequest('Question does not belong to the current quiz');
    }
    
    const answer = await AnswerModel.findById(data.answer_id);
    
    if (!answer) {
      throw ErrorUtils.notFound('Answer not found');
    }
    
    if (answer.question_id !== data.question_id) {
      throw ErrorUtils.badRequest('Answer does not belong to the question');
    }
    
    const existingResponse = await UserResponseModel.findByQuestionAndAttempt(
      data.question_id, 
      data.attempt_id
    );

    
    if (existingResponse) {
      const updatedResponse = await UserResponseModel.update(
        existingResponse.response_id, 
        { answer_id: data.answer_id }
      );

      if (!updatedResponse) {
        throw ErrorUtils.internal('Failed to update response');
      }
      
      const responseDetails = await UserResponseModel.getResponseDetails(updatedResponse.response_id);
      
      const shouldAutoComplete = await QuizAttemptService.checkAutoComplete(data.attempt_id);
      
      return {
        ...responseDetails,
        quiz_completed: shouldAutoComplete
      };
    }
    
    const response = await UserResponseModel.create(data);
    const responseDetails = await UserResponseModel.getResponseDetails(response.response_id);
    
    const shouldAutoComplete = await QuizAttemptService.checkAutoComplete(data.attempt_id);
    
    return {
      ...responseDetails,
      quiz_completed: shouldAutoComplete
    };
  }

  
  static async getResponseById(responseId: number): Promise<any> {
    const response = await UserResponseModel.getResponseDetails(responseId);
    
    if (!response) {
      throw ErrorUtils.notFound('Response not found');
    }
    
    return response;
  }
}


import { QuizAttemptService } from './quiz-attempt.service';