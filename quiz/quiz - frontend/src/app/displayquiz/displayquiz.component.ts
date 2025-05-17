import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { PencilIcon, PlusIcon, TrashIcon, UndoIcon, UploadIcon } from 'primeng/icons';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Header } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IftaLabel } from 'primeng/iftalabel';
@Component({
  selector: 'app-displayquiz',
  standalone: true,
  imports: [TableModule,ButtonModule,HttpClientModule,CardModule,TrashIcon,PencilIcon,ReactiveFormsModule,DialogModule,DropdownModule],
  templateUrl: './displayquiz.component.html',
  styleUrl: './displayquiz.component.scss'
})
export class DisplayquizComponent {
  quizzes: any[] = [];
  isLoading: boolean = true;
  quizId: string = '';
  questions: any[] = [];
editDialog: boolean = false;
editIndex: number = -1;


editQuizForm = new FormGroup({
  name: new FormControl('', [Validators.required]),
  description: new FormControl('', [Validators.required]),
  categoryslug: new FormControl('', [Validators.required]),
  duration: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
  totalmark: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
  totalquestion: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
  status: new FormControl('', [Validators.required]),
  level: new FormControl('', [Validators.required])
});

categories = [
  { label: 'Math', value: 'math' },
  { label: 'Science', value: 'science' },
  { label: 'History', value: 'history' },
  { label: 'Ai - ML', value: 'Ai - ML' },
  {label : 'Angular' , value : 'Angular'}
];

statuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' }
];

levels = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' }
];


  constructor(private http: HttpClient, private router: Router, private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/quiz').subscribe({
      next: (data) => {
        this.quizzes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch quizzes:', err);
        this.isLoading = false;
      }
    });
    console.log("quiz id  :", this.quizId)
  }

  deleteQuiz(id: string) {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.http.delete(`http://localhost:3000/quiz/${id}`).subscribe({
        next: () => {
          this.quizzes = this.quizzes.filter(q => q._id !== id);
        },
        error: (err) => {
          console.error('Error deleting quiz:', err);
        }
      });
    }
  }

  alterQuiz(uuid: string) {
    this.router.navigate(['/alterquiz', uuid]);
  }

 

  editQuiz(id: string): void {
    const quiz = this.quizzes.find(q => q._id === id);
    if (!quiz) {
      console.error("Quiz not found with id", id);
      return;
    }
  
    this.editIndex = this.quizzes.indexOf(quiz);
  
    this.editQuizForm.setValue({
      name: quiz.name,
      description: quiz.description,
      categoryslug: quiz.categoryslug,
      duration: quiz.duration,
      totalmark: quiz.totalmark,
      totalquestion: quiz.totalquestion,
      status: quiz.status,
      level: quiz.level
    });
  
    this.editDialog = true;
  }
  
  
  saveChanges(): void {
    if (this.editQuizForm.valid) {
      this.quizzes[this.editIndex] = this.editQuizForm.value;
      localStorage.setItem('quizData', JSON.stringify(this.quizzes));
      this.editDialog = false;
      alert('Quiz updated successfully!');
    } else {
      alert('Please fill out all fields correctly.');
    }
  }
  
  cancelEdit(): void {
    this.editDialog = false; // Close dialog without saving
  }
  
showQuestion()
{
  this.quizId = this.route.snapshot.paramMap.get('quizId') || '';

  this.http.get<any[]>(`http://localhost:3000/questions/questions?quizId=${this.quizId}`).subscribe({
    next: (data) => {
      this.questions = data;
      console.log('Fetched Questions:', this.questions);
    },
    error: (err) => {
      console.error('Failed to fetch questions:', err);
      alert('Failed to fetch questions');
    }
  });
}

}









    



