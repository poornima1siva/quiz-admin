import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { Editor, EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { PencilIcon, PlusIcon, TrashIcon, UndoIcon, UploadIcon } from 'primeng/icons';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alterquiz',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    ButtonModule,
    IftaLabel,
    CardModule,
    DropdownModule,
    InputText,PlusIcon,EditorModule,CommonModule,PencilIcon,TrashIcon,SplitterModule,PaginatorModule
    
  ],
  templateUrl: './alterquiz.component.html',
  styleUrls: ['./alterquiz.component.scss']
})
export class AlterquizComponent implements OnInit {

  alterQuizForm: FormGroup;
  quizId: string = '';
  currentPage: number = 0;
rowsPerPage: number = 5;
paginatedQuestions: any[] = [];

  fetchedQuestions: any[] = [];
  questionId: string = '';

  categories = [
    { label: 'Math', value: 'math' },
    { label: 'Science', value: 'science' },
    { label: 'History', value: 'history' },
    { label: 'Ai - ML', value: 'Ai - ML' },
    { label: 'Angular', value: 'Angular' }
  ];

  levels = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' }
  ];

  statuses = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' }
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) {
    this.alterQuizForm = new FormGroup({
      
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      categoryslug: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      totalmark: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      totalquestion: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      status: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required])
    });
  }
  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    this.questionId = this.route.snapshot.paramMap.get('questionId') || '';
console.log("questionid : ",this.questionId)
console.log("quiz id : ",this.quizId)
    if (this.quizId) {
      this.http.get<any>(`http://localhost:3000/quiz/${this.quizId}`).subscribe({
        next: (quiz) => {
          console.log('Fetched quiz:', quiz); // Add this line temporarily to see the quiz data
         
          
          this.alterQuizForm.patchValue({
           
            name: quiz.name,
            description: quiz.description,
            categoryslug: quiz.categoryslug,
            duration: quiz.duration,
            totalmark: quiz.totalmark,
            totalquestion: quiz.totalquestion,
            status : quiz.status,
            level : quiz.level
          });
        },
        error: (err) => {
          console.error('Error fetching quiz:', err);
        }
      });
    }

    this.fetchQuestionsForQuiz(this.quizId)
    this.updatePaginatedQuestions();
  }
  
  fetchQuestionsForQuiz(quizId: string): void {
    if (!quizId) return;
    this.http.get<any[]>(`http://localhost:3000/question/${quizId}`).subscribe({
      next: (questions) => {
        this.fetchedQuestions = questions;
        this.updatePaginatedQuestions(); // <== Add this line
      },
      error: (err) => {
        console.error('Error fetching questions:', err);
        this.fetchedQuestions = [];
        this.paginatedQuestions = [];
      }
    });
    
  }
  onUpdate() {
    if (this.alterQuizForm.valid) {
      const updatedData = {
        ...this.alterQuizForm.value,
        id: this.quizId  
      };
  
      
      this.http.put(`http://localhost:3000/quiz/${this.quizId}`, updatedData).subscribe({
        next: () => {
          alert('Quiz updated successfully!');
          this.router.navigate(['/displayquiz']);
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update quiz.');
        }
      });
    } else {
      alert('Please fill out all fields correctly.');
    }
  }
  
  addQuestion(quizId: string) {
    this.router.navigate(['/addquestion', quizId]);

  }

  editQuestion(questionId: any): void {
    console.log("Selected Question ID:", questionId);
    this.router.navigate(['/alterquestion', questionId]);
  }
  
  
  deleteQuestion(questionId: string) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.http.delete(`http://localhost:3000/question/${questionId}`).subscribe({
        next: () => {
          this.fetchedQuestions = this.fetchedQuestions.filter(q => q._id !== questionId);
          this.fetchQuestionsForQuiz(this.quizId)
          
        },
        error: (err) => {
          console.error('Error deleting question:', err);
        }
      });
    }
  }
  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.updatePaginatedQuestions();
  }
  
  updatePaginatedQuestions() {
    const start = this.currentPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedQuestions = this.fetchedQuestions.slice(start, end);
  }

isLongOption(options: string[]): boolean {
  return options.some(opt => this.isTextLong(opt));
}

isTextLong(opt: string): boolean {
  return opt?.length > 100; // You can change 100 to any character limit you like
}



  }
  
  
  
  
