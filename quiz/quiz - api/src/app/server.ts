import express, { json } from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectToDatabase } from '../shared/database';
import { Createquiz } from '../services/quiz/create-quiz';
import { quizList } from '../services/quiz/list-quiz';
import { deletequiz } from '../services/quiz/delete-quiz';
import { updatequiz } from '../services/quiz/update-quiz';
import { Createquestions } from '../services/question/create-questions';
import { Questions } from '../services/question/questions-type';
import { questionList } from '../services/question/list-questions';
import { updatequestion } from '../services/question/update-questions';
import { deletequestion } from '../services/question/delete-questions';
import { ObjectId } from 'mongodb';
import { validateQuestionInput } from '../services/question/create-questions';


const app = express();
app.use(cors());
app.use(json({ limit: '10mb' }));
app.use(express.json());

// Middleware for handling JSON parsing errors
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err });
});

const port: number = 3000;

// Function to start the server
const startServer = async () => {
  try {
    await connectToDatabase();
    console.log('✅ Database connected successfully.');

    app.get('/', (req: Request, res: Response) => {
      res.send('Hello, TypeScript + Node.js + Express!');
    });

    // ✅ Routes for quiz
    app.post('/quiz', async (req: Request, res: Response): Promise<void> => {
      try {
        const { name, description, categoryslug, duration, totalmark, totalquestion, status, level } = req.body;

        if (!name || !description || !categoryslug || !duration || !totalmark || !totalquestion || !status || !level) {
          res.status(400).json({ message: 'Title, Image, and Description are required' });
          return;
        }

        let result = await Createquiz(req.body);
        res.status(201).json(result);
      } catch (error) {
        console.error('Error creating quiz:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Failed to create quiz' });
        }
      }
    });

    app.get('/quiz', async (req: Request, res: Response) => {
      try {
        let result = await quizList();
        res.json(result);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Failed to fetch quiz' });
      }
    });

    app.get('/quiz/:id', async (req: Request, res: Response): Promise<void> => {
      try {
        const quizId = req.params.id;
        const collection = (await connectToDatabase()).collection('quizes'); // connectDB() should connect to your MongoDB
    
        const foundQuiz = await collection.findOne({ _id: new ObjectId(quizId) });
    
        if (!foundQuiz) {
          res.status(404).json({ message: 'Quiz not found' });
          return;
        }
    
        res.json(foundQuiz);
      } catch (error) {
        console.error('Error fetching quiz by ID:', error);
        res.status(500).json({ message: 'Failed to fetch quiz by ID' });
      }
    });
    
    

    app.delete('/quiz/:id', async (req: Request, res: Response) => {
      try {
        const quizId = req.params.id;
        if (!quizId) {
          res.status(400).json({ message: 'quiz ID is required in URL' });
          return;
        }

        console.log("Deleting quiz with ID:", quizId);
        let result = await deletequiz(String(quizId));

        if (result.success) {
          res.json({ message: 'quiz deleted successfully' });
        } else {
          res.status(404).json({ message: 'quiz not found' });
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Failed to delete quiz' });
      }
    });


    app.put('/quiz/:id', async (req: Request, res: Response): Promise<void> => {
      try {
        const { _id, ...updateData } = req.body;
        const result = await updatequiz(req.params.id, updateData);
    
        if (!result.success) {
          console.log("inside the put function...");
          res.status(400).json(result);
        }
    
        console.log('✅ Edited Value:', updateData);
        res.json(result);
      } catch (error) {
        console.error('❌ Error updating quiz:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the quiz.' });
      }
    });
    


     // ✅ Routes for question
   

     app.post('/question', async (req: Request, res: Response): Promise<void> => {
      try {
        const { quizId, questionType, questionText, options, correctAnswer,correctAnswers, paragraphAnswer } = req.body;
    
        if (!quizId || !questionType || !questionText) {
          res.status(400).json({ message: 'Quiz id, questionType, questionText are required' });
          return;
        }
    
       

const questionData = {
  quizId: new ObjectId(quizId),
  questionType,
  questionText,
  options,
  correctAnswer,
  correctAnswers,
  paragraphAnswer
};


        const db = await connectToDatabase(); // make sure this is implemented to connect to your MongoDB

        const quiz = await db.collection('quizes').findOne({ _id: new ObjectId(quizId) });
    
        if (!quiz) {
          res.status(404).json({ message: 'Quiz not found' });
          return;
        }
    
        const totalAllowedQuestions = quiz.totalquestion;  // Assuming this is the total number allowed for this quiz
    
        // 2. Check how many questions already exist for this quiz
        const existingQuestionsCount = await db.collection('questions').countDocuments({ quizId: new ObjectId(quizId) });
    
        if (existingQuestionsCount >= totalAllowedQuestions) {
          res.status(400).json({ message: `Maximum ${totalAllowedQuestions} questions allowed for this quiz.` });
          
          return;
        }
    
    
        // Validate
        validateQuestionInput(questionData);
    
        const result = await Createquestions(questionData);
        res.status(201).json(result);
      } catch (error) {
        console.error('Error creating question:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Failed to create question' });
        }
      }
    });
    

    app.get('/question/:id', async (req: Request, res: Response): Promise<void> => {
      try {
        const questionId = req.params.id;
        
    
        if (!questionId) {
          res.status(400).json({ message: 'quizId is required' });
          return;
          
        }
    
        const questions = await questionList(questionId);
        console.log("questions:", questions);
    
        res.json(questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Failed to fetch questions' });
      }
    });
    
    app.get('/alterQuestion/:questionId', async (req: Request, res: Response): Promise<void> => {
      try {
        const questionId = req.params.questionId;
    
        const collection = (await connectToDatabase()).collection('questions');
    
        const foundquestion = await collection.findOne({ _id: new ObjectId(questionId) });
    
        if (!foundquestion) {
          res.status(404).json({ message: 'question not found' });
          return;
        }
    
        res.json(foundquestion);
      } catch (error) {
        console.error('Error fetching question by ID:', error);
        res.status(500).json({ message: 'Failed to fetch question by ID' });
      }
    });
    
    

app.delete('/question/:id', async (req, res) => {
  const questionId = req.params.id;
  console.log('Received question ID to delete:', questionId);  // Log the received ID
  if (!questionId) {
    res.status(400).json({ message: 'question ID is required in URL' });
    return;
  }

  let result = await deletequestion(String(questionId));
  if (result.success) {
    res.json({ message: 'Question deleted successfully' });
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
});


    app.put('/question/:id', async (req: Request, res: Response): Promise<void> => {
      try {
        const { _id, ...updateData } = req.body;
        const result = await updatequestion(req.params.id, updateData);

        if (!result.success) {
          console.log("inside the put function...");
          res.status(400).json(result);
        }

        console.log('✅ Edited Value:', updateData);
        res.json(result);
      } catch (error) {
        console.error('❌ Error updating question:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the question.' });
      }
    });

    // ✅ Start the server
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
};

// ✅ Start the server
startServer();
