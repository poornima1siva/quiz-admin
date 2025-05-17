import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-createaccount',
  standalone: true,
  imports: [ReactiveFormsModule,ButtonModule,CardModule,InputText],
  templateUrl: './createaccount.component.html',
  styleUrl: './createaccount.component.scss'
})
export class CreateaccountComponent {
  createAccountForm: FormGroup;
  submitted = false;
  mismatch=false;
  constructor(private router:Router ) {
    this.createAccountForm = new FormGroup({
      firstName:new FormControl('', [Validators.required]),
      lastName:new FormControl( '', [Validators.required]),
      phoneNumber:new FormControl( '', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password:new FormControl( '', [Validators.required, Validators.minLength(6)]),
      confirmPassword:new FormControl('', [Validators.required])
    });
  }

  // Custom Validator to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.createAccountForm.valid) {
      const password = this.createAccountForm.get('password')?.value;
      const confirmPassword = this.createAccountForm.get('confirmPassword')?.value;

      if (password !== confirmPassword) {
        this.mismatch = true;
        return;
      } else {
        this.mismatch = false;
      }

      const formData = this.createAccountForm.value;
      localStorage.setItem('userData', JSON.stringify(formData));
      alert('Account created successfully! Data saved in local storage.');
      this.router.navigate(['/addquiz']); 
    } else {
      alert('Please fill out the form correctly.');
    }
  }

  login() {
    this.router.navigate(['/']); // Redirect to login page
  }
  
}

