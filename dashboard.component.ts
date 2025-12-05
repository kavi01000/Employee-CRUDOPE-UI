import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../Servies/employee.service';
import { MdeptService } from '../Servies/mdept.service';
import { MqualiService } from '../Servies/mquali.service';
import { MatCardHeader, MatCardContent, MatCardTitle, MatCard } from "@angular/material/card";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [ MatCard],
})
export class DashboardComponent implements OnInit {

  employeeCount = 0;
  deptCount = 0;
  qualificationCount = 0;
  activeEmployeeCount = 0;
currentDate: string = '';

  constructor(
    private employeeService: EmployeeService,
    private deptService: MdeptService,
    private qualiService: MqualiService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
           const today = new Date();
    this.currentDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  loadDashboardData() {
    this.loadEmployeeData();
    this.loadDeptCount();
    this.loadQualificationCount();
  }

  loadEmployeeData() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res: any[]) => {
        this.employeeCount = res.length;
        this.activeEmployeeCount = res.filter(x => x.isActive).length;
      },
      error: (err: any) => console.error('Error loading employees:', err)
    });
  }

  loadDeptCount() {
    this.deptService.getAll().subscribe({
      next: (res: any[]) => this.deptCount = res.length,
      error: (err: any) => console.error('Error loading department:', err)
    });
  }

  loadQualificationCount() {
    this.qualiService.getAll().subscribe({
      next: (res: any[]) => this.qualificationCount = res.length,
      error: (err: any) => console.error('Error loading qualification:', err)
    });
  }

}
