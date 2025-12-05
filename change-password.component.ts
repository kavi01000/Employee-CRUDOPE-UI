import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Toast } from 'bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule,CommonModule, FormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {



  @ViewChild('toastElement') toastElement!: ElementRef;

  changeObj = {
    emailOrPhoneOrName: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  isLoading = false;
  shPassword = false;
  showOld = false;
showNew = false;
showConfirm = false;
   toastMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.shPassword = !this.shPassword;
  }
  goToRegister(){
    this.router.navigate(['/login']);
  }

  private showToast(message: string, type: 'success' | 'error' = 'success') {
    const toastEl = this.toastElement?.nativeElement;
    if (toastEl) {
      toastEl.classList.remove('toast-success', 'toast-error');
      toastEl.classList.add(type === 'success' ? 'toast-success' : 'toast-error');
      toastEl.querySelector('.toast-body')!.textContent = message;

      const bsToast = new Toast(toastEl);
      bsToast.show();
    }
  }

  onChangePassword(form: NgForm) {

  if (form.invalid) {
    this.showToast("Please fill all fields.", 'error');
    return;
  }

  if (this.changeObj.newPassword !== this.changeObj.confirmPassword) {
    this.showToast("New passwords do not match.", 'error');
    return;
  }

  this.isLoading = true;

  const payload = {
    emailOrPhoneOrName: this.changeObj.emailOrPhoneOrName,
    oldPassword: this.changeObj.oldPassword,
    newPassword: this.changeObj.newPassword
  };

  this.authService.changePassword(payload).subscribe({

    next: (res: any) => {
      this.isLoading = false;
      this.showToast("Password updated successfully.", 'success');

      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { tab: 'login' } });
      }, 2000);
    },

    error: (err) => {
      this.isLoading = false;
      this.showToast(err.error?.message || "Old password is incorrect.", 'error');
    }

  });
}

}
