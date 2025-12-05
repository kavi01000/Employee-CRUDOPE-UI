import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Toast } from 'bootstrap';
import { AuthService, User } from '../auth.service';
import { AppComponent } from '../app.component';
import { MatFormField, MatLabel, MatError } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatFormField, MatLabel, MatError, MatIcon,CommonModule,
    FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,MatIconModule,MatTabsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  
 activeTabIndex: number = 0; 

  toastMessage = '';
  @ViewChild('toastElement') toastElement!: ElementRef;
  toast!: Toast;
  shPassword = false;
  shConfirmPassword = false;

  togglePassword() {
    this.shPassword = !this.shPassword;
  }

  allowNumbersOnly(event: KeyboardEvent) {
  const charCode = event.key ? event.key.charCodeAt(0) : event.keyCode;
  // Allow only numbers (0-9)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}


  goToChangePassword() {
    this.router.navigate(['/change-password']);
  }

  registerObj ={
    fullName: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: ''
  };

  loginObj = {
    emailOrPhoneOrName: '',
    password: '',
  };
  

  registerErrors = { email: '', password: '', fullName: '', phoneNo: '' };
  loginErrors = { emailOrPhoneOrName: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private app: AppComponent,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
  this.route.queryParams.subscribe(params => {
    if (params['tab'] === 'login') {
       this.activeTabIndex = 1;
    } else if (params['tab'] === 'register') {
      this.activeTabIndex = 0;
    }
  });
}

  // ---------------- REGISTER ----------------
onRegister(form: NgForm) {
    this.registerErrors = { email: '', password: '', fullName: '', phoneNo: '' };

    this.authService.register(this.registerObj).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.showToast(res.message, 'success');

          setTimeout(() => {
             this.activeTabIndex = 1; 
           
            form.resetForm();
          }, 2000);
        } else {
          this.showToast('Registration failed. Please try again.', 'error');
        }
      },
      error: (err: any) => {
        const message = err.error?.message || 'Registration failed. Please try again.';
        this.showToast(message, 'error');
      }
    });
  }

  // ---------------- TOAST ----------------
  private showToast(message: string, type: 'success' | 'error' = 'success') {
    const toastEl = document.getElementById('liveToast');
    if (toastEl) {
      toastEl.classList.remove('toast-success', 'toast-error');
      toastEl.classList.add(type === 'success' ? 'toast-success' : 'toast-error');
      toastEl.querySelector('.toast-body')!.textContent = message;
      new (window as any).bootstrap.Toast(toastEl).show();
    }
  }
// ---------------- LOGIN ----------------
onLogin(form: NgForm) {
  this.loginErrors = { emailOrPhoneOrName: '', password: '' };

  this.authService.login(this.loginObj).subscribe({
    next: (res) => {
      if (res?.token) {
        this.authService.saveToken(res.token);
        this.authService.saveCurrentUser(res); // ⭐ Save full user object

        this.app.isLoggedIn = true;
        this.showToast('Login Successful', 'success');

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
          form.resetForm();
        }, 1200);
      } else {
        this.loginErrors.password = 'Invalid login credentials';
      }
    },
    error: () => this.showToast('Login Failed', 'error')
  });
}




  
}
