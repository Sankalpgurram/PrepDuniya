import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './auth/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: '', 
    component: MainLayoutComponent, 
    canActivate: [authGuard],
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'resume', 
        loadComponent: () => import('./features/resume/resume.component').then(m => m.ResumeComponent) 
      },
      { 
        path: 'jobs', 
        loadComponent: () => import('./features/jobs/jobs.component').then(m => m.JobsComponent) 
      },
      { 
        path: 'mock-tests', 
        loadComponent: () => import('./features/mock-tests/company-selection/company-selection.component').then(m => m.CompanySelectionComponent) 
      },
      { 
        path: 'mock-tests/result', 
        loadComponent: () => import('./features/mock-tests/result/result.component').then(m => m.ResultComponent) 
      },
      { 
        path: 'mock-tests/:company', 
        loadComponent: () => import('./features/mock-tests/interview-type/interview-type.component').then(m => m.InterviewTypeComponent) 
      },
      { 
        path: 'mock-tests/:company/technical', 
        loadComponent: () => import('./features/mock-tests/technical-interview/technical-interview.component').then(m => m.TechnicalInterviewComponent) 
      },
      { 
        path: 'mock-tests/:company/hr', 
        loadComponent: () => import('./features/mock-tests/hr-interview/hr-interview.component').then(m => m.HrInterviewComponent) 
      },
      {
        path: 'coding',
        loadComponent: () => import('./features/coding/problem-list/problem-list.component').then(m => m.ProblemListComponent)
      },
      {
        path: 'coding/leaderboard',
        loadComponent: () => import('./features/coding/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
      },
      {
        path: 'coding/:id',
        loadComponent: () => import('./features/coding/problem-detail/problem-detail.component').then(m => m.ProblemDetailComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user-profile/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/user-profile/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
