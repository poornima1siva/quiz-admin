import { ObjectId } from "mongodb";


export interface Questions{
  quizId : ObjectId ;
  questionType: 'single' | 'multiple' | 'paragraph';
  questionText: string;
  options?: string[]; // for single/multiple choice
  correctAnswer?: string ; 
  correctAnswers?:string[];
  paragraphAnswer?: string; // only for paragraph type
}