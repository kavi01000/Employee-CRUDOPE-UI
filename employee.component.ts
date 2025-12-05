import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';

import { CreateEmployee, EmployeeService } from '../Servies/employee.service';
import { MdeptService } from '../Servies/mdept.service';
import { MqualiService, Qualification } from '../Servies/mquali.service';
import { AppComponent } from '../app.component';
import { OverlayContainer } from '@angular/cdk/overlay';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

// Custom date format
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'dd-MMM-yyyy',
  },
  display: {
    dateInput: 'dd-MMM-yyyy',      // This controls the input box format
     monthYearLabel: 'MMM yyyy',     // Month-Year display in calendar header
    dateA11yLabel: 'dd-MMM-yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
    
  },
};

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers:[    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
],
  imports: [
    MatTooltipModule,
    MatSortModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    CommonModule,
    MatOptionModule,
   MatSort
  ]
})
export class EmployeeComponent implements OnInit {

  
  @ViewChild(MatSort) sort!: MatSort;


  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  departmentList: any[] = [];
  qualificationList: Qualification[] = [];
minDob: Date = new Date(1900, 0, 1); // optional
maxDob!: Date;
   maxDate: Date = new Date();
  displayedColumns: string[] = [
    
    'employeename',
    'email',
    'gender',
    'phoneNo',
    'dob',
    'departmentName',
    'qualificationName',
    'skills',
    'dateOfJoining',
    'isActive',
    'action'
  ];

  employeeList: any[] = [];
  filteredEmployees: any[] = [];
  isEditMode: boolean = false;
  toastMessage = '';
  showModal: boolean = false;
  modalTitle: string = '';
  filteredQualifications: Qualification[] = [];
 sortedDataSource = new MatTableDataSource<any>();
skillsList = [
  'Java',
  'Angular',
  'SQL',
  'Python'
];
currentDate: string = '';
  currentItem: any = this.initEmployee();
  originalItem: any = null; // Store original data for reset in edit mode

  constructor(
    private service: EmployeeService,
    private mdeptService: MdeptService,
    private mqualiService: MqualiService,
    private app: AppComponent,
    
  ) {}

