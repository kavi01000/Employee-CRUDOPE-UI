import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MDepartmentDto, MdeptService } from '../Servies/mdept.service';
import { AppComponent } from '../app.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-mdepeartment',
  standalone: true,
  imports: [
    MatTooltipModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  templateUrl: './mdepeartment.component.html',
  styleUrls: ['./mdepeartment.component.css']
})
export class MdepeartmentComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'code', 'isactive', 'action'];
  departments: MDepartmentDto[] = [];
  filteredDepartments: MDepartmentDto[] = [];
  searchTerm: string = '';
  currentDate: string = '';
originalDept: any = null;
  // Modal handling
  showModal = false;
  modalTitle = 'Add Department';
  currentDept: MDepartmentDto = { departmentName: '', departmentCode: '', isActive: true, isDeleted: false };

  // Sorting
sortColumn: keyof MDepartmentDto = 'departmentName';
sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private mdeptService: MdeptService, private snackBar: MatSnackBar, private app: AppComponent) {}

  ngOnInit(): void {
    this.loadDepartments();
     const today = new Date();
    this.currentDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });;
  }

  // Load all departments
  loadDepartments(): void {
    this.mdeptService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
        this.applyFilter();
      },
      error: () => this.showToast('Failed to load departments')
    });
  }

  // Filter departments by search term
  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDepartments = this.departments.filter(
      (dep) =>
        dep.departmentName.toLowerCase().includes(term) ||
        dep.departmentCode.toLowerCase().includes(term)
    );

    // Apply current sorting if any
    if (this.sortColumn) {
      this.sortData(this.sortColumn);
    }
  }
 clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }
  

  sortData(column: keyof MDepartmentDto): void {
  // Toggle sorting if same column, otherwise default to ascending
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.filteredDepartments = [...this.filteredDepartments].sort((a, b) => {
    let valA = a[column];
    let valB = b[column];

    // Handle undefined/null
    if (valA === undefined || valA === null) valA = '';
    if (valB === undefined || valB === null) valB = '';

    // Boolean → convert to 1 / 0
    if (typeof valA === 'boolean') valA = valA ? 1 : 0;
    if (typeof valB === 'boolean') valB = valB ? 1 : 0;

    // String → case-insensitive comparison
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}


  // Modal handlers
  openAddModal(): void {
    this.modalTitle = 'Add Department';
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(dept: MDepartmentDto): void {
    this.modalTitle = 'Edit Department';
    this.currentDept = { ...dept };
    this.showModal = true;
     this.originalDept = { ...dept };
  }

  closeModal(): void {
    this.showModal = false;
  }

  // Save (Create / Update)
  saveDepartment(): void {

    if (!this.currentDept.departmentName?.trim()) {
      this.app.showToast("Department name is required", "error");
      return;
    }
    if (!this.currentDept.departmentCode?.trim()) {
      this.app.showToast("Department code is required", "error");
      return;
    }

    if (this.currentDept.mDepartmentId) {
      // UPDATE
      this.mdeptService.update(this.currentDept.mDepartmentId, this.currentDept).subscribe({
        next: () => {
          this.loadDepartments();
          this.closeModal();
          this.app.showToast("Department updated successfully!", "success");
        },
        error: () => this.app.showToast("Failed to update department!", "error")
      });
    } else {
      // CREATE
      this.mdeptService.create(this.currentDept).subscribe({
        next: () => {
          this.loadDepartments();
          this.closeModal();
          this.app.showToast("Department added successfully!", "success");
        },
        error: () => this.app.showToast("Failed to add department!", "error")
      });
    }
  }

deleteDepartment(dep: MDepartmentDto): void {
  this.app.showPopModal(
    'Delete Department',
    `Are you sure you want to delete "${dep.departmentName}"?`,
    (confirmed: boolean) => {

      if (confirmed) {
        this.mdeptService.delete(dep.mDepartmentId!).subscribe({
          next: () => {
            this.app.showToast("Department deleted successfully!", "error");
            this.loadDepartments();
          },
          error: () => {
            this.app.showToast("Error deleting department!", "error");
          }
        });
      }

    }
  );
}


  // Reset form
  resetForm(): void {
  if (this.modalTitle === 'Add Department') {
    // Clear form for Add
    this.currentDept = {
      departmentName: '',
      departmentCode: '',
      isActive: true,
      isDeleted: false
    };
    this.originalDept = null; // not needed for Add
  } else if (this.modalTitle === 'Edit Department') {
    // Restore original values for Edit
    if (this.originalDept) {
      this.currentDept = { ...this.originalDept };
    }
  }
}

  showToast(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 2500 });
  }

}
