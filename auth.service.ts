import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


export interface User {
  email: string;
  emailOrPhoneOrName?: string;
  password: string;
  fullName?: string;
  phoneNo?: string;
  oldPassword?: string;
  newPassword?: string;
  userId?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/Auth`;
  

  constructor(private http: HttpClient) { }

  // ✅ LOGIN
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  // ✅ REGISTER
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // ✅ FORGOT PASSWORD
  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot`, data);
  }

  
  // ✅ RESET PASSWORD
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset`, data);
  }
  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, data);
  }
    saveCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // ✅ Get current user
  getCurrentUser(): any | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // ✅ Store JWT in localStorage
  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  // ✅ Get JWT
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // ✅ Remove JWT on logout
  logout() {
    localStorage.removeItem('authToken');
  }


  // ✅ Check logged-in status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
