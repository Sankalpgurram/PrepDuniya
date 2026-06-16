import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsService } from './jobs.service';
import { UserStateService } from '../../core/services/user-state.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatChipsModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent {
  private jobsService = inject(JobsService);
  public userStateService = inject(UserStateService);

  jobs: any[] = [];
  isLoading = false;
  errorMessage = '';

  // Expose skills as a plain getter so the template can access `skills.length`
  get skills(): string[] {
    return this.userStateService.skills();
  }

  constructor() {
    effect(() => {
      const currentSkills = this.userStateService.skills();
      if (currentSkills && currentSkills.length > 0) {
        this.fetchJobs(currentSkills);
      } else {
        this.jobs = [];
      }
    });
  }

  fetchJobs(skills: string[]) {
    this.isLoading = true;
    this.errorMessage = '';

    this.jobsService.getJobs(skills).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.jobs = res.data;
        } else {
          this.errorMessage = res.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to fetch jobs. Please try again later.';
        console.error(err);
      }
    });
  }
}
