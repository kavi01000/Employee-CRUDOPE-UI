import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgetpas/forgetpas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { MdepeartmentComponent } from './mdepeartment/mdepeartment.component';
import { MqualificationComponent } from './mqualification/mqualification.component';
import { NgModule } from '@angular/core';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HeaderComponent } from './header/header.component';

export const routes: Routes = [

  // Default
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Full screen pages
  
  {
  path: 'login',
  loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
}
,
  { path: 'change-password', component: ChangePasswordComponent },

  // After Login pages (with sidebar + header)
  { path : 'header', component : HeaderComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'mdepartment', component: MdepeartmentComponent },
  { path: 'mqualification', component: MqualificationComponent },

  // Fallback
  { path: '**', redirectTo: 'login' }

];
