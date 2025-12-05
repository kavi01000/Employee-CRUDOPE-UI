import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavigationService } from '../Servies/navigation.service';

interface NavItem {
  label: string;
  route?: string;
  icon: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  @Input() headerCollapsed = false;
  @Output() sidebarToggled = new EventEmitter<boolean>();

  isCollapsed = false;
  openedItem: string | null = null;

  constructor(private router: Router, public navService: NavigationService) {}

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'bi bi-speedometer2' },
    { label: 'Employee', route: '/employee', icon: 'bi bi-person-workspace' },
    {
      label: 'Master',
      icon: 'bi bi-collection-fill',
      children: [
        { label: 'MDepartment', route: '/mdepartment', icon: 'bi bi-diagram-3-fill' },
        { label: 'MQualification', route: '/mqualification', icon: 'bi bi-person-lines-fill' },
      ]
    },
  ];

  // When user clicks toggle button inside sidebar
  toggleFromSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggled.emit(this.isCollapsed);
  }

  // When header sends toggle signal
  ngOnChanges() {
    this.isCollapsed = this.headerCollapsed;
  }

  onNavItemClick(item: NavItem) {
    if (item.children) {
      this.openedItem = this.openedItem === item.label ? null : item.label;
      return;
    }
    this.router.navigate([item.route!]);
    this.navService.setSelectedTitle(item.label);
  }

  onChildClick(child: NavItem, event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate([child.route!]);
    this.navService.setSelectedTitle(child.label);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
