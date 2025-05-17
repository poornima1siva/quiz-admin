import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Card, CardModule } from 'primeng/card';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,ButtonModule,IftaLabelModule,Card,CardModule,InputText],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  value: string | undefined;
  adminForm: FormGroup;
  isNewUser = false; // Toggle between login & signup
 
constructor(private router:Router )
{
  this.adminForm=new FormGroup({
    emailOrPhone:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required]),

  });
  }
  login() {
    if (this.adminForm.valid) {
      const email = this.adminForm.value.emailOrPhone;
      const storedUserData = localStorage.getItem('userData');

      if (storedUserData) {
        const users = JSON.parse(storedUserData);

        if (users.email === email) {
          localStorage.setItem('adminEmail', email);
          alert('Login successful! Email saved in local storage.');
          this.router.navigate(['/addquiz']); // Redirect after login
        } else {
          alert('No account found with this email. Please create an account first.');
          this.router.navigate(['/createaccount']);
        }
      } else {
        alert('No account found. Please create an account first.');
        this.router.navigate(['/createaccount']);
      }
    } else {
      alert('Invalid credentials! Please check your email and password.');
    }
  }

  createacc() {
    this.router.navigate(['/createaccount']); // Redirect to registration page
  }
  

}
