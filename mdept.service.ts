import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MDepartmentDto {
  mDepartmentId?: number;
  departmentName: string;
  departmentCode: string;
  isActive?: boolean;
  isDeleted?: boolean;
  
}

@Injectable({
  providedIn: 'root'
})
export class MdeptService {
 private baseUrl = `${environment.apiUrl}/MDepartment`;
   
 
   constructor(private http: HttpClient) { }
 
  getAll(): Observable<MDepartmentDto[]> {
    return this.http.get<MDepartmentDto[]>(`${this.baseUrl}/get`);
  }

  getById(id: number): Observable<MDepartmentDto> {
    return this.http.get<MDepartmentDto>(`${this.baseUrl}/${id}`);
  }

  create(department: MDepartmentDto): Observable<MDepartmentDto> {
    return this.http.post<MDepartmentDto>(`${this.baseUrl}/post`, department);
  }

  update(id: number, department: MDepartmentDto): Observable<MDepartmentDto> {
    return this.http.put<MDepartmentDto>(`${this.baseUrl}/${id}`, department);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
