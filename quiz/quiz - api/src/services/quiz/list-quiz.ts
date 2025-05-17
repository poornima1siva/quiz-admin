
import { connectToDatabase } from '../../shared/database';

export async function quizList() {
    const db = await connectToDatabase();
    try{
        const quizs = await db.collection('quizes').find().toArray();
        return quizs;
    }catch(error){
        console.error('Error Fetching Error', error);
        throw new Error('Failed to fetch quizs');
    }
}