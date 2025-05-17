import { z } from 'zod';
import { connectToDatabase } from '../../shared/database';
import { Quiz } from './quiz-type';
import{Db} from 'mongodb';
const quizSchema = z.object({
  id: z.string().min(1, { message: 'id is required' }),
  
  name: z.string().min(1, { message: 'name is required' }),
  description: z.string().min(1, { message: 'description is required' }),
  categoryslug: z.string().min(1, { message: 'categoryslug is required' }),
  duration: z.string().min(1, { message: 'duration is required' }),
  totalmark: z.string().min(1, { message: 'totalmark is required' }),
  totalquestion: z.string().min(1, { message: 'totalquestion is required' }),
  status: z.string().min(1, { message: 'status is required' }),
  level: z.string().min(1, { message: 'level is required' }),
});

export async function Createquiz(data:Quiz) {
    const db = await connectToDatabase();
    const quiz = await db.collection('quizes').insertOne(data); // Update database and collection names 
    return quiz;
}

const validateQuizInput = (data: Quiz) => {
    try {
      quizSchema.parse(data);
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.error('Validation errors:', e.errors);
        throw new Error(JSON.stringify(e.errors))
      } else {
        console.error('Unknown error', e);
        throw new Error(JSON.stringify(e))
      }
    }
};