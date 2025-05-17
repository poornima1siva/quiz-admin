
import { Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder,FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators, RequiredValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Card, CardModule } from 'primeng/card';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { IftaLabel, IftaLabelModule } from 'primeng/iftalabel';
import { PanelModule } from 'primeng/panel';
import { EditorModule } from 'primeng/editor';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { Button } from 'primeng/button';
import { routes } from '../app.routes';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClient, HttpClientModule,HttpHeaders } from '@angular/common/http';
import { EyeIcon, PlusIcon, SearchIcon, TrashIcon } from 'primeng/icons';

@Component({
  selector: 'app-addquestion',
  standalone: true,
  imports: [ReactiveFormsModule,EditorModule,PanelModule,CheckboxModule,CardModule,DropdownModule,InputTextModule,Button,
    RadioButtonModule,FieldsetModule,IftaLabelModule,MultiSelectModule,HttpClientModule,TrashIcon,PlusIcon],
  templateUrl: './addquestion.component.html',
  styleUrl: './addquestion.component.scss'
})
export class AddquestionComponent implements OnInit {
 
  quizId = signal<string>('');

  selectedType = signal('single');
  
  questionForm!: FormGroup;  // Reactive form still used for ease with validations
  questionTypes = [
    { label: 'Choose the best (Single Answer)', value: 'single' },
    { label: 'Choose the best (Multiple Answers)', value: 'multiple' },
    { label: 'Paragraph Answer', value: 'paragraph' }
  ];

   // Array to store the fetched questions
   questions: any[] = [];

   
  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute, 
    public router: Router
  ) {}

 ngOnInit(): void {
  
  this.quizId.set(this.route.snapshot.params['id']);
  this.initForm();
  console.log('Quiz ID:', this.quizId()); // ✅

  const id = this.quizId();
  
 // Fetch the quiz details
 this.http.get<any>(`http://localhost:3000/quiz/${id}`).subscribe({
  next: (quiz) => {
    
   
 
  },
  error: (err) => {
    console.error('Error fetching quiz:', err);
  }
});

this.questionForm.get('questionType')?.valueChanges.subscribe((type: string) => {
  this.selectedType.set(type);
  this.resetOptions();
});


}



  
  initForm(): void {
    this.questionForm = new FormGroup({
      quizId: new FormControl(this.quizId(), Validators.required), // Ensure the correct signal is used
      questionType: new FormControl(this.selectedType(), Validators.required),
      questionText: new FormControl('', Validators.required),
      options: new FormArray([]),
      correctAnswer: new FormControl(''),
      correctAnswers: new FormControl([]),
      paragraphAnswer: new FormControl('')
    });
  }

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption(): void {
    this.optionsArray.push(new FormControl('', Validators.required));
  }

  removeOption(index: number): void {
    this.optionsArray.removeAt(index);
  }

  onCheckboxChange(event: any, index: number) {
    const isChecked = event.checked;
    const options = this.questionForm.get('options') as FormArray;
  
    if (isChecked) {
      options.push(new FormControl(index));
    } else {
      const i = options.controls.findIndex(x => x.value === index);
      if (i !== -1) {
        options.removeAt(i);
      }
    }
  }
  
  


  resetOptions(): void {
    this.optionsArray.clear();
    this.questionForm.get('correctAnswer')?.setValue([]);
    this.questionForm.get('correctAnswers')?.setValue([]);
  }

  submitQuestion(): void {
    const type = this.questionForm.get('questionType')?.value;
    console.log('Submitting question for Quiz ID:', this.quizId());

  
    if ((type === 'single' ) &&
        (this.optionsArray.length === 0 || this.questionForm.get('correctAnswer')?.value.length === 0)) {
      alert('Please add options and select at least one correct answer.');
      return;
    }
    if (( type === 'multiple') &&
        (this.optionsArray.length === 0 || this.questionForm.get('correctAnswers')?.value.length === 0)) {
      alert('Please add options and select at least one correct answer.');
      return;
    }
  
    if (type === 'paragraph' && !this.questionForm.get('paragraphAnswer')?.value) {
      alert('Please enter the paragraph answer.');
      return;
    }
  
    // ✅ Ensure correctAnswer is always an array
    const rawData = this.questionForm.value;
    let finalCorrectAnswer: string | undefined;
let finalCorrectAnswers: string[] | undefined;

if (type === 'single') {
  finalCorrectAnswer = rawData.correctAnswer;  // ✅ keep as string
} else if (type === 'multiple') {
  finalCorrectAnswers = rawData.correctAnswers;  // ✅ keep as array
}
  
const formData = {
  quizId: rawData.quizId,
  questionType: rawData.questionType,
  questionText: rawData.questionText,
  options: rawData.options,
  correctAnswer: finalCorrectAnswer,
  correctAnswers: finalCorrectAnswers,
  paragraphAnswer: rawData.paragraphAnswer
};

    this.http.post('http://localhost:3000/question', formData).subscribe({
      next: (res: any) => {
        alert('Question added successfully!');
        this.questionForm.reset();
        this.resetOptions();
        this.router.navigate(['/alterquiz' , this.quizId()]);
        
      },
      error: (err: any) => {
        console.error('Error saving question:', err);
      
        if (err.status === 400 && err.error.message?.includes('Maximum')) {
          alert(err.error.message); // Show message like: "Maximum 5 questions allowed for this quiz."
        } else {
          alert('Failed to save question.');
        }
      }
      
    });
  
}
}