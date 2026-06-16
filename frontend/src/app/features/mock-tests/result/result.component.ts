import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit {
  evaluation: any = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state && nav.extras.state['result']) {
      this.evaluation = nav.extras.state['result'];
    }
  }

  ngOnInit(): void {
    if (!this.evaluation) {
      if (history.state && history.state.result) {
        this.evaluation = history.state.result;
      } else {
        // Fallback if accessed directly
        this.router.navigate(['/mock-tests']);
      }
    }
  }

  getScoreColorClass(): string {
    if (!this.evaluation) return 'warn-text';
    if (this.evaluation.score >= 80) return 'success-text';
    if (this.evaluation.score >= 60) return 'accent-text';
    return 'warn-text';
  }
}
