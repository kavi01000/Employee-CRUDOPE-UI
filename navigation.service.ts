import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {

  private sidebarCollapsedSource = new BehaviorSubject<boolean>(true);
  sidebarCollapsed$ = this.sidebarCollapsedSource.asObservable();

  private selectedTitleSource = new BehaviorSubject<string>('');
  selectedTitle$ = this.selectedTitleSource.asObservable();

  setSidebarCollapsed(value: boolean) {
    this.sidebarCollapsedSource.next(value);
  }

  toggleSidebar() {
    this.sidebarCollapsedSource.next(!this.sidebarCollapsedSource.value);
  }

  setSelectedTitle(title: string) {
    this.selectedTitleSource.next(title);
  }
}
