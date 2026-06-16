import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResumeService } from './resume.service';
import { UserStateService } from '../../core/services/user-state.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatToolbarModule
  ],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css'
})
export class ResumeComponent {
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';
  analysisResult: any = null;

  constructor(
    private resumeService: ResumeService,
    private userStateService: UserStateService
  ) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.type !== 'application/pdf') {
        this.errorMessage = 'Please upload a valid PDF file.';
        this.selectedFile = null;
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size exceeds 5MB limit.';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';
    }
  }

  uploadAndAnalyze() {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.analysisResult = null;

    this.resumeService.analyzeResume(this.selectedFile).subscribe({
      next: (response) => {
        this.isLoading = false;

        console.log('AI Response:', response);

        // ✅ FIXED: Direct response handling
        this.analysisResult = response;
        
        if (response.skills && response.skills.length > 0) {
          this.userStateService.setSkills(response.skills);
        }
        if (typeof response.score === 'number') {
          this.userStateService.setAtsScore(response.score);
        }
        this.userStateService.setLastAnalysisDate(new Date());
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);

        this.errorMessage =
          err.error?.message || 'AI analysis failed. Please try again.';
      }
    });
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'primary';
    if (score >= 50) return 'accent';
    return 'warn';
  }
}