  ngOnInit() {
        const today = new Date();
    this.currentDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const todayForDob = new Date();
  this.maxDob = new Date(todayForDob.getFullYear() - 17, todayForDob.getMonth(), todayForDob.getDate());
    this.loadEmployees();
    this.loadDepartmentList();
    this.loadQualificationList();
 
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.sortedDataSource) {
        this.sortedDataSource.sort = this.sort;
      }
    });
  }

  // Initialize Employee
  initEmployee() {
    return {
      employeeId: 0,
      employeeName: '',
      gender: 'Male',
      email: '',
      phoneNo: '',
      mDepartmentId: 0,
      mQualificationId: 0,
      skills: [],
      departmentName: '',
      qualificationName: '',
      pinCode: '',
      age: 0,
      dateOfJoining: '',
      dob: '',
      isActive: Boolean
    };
  }

  formatDateForInput(date: Date): string {
  const day = date.getDate(); // 1-31
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
allowNumbersOnly(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);
  // Allow only numbers (0-9)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

 formatDob() {
  if (this.currentItem.dob) {
    const d = new Date(this.currentItem.dob);
    this.currentItem.dob = d.toISOString().split('T')[0];
  }
}

  filterQualification() {
  const s = this.searchTerm.toLowerCase();
  this.filteredQualifications = this.qualificationList.filter(q =>
    q.qualificationName.toLowerCase().includes(s)
  );
}
 // Load Employees from API
  loadEmployees() {
    this.service.getAllEmployees().subscribe({
      next: (res) => {
        this.employeeList = res;
        this.filteredEmployees = res;

        this.sortedDataSource = new MatTableDataSource(this.filteredEmployees);

        setTimeout(() => {
          this.sortedDataSource.sort = this.sort;
        });
      },
      error: (err) => console.error('Error loading employees:', err)
    });
  }

  // Load Department Dropdown
  loadDepartmentList() {
    this.mdeptService.getAll().subscribe({
      next: (res) => {
        this.departmentList = res.map(d => ({
          mDepartmentId: d.mDepartmentId,
          departmentName: d.departmentName
        }));

        // Restore selected department after reset in edit mode
        if (this.isEditMode && this.currentItem.departmentName) {
          const match = this.departmentList.find(d =>
            d.departmentName === this.currentItem.departmentName
          );
          if (match) this.currentItem.mDepartmentId = match.mDepartmentId;
        }
      }
    });
  }

  // Load Qualification Dropdown
  loadQualificationList() {
    this.mqualiService.getAll().subscribe({
      next: (res) => {
        this.qualificationList = res.map(q => ({
          mQualificationId: q.mQualificationId,
          qualificationName: q.qualificationName
        }));

        // Restore selected qualification after reset in edit mode
        if (this.isEditMode && this.currentItem.qualificationName) {
          const match = this.qualificationList.find(q =>
            q.qualificationName === this.currentItem.qualificationName
          );
          if (match) this.currentItem.mQualificationId = match.mQualificationId;
        }
      }
    });
  }

  // On Department Dropdown Change
  onDepartmentChange(deptId: number) {
    const dept = this.departmentList.find(x => x.mDepartmentId === deptId);
    if (dept) {
      this.currentItem.departmentName = dept.departmentName;
    }
  }

  // Search Employees
 filterData() {
    const s = this.searchTerm.toLowerCase();

    this.filteredEmployees = this.employeeList.filter(emp =>
      emp.employeeName.toLowerCase().includes(s) ||
      emp.email.toLowerCase().includes(s) ||
      emp.departmentName.toLowerCase().includes(s)
    );

    this.sortedDataSource.data = this.filteredEmployees;
  }
  // Open Add Modal
  openAddModal() {
    this.isEditMode = false;
    this.modalTitle = "Add Employee";
    this.currentItem = this.initEmployee();
    this.originalItem = null;
    this.showModal = true;
    this.loadDepartmentList();
    this.loadQualificationList();
  }

  // Open Edit Modal
  openEditModal(row: any) {
    this.isEditMode = true;
    this.modalTitle = "Edit Employee";

    // Store original data for reset
    this.originalItem = { ...row };

    this.currentItem = { ...row };

    this.loadDepartmentList();
    this.loadQualificationList();

    // FORCE SINGLE VALUE FOR QUALIFICATION
    if (Array.isArray(this.currentItem.mQualificationId)) {
      this.currentItem.mQualificationId = this.currentItem.mQualificationId[0] || 0;
    }

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // Reset form
  resetForm() {
    if (this.isEditMode && this.originalItem) {
      // Restore original employee data
      this.currentItem = { ...this.originalItem };
    } else {
      // Clear form in add mode
      this.currentItem = this.initEmployee();
    }

    this.loadDepartmentList();
    this.loadQualificationList();
  }

  // Save Employee (Add/Update)
  save() {
      this.formatDob();  
    const payload = {
      employeeName: this.currentItem.employeeName,
      email: this.currentItem.email,
      phoneNo: this.currentItem.phoneNo,
      gender: this.currentItem.gender,
      dob: this.currentItem.dob ? this.currentItem.dob : null,
      dateOfJoining: this.currentItem.dateOfJoining,
      age: Number(this.currentItem.age),
      pinCode: this.currentItem.pinCode,
      skills: this.currentItem.skills || [],
      mDepartmentId: this.currentItem.mDepartmentId,
      mQualificationId: this.currentItem.mQualificationId,
      isActive: this.currentItem.isActive
    };

    if (!this.isEditMode) {
      // ADD
      this.service.addEmployee(payload).subscribe({
        next: () => {
          this.app.showToast("Employee added successfully!", "success");
          this.loadEmployees();
          this.closeModal();
        },
        error: () => {
          this.app.showToast("Failed to add employee", "error");
        }
      });
    } else {
      // UPDATE
      this.service.updateEmployee(this.currentItem.employeeId, payload).subscribe({
        next: () => {
          this.app.showToast("Employee updated successfully!", "success");
          this.loadEmployees();
          this.closeModal();
        },
        error: () => {
          this.app.showToast("Failed to update employee", "error");
        }
      });
    }
  }
  

confirmDelete(emp: CreateEmployee) {
  this.app.showPopModal(
    'Delete Employee',
    `Are you sure you want to delete "${emp.employeeName}"?`,
    (confirmed: boolean) => {

      if (confirmed) {
        this.service.deleteEmployee(emp.employeeId!).subscribe({
          next: () => {
            this.app.showToast("Employee deleted successfully!", "error");
            this.loadEmployees();
          },
          error: () => {
            this.app.showToast("Failed to delete employee!", "error");
          }
        });
      }

    }
  );
}
sortData(column: string) {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.filteredEmployees.sort((a: any, b: any) => {
    let valA: any = a[column];
    let valB: any = b[column];

    if (column === 'dob') {
      valA = valA ? new Date(valA) : new Date(0);
      valB = valB ? new Date(valB) : new Date(0);
    } else {
      valA = valA ? valA.toString().toLowerCase() : '';
      valB = valB ? valB.toString().toLowerCase() : '';
    }

    if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  this.sortedDataSource.data = this.filteredEmployees;
}



  // Show qualification name in table
  getSelectedQualificationNames(item: any): string {
    const qual = this.qualificationList.find(
      q => q.mQualificationId === item.mQualificationId
    );
    return qual ? qual.qualificationName : '';
  }
}
