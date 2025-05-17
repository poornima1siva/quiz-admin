import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { Editor } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';




@Component({
  selector: 'app-addquiz',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule,ButtonModule,IftaLabel,CardModule,DropdownModule,InputText,Editor,InputNumberModule],
  templateUrl: './addquiz.component.html',
  styleUrls: ['./addquiz.component.scss']
})
export class AddquizComponent {

  addQuizForm: FormGroup;

  categories = [
    { label: 'Math', value: 'math' },
    { label: 'Science', value: 'science' },
    { label: 'History', value: 'history' },
    { label: 'Ai - ML', value: 'Ai - ML' },
    {label : 'Angular' , value : 'Angular'}
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

  constructor(private router: Router, private http: HttpClient) {
    this.addQuizForm = new FormGroup({
     
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

  onSubmit() {
    if (this.addQuizForm.valid) {
     
  
      const formData = this.addQuizForm.value;
  
      this.http.post('http://localhost:3000/quiz', formData).subscribe({
        next: (res: any) => {
         
          this.router.navigate(['/displayquiz']);
        },
        error: (err) => {
          console.error('Error adding quiz:', err);
          alert('Something went wrong while adding the quiz.');
        }
      });
    } else {
      alert('Please fill out all fields correctly.');
    }
  }
  
}
