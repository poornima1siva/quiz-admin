import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-deletequiz',
  imports: [CardModule, ButtonModule,HttpClientModule,TableModule],
  templateUrl: './deletequiz.component.html',
  styleUrl: './deletequiz.component.css'
})
export class DeletequizComponent {
  quizzes: any[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchQuizzes();
  }

  fetchQuizzes(): void {
    this.isLoading = true;
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
  }

  deleteQuiz(id: string): void {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.http.delete(`http://localhost:3000/quiz/${id}`).subscribe({
        next: () => {
          alert('Quiz deleted successfully!');
          this.fetchQuizzes(); // Refresh the list
        },
        error: (err) => {
          console.error('Error deleting quiz:', err);
        }
      });
    }
  }
}
