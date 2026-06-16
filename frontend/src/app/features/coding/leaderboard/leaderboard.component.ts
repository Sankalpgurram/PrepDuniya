import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CodingService } from '../coding.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];
  isLoading = signal(true);
  currentUserId: number | null = null;

  constructor(
    private codingService: CodingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id || null;

    this.codingService.getLeaderboard().subscribe({
      next: (res) => {
        if (res.success) this.leaderboard = res.data;
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getRankBadge(rank: number) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank.toString();
  }

  getWinRate(user: any): string {
    const total = user.total_submissions || 0;
    const solved = user.problems_solved || 0;
    if (total === 0) return '0%';
    return Math.round((solved / total) * 100) + '%';
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) : 'U';
  }

  getAvatarColor(rank: number): string {
    const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899'];
    return colors[(rank - 1) % colors.length];
  }
}
