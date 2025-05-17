
import { connectToDatabase } from '../../shared/database';



export async function questionList(quizId: string) {
  const db = await connectToDatabase();
  try {
    const questions = await db.collection('questions').aggregate([
      {
        $addFields: {
          quizIdString: { $toString: "$quizId" }
        }
      },
      {
        $match: {
          quizIdString: quizId
        }
      }
    ]).toArray();

    return questions;
  } catch (error) {
    console.error('Error Fetching Questions:', error);
    throw new Error('Failed to fetch questions');
  }
}
