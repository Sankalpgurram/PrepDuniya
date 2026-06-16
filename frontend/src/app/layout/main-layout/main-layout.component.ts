import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../auth/auth.service';
import { UserStateService } from '../../core/services/user-state.service';
import { NotificationService } from '../../core/services/notification.service';
import { filter } from 'rxjs/operators';
import { dropdownAnimation } from '../../shared/animations';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  animations: [dropdownAnimation]
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  public userStateService = inject(UserStateService);

  PAGE_TITLES: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/resume': 'Resume Analyzer',
    '/jobs': 'Job Matching',
    '/mock-tests': 'AI Mock Interviews',
    '/coding': 'Coding Practice',
    '/profile': 'User Profile',
    '/settings': 'Settings',
    '/admin': 'Admin Control Panel'
  };

  notificationService = inject(NotificationService);
  notifications: any[] = [];

  user = this.userStateService.userProfile;
  currentTitle = 'PrepDuniya Hub';
  isSidebarCollapsed = false;

  getProfilePicUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000/${path}`;
  }

  constructor() {
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.userStateService.setUserProfile(response.data);
      },
      error: (err) => {
        console.error('Failed to load profile', err);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTitleByUrl(event.urlAfterRedirects);
    });

    this.updateTitleByUrl(this.router.url);
  }

  updateTitleByUrl(url: string) {
    for (const [path, title] of Object.entries(this.PAGE_TITLES)) {
      if (url.includes(path)) {
        this.currentTitle = title;
        return;
      }
    }
    this.currentTitle = 'Dashboard';
  }

  logout() {
    this.authService.logout();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(res => {
      if (res.success) {
        this.notifications = res.data;
      }
    });
  }

  markRead(n: any) {
    if (!n.is_read) {
      this.notificationService.markAsRead(n.id).subscribe(() => {
        n.is_read = true;
        this.notificationService.unreadCount.update(c => c - 1);
      });
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
