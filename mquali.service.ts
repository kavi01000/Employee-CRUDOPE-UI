import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Qualification {
  mQualificationId: number;
  qualificationName: string;
  isActive?: boolean;
  isDeleted?: boolean;
  
}


@Injectable({
  providedIn: 'root'
})
export class MqualiService {

  private baseUrl = `${environment.apiUrl}/MQualification`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Qualification[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getById(id: number): Observable<Qualification> {
    return this.http.get<Qualification>(`${this.baseUrl}/${id}`);
  }

  create(data: Qualification): Observable<Qualification> {
    return this.http.post<Qualification>(this.baseUrl, data);
  }

  update(id: number, data: Qualification): Observable<Qualification> {
    return this.http.put<Qualification>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
