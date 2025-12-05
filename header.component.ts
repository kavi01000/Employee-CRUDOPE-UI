import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../Servies/navigation.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isDropdownOpen = false;
  isCollapsed = true;
  selectedTitle = '';
  currentUserName: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private navService: NavigationService,
     private elRef: ElementRef
  ) {}

  ngOnInit() {
    // Listen to sidebar collapse/expand
    this.navService.sidebarCollapsed$.subscribe(v => this.isCollapsed = v);

    // Listen to sidebar-selected menu/submenu for header title
    this.navService.selectedTitle$.subscribe(t => this.selectedTitle = t);

    // Load logged-in user
   const currentUser: any | null = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserName = currentUser.fullName; // ⭐ Bind FullName
    }
  
  }

  // Expand/collapse sidebar on hover
  expandSidebar() {
    this.navService.setSidebarCollapsed(false);
  }

  collapseSidebar() {
    this.navService.setSidebarCollapsed(true);
  }

  // Toggle profile dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
 // ✅ Close dropdown if click is outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
  // Logout
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
