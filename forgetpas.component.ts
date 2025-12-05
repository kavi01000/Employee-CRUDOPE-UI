import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-forgetpas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [AuthService],
  templateUrl: './forgetpas.component.html',
  styleUrls: ['./forgetpas.component.css']
})
export class ForgotPasswordComponent {



  step: 'forgot' | 'reset' = 'forgot';

  forgotObj = {
    email: ''
  };

  resetObj = {
    token: '',
    newPassword: ''
  };

  forgotError = '';
  resetError = '';

  toastMessage = '';

  constructor(private authService: AuthService,private router: Router ) { }

    goToLogin() {
    this.router.navigate(['/login']);  // <-- route must match your route path
  }

  // ✅ FORGOT PASSWORD ------------------------------------
  onForgot(form: NgForm) {
    this.forgotError = '';

    if (!this.forgotObj.email) {
      this.forgotError = 'Email is required';
      return;
    }

    this.authService.forgotPassword(this.forgotObj).subscribe({
      next: (res: any) => {
        this.showToast('Reset link/token generated');

        // Normally email is sent. Here we switch to reset screen.
        this.step = 'reset';
        this.resetObj.token = res.token; // auto-fill for demo
      },
      error: () => this.showToast('Email not found')
    });
  }

  // ✅ RESET PASSWORD --------------------------------------
  onReset(form: NgForm) {
    this.resetError = '';

    if (!this.resetObj.token) {
      this.resetError = 'Token required';
      return;
    }

    if (!this.resetObj.newPassword) {
      this.resetError = 'Password required';
      return;
    }
this.authService.resetPassword(this.resetObj).subscribe({
  next: () => {
    this.showToast('Password updated successfully');
    form.resetForm();
    this.step = 'forgot';

    // ✅ Redirect to login page after short delay
    
  },
  error: (err) => {
    this.showToast('Password updated successfully');
    
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500); // wait 1.5 seconds so user sees the toast
  }
});

  }

  // ✅ Toast Helper
  private showToast(message: string) {
    const toastEl = document.getElementById('liveToast');
    if (toastEl) {
      toastEl.querySelector('.toast-body')!.textContent = message;
      const bsToast = new (window as any).bootstrap.Toast(toastEl);
      bsToast.show();
    } else {
      alert(message);
    }
  }
}
