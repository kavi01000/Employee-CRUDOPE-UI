import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../Servies/navigation.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  isCollapsed = true;
  openedItem: string | null = null;

  constructor(
    private router: Router,
    public navService: NavigationService
  ) {
    this.navService.sidebarCollapsed$.subscribe(v => this.isCollapsed = v);
  }

  onNavItemClick(item: any) {
    if (item.children) {
      this.openedItem = this.openedItem === item.label ? null : item.label;

      // ✅ Set only parent title on open
      this.navService.setSelectedTitle(item.label);
      return;
    }

    // Normal route
    this.router.navigate([item.route]);
    this.navService.setSelectedTitle(item.label);
  }

  onChildClick(child: any, event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate([child.route]);

    // Find parent (Master)
    const parent = this.navItems.find(x => x.children?.includes(child));

    if (parent) {
      // ✅ Parent / Child
      this.navService.setSelectedTitle(`${parent.label} / ${child.label}`);
    }
  }

  currentYear = new Date().getFullYear();

  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'bi bi-speedometer2' },
    { label: 'Employee', route: '/employee', icon: 'bi bi-person-workspace' },
    {
      label: 'Master',
      icon: 'bi bi-collection-fill',
      iconClosed: 'bi bi-chevron-right',
      iconOpen: 'bi bi-chevron-down',
      children: [
        { label: 'Department', route: '/mdepartment', icon: 'bi bi-diagram-3-fill' },
        { label: 'Qualification', route: '/mqualification', icon: 'bi bi-person-lines-fill' }
      ]
    }
  ];
}
