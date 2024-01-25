import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/security/login/login.component';
import { CreateReportComponent } from './modules/reports/create-report/create-report.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./modules/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    component: CreateReportComponent,
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
