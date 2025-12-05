import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "./login/login.component";
import { filter } from 'rxjs';
import { AuthService } from './auth.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, SidenavComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLoggedIn = false;

  isCollapsed = false;
showModal = false;
  modalTitle = '';
  modalMessage = '';
    modalCallback: ((confirmed: boolean) => void) | null = null;
toggleSidebar() {
  this.isCollapsed = !this.isCollapsed;
}

  get isAuthPage(): boolean {
    const url = this.router.url.split('?')[0];  // remove query params
    return url === '/login' || url === '/change-password';
  }

  constructor(public router: Router,public auth: AuthService,) {
    // Detect route change to hide/show layout
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        // Hide sidenav/header only for login & forgot password pages
        this.isLoggedIn = !(currentUrl === '/login' || currentUrl === '/forgetpas');
      });
  }
  toast = {
  show: false,
  message: "",
  type: "success"
};
showPopModal(title: string, message: string, callback: (confirmed: boolean) => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalCallback = callback;
    this.showModal = true;
  }

  // Handle modal button click
  confirmModal(confirmed: boolean) {
    this.showModal = false;
    if (this.modalCallback) {
      this.modalCallback(confirmed);
    }
  }
  
showToast(message: string, type: 'success' | 'error' = 'success') {
  this.toast = { show: true, message, type };

  setTimeout(() => {
    this.toast.show = false;
  }, 3000);
}

}
