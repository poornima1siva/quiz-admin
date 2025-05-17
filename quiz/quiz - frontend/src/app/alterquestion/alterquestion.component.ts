import { Component, OnInit, signal} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Button, ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { PlusIcon, TrashIcon } from 'primeng/icons';
import { Card } from 'primeng/card';
import { IftaLabel, IftaLabelModule } from 'primeng/iftalabel';
@Component({
  selector: 'app-alterquestion',
  imports: [ CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    EditorModule,
    CheckboxModule,
    DropdownModule,
    RadioButtonModule,
    PanelModule,
    ButtonModule,PlusIcon,TrashIcon,Card,IftaLabelModule],
  templateUrl: './alterquestion.component.html',
  styleUrl: './alterquestion.component.css'
})
export class AlterquestionComponent {
  questionForm!: FormGroup;
  selectedType = signal('single');
  questionId ='';


  questionTypes = [
    { label: 'Choose the best (Single Answer)', value: 'single' },
    { label: 'Choose the best (Multiple Answers)', value: 'multiple' },
    { label: 'Paragraph Answer', value: 'paragraph' }
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.questionForm=new FormGroup({
      quizId : new FormControl('',Validators.required),
      questionType: new FormControl(this.selectedType(), Validators.required),
          questionText: new FormControl('', Validators.required),
          options: new FormArray([]),
          correctAnswer: new FormControl(this.selectedType(),[]),
          correctAnswers:new FormControl([this.selectedType()]),
          paragraphAnswer: new FormControl('')
    });
    
  }


  ngOnInit(): void {
    this.questionId = this.route.snapshot.paramMap.get('questionId') || '';
    console.log("ithu Question id :", this.questionId);
  
    if (this.questionId) {
      this.http.get<any>(`http://localhost:3000/alterQuestion/${this.questionId}`).subscribe({
        next: (data) => {
          console.log('Fetched quiz:', data);
  
          this.selectedType.set(data.questionType);
  
          // Patch general fields first
          this.questionForm.patchValue({
            quizId: data.quizId,
            questionType: data.questionType,
            questionText: data.questionText,
            options:data.options,
            correctAnswer:data.correctAnswer,
            correctAnswers :data.correctAnswers,
            paragraphAnswer: data.paragraphAnswer
          });
  
          // Clear existing options first
          this.optionsArray.clear();
          if (data.options && data.options.length) {
            data.options.forEach((option: string) => {
              this.optionsArray.push(new FormControl(option, Validators.required));
            });
          }
  
          // Handle correctAnswer based on question type
          if (data.questionType === 'multiple') {
            this.questionForm.get('correctAnswers')?.setValue(data.correctAnswer || []);
          } else {
            this.questionForm.get('correctAnswers')?.setValue(data.correctAnswer?.[0] || '');
          }
        },
        error: (err) => {
          console.error('Error fetching question:', err);
        }
      });
    }
  
    // Handle questionType changes and reset dependent fields
    this.questionForm.get('questionType')?.valueChanges.subscribe((type: string) => {
      this.selectedType.set(type);
      this.resetOptions(); // Clears options array
  
      // Clear answers as well
      this.questionForm.get('correctAnswers')?.setValue(type === 'multiple' ? [] : '');
      this.questionForm.get('paragraphAnswer')?.setValue('');
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

  onCheckboxChange(event: any, index: number): void {
    const currentValue = this.optionsArray.at(index).value;
    const selected: string[] = this.questionForm.get('correctAnswers')?.value || [];
  
    if (event.checked) {
      if (!selected.includes(currentValue)) {
        selected.push(currentValue);
      }
    } else {
      const i = selected.indexOf(currentValue);
      if (i !== -1) {
        selected.splice(i, 1);
      }
    }
  
    this.questionForm.get('correctAnswers')?.setValue(selected);
  }
  

  resetOptions(): void {
    this.optionsArray.clear();
    this.questionForm.get('correctAnswer')?.setValue([]);
    this.questionForm.get('correctAnswers')?.setValue([])
  }

  submitUpdatedQuestion(): void {
    const rawData = this.questionForm.value;
    let formattedCorrectAnswer: string[] = [];

    if (rawData.questionType === 'single') {
      formattedCorrectAnswer = Array.isArray(rawData.correctAnswer) ? rawData.correctAnswer : [rawData.correctAnswer];
    } else if (rawData.questionType === 'multiple') {
      formattedCorrectAnswer = rawData.correctAnswers;
    }

    const updatedData = {
      quizId: rawData.quizId,
      questionType: rawData.questionType,
      questionText: rawData.questionText,
      options: rawData.options,
      correctAnswer: rawData.correctAnswer,
      correctAnswers:rawData.correctAnswers,
      paragraphAnswer: rawData.paragraphAnswer
    };

    this.http.put(`http://localhost:3000/question/${this.questionId}`, updatedData).subscribe({
      next: () => {
        alert('Question updated successfully!');
        this.router.navigate(['/displayquiz']);
      },
      error: (err) => {
        console.error('Error updating question:', err);
        alert('Failed to update question.');
      }
    });
  }
  
}