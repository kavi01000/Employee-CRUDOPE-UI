import { Component, OnInit } from '@angular/core';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MqualiService, Qualification } from '../Servies/mquali.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-qualification',
  templateUrl: './mqualification.component.html',
  imports: [
     MatTooltipModule,
    MatCheckbox,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatCheckboxModule,
  ],
  styleUrls: ['./mqualification.component.css'],
})
export class MqualificationComponent implements OnInit {
  displayedColumns: string[] = ['name', 'isactive', 'action'];
  searchTerm = '';
sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';

  qualifications: any[] = [];
  filteredQualifications: any[] = [];
  currentDate: string = '';
dataSource: any[] = [];
originalItem: any = null;

  showModal = false;
  modalTitle = 'Add Qualification';
  
  currentItem: any = {
    mQualificationId: 0,
    qualificationName: '',
    isActive: true,
  };

  constructor(
    private mqualiService: MqualiService,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.loadData();
     const today = new Date();
    this.currentDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  loadData() {
    this.mqualiService.getAll().subscribe((res) => {
      this.qualifications = res;
      this.applyFilter();
    });
  }
  isFormValid(): boolean {
    // Check if Qualification Name is entered and checkbox is selected
    return (
      this.currentItem?.qualificationName?.trim() &&
      this.currentItem?.isActive !== undefined
    );
  }

sortData(column: string) {
  // If clicking same column → toggle direction
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  const sorted = [...this.filteredQualifications].sort((a, b) => {
    const valA = (a[column] || '').toString().toLowerCase();
    const valB = (b[column] || '').toString().toLowerCase();

    if (this.sortDirection === 'asc') {
      return valA.localeCompare(valB);
    } else {
      return valB.localeCompare(valA);
    }
  });

  this.filteredQualifications = sorted;
}


  applyFilter() {
    this.filteredQualifications = this.qualifications.filter((x) =>
      x.qualificationName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  openAddModal() {
    this.modalTitle = 'Add Qualification';
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(row: any) {
    this.modalTitle = 'Edit Qualification';
    this.currentItem = { ...row };
    this.showModal = true;
     this.currentItem = { ...row };      // fill form
  this.originalItem = { ...row };
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (this.currentItem.mQualificationId === 0) {
      // CREATE
      this.mqualiService.create(this.currentItem).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.app.showToast('Qualification added successfully!', 'success');
        },
        error: () => {
          this.app.showToast('Failed to add qualification!', 'error');
        },
      });
    } else {
      // UPDATE
      this.mqualiService
        .update(this.currentItem.mQualificationId, this.currentItem)
        .subscribe({
          next: () => {
            this.loadData();
            this.closeModal();
            this.app.showToast(
              'Qualification updated successfully!',
              'success'
            );
          },
          error: () => {
            this.app.showToast('Failed to update qualification!', 'error');
          },
        });
    }
  }
  DeleteQualification(q: Qualification) {
    this.app.showPopModal(
      'Delete Qualification',
      `Are you sure you want to delete "${q.qualificationName}"?`,
      (confirmed: boolean) => {
        if (confirmed) {
          this.mqualiService.delete(q.mQualificationId!).subscribe({
            next: () => {
              this.app.showToast(
                'Qualification deleted successfully!',
                'success'
              );
              this.loadData();
            },
            error: () => {
              this.app.showToast('Failed to delete qualification!', 'error');
            },
          });
        }
      }
    );
  }

 resetForm() {
  if (this.modalTitle === 'Add Qualification') {

    // Clear form only for Add
    this.currentItem = {
      mQualificationId: 0,
      qualificationName: '',
      isActive: true,
    };

  } else if (this.modalTitle === 'Edit Qualification') {

    // Restore OLD values for Edit
    this.currentItem = { ...this.originalItem };
  }
}

}
