import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreateEmployee {
  employeeId?: number;
  employeeName: string;
  email: string;
  phoneNo: string;
  gender: string;
  dob: string;
  dateOfJoining: string;
  age: number;
  pinCode: string;
  mDepartmentId: number;
  mQualificationId: number;
  isActive: boolean;
  skills: string[];  
}
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = `${environment.apiUrl}/Employee`; 

  constructor(private http: HttpClient) {}

  addEmployee(employee: CreateEmployee): Observable<CreateEmployee> {
    return this.http.post<CreateEmployee>(`${this.baseUrl}/add`, employee);
  }


  getAllEmployees(): Observable<CreateEmployee[]> {
    return this.http.get<CreateEmployee[]>(`${this.baseUrl}/all`);
  }

  getEmployeeById(id: number): Observable<CreateEmployee> {
    return this.http.get<CreateEmployee>(`${this.baseUrl}/${id}`);
  }

  updateEmployee(id: number, employee: CreateEmployee): Observable<CreateEmployee> {
    return this.http.put<CreateEmployee>(`${this.baseUrl}/update/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
