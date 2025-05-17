import { z } from 'zod';
import { connectToDatabase } from '../../shared/database';
import { Questions } from './questions-type';
import { Db, ObjectId } from 'mongodb';
import { Createquiz } from '../quiz/create-quiz';

// ✅ Zod validation schema for Questions
const questionsSchema = z.object({
  quizId: z.instanceof(ObjectId, { message: 'QuizId must be an ObjectId' }),
  questionType: z.enum(['single', 'multiple', 'paragraph']),
  questionText: z.string().min(1, { message: 'Question text is required' }),
  options: z.array(z.string().min(1)).optional(),
  correctAnswer: z.string().min(1).optional(),
  correctAnswers: z.array(z.string().min(1)).optional(),
  paragraphAnswer: z.string().optional()
}).refine((data) => {
  if ((data.questionType === 'single' || data.questionType === 'multiple') && (!data.options || data.options.length < 2)) {
    return false;
  }

  if (data.questionType === 'single') {
    if (!data.correctAnswer || typeof data.correctAnswer !== 'string') {
      return false;
    }
  }

  if (data.questionType === 'multiple') {
    if (!data.correctAnswers || data.correctAnswers.length < 2) {
      return false;
    }
  }

  if (data.questionType === 'paragraph') {
    if (!data.paragraphAnswer || data.paragraphAnswer.trim() === '') {
      return false;
    }
  }

  return true;
}, {
  message: 'Invalid data for the selected question type'
});


// ✅ Function to validate question input
export const validateQuestionInput = (data: Questions) => {
  try {
    questionsSchema.parse(data);
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error('Validation errors:', e.errors);
      throw new Error(JSON.stringify(e.errors));
    } else {
      console.error('Unknown error', e);
      throw new Error(JSON.stringify(e));
    }
  }
};


// ✅ Main function to insert question into MongoDB
export async function Createquestions(data: Questions) {
  const db = await connectToDatabase();

  const newData = {
    ...data,
    quizId: new ObjectId(data.quizId), // ensure ObjectId
  };

  const questions = await db.collection('questions').insertOne(newData);
  return questions;
}
