import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InterviewService } from '../../../core/services/interview.service';

@Component({
  selector: 'app-technical-interview',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: './technical-interview.component.html',
  styleUrl: './technical-interview.component.css'
})
export class TechnicalInterviewComponent implements OnInit, OnDestroy {
  company: string = '';
  role: string = 'Software Engineer';
  type: 'technical' = 'technical';
  
  questions: string[] = [];
  answers: string[] = [];
  currentIndex: number = 0;
  currentAnswer: string = '';
  
  isLoading: boolean = true;
  isEvaluating: boolean = false;
  errorMessage: string = '';

  timerVal: number = 180; // 3 minutes per question
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    this.company = this.route.snapshot.paramMap.get('company') || '';
    if (this.company) {
      this.startInterviewSession();
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startInterviewSession() {
    this.isLoading = true;
    this.interviewService.startInterview(this.company, this.role, this.type).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data && res.data.questions) {
          this.questions = res.data.questions;
          this.answers = new Array(this.questions.length).fill('');
          this.startTimer();
        } else {
          this.errorMessage = 'Failed to generate questions. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred starting the interview.';
        console.error(err);
      }
    });
  }

  startTimer() {
    this.timerVal = 180;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timerVal--;
      if (this.timerVal <= 0) {
        this.nextQuestion();
      }
    }, 1000);
  }

  get formattedTime() {
    const m = Math.floor(this.timerVal / 60);
    const s = this.timerVal % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  nextQuestion() {
    this.answers[this.currentIndex] = this.currentAnswer;
    
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.currentAnswer = this.answers[this.currentIndex];
      this.startTimer();
    } else {
      this.submitInterview();
    }
  }

  submitInterview() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isEvaluating = true;
    
    this.interviewService.submitInterview(this.questions, this.answers, this.company, this.role, this.type).subscribe({
      next: (res) => {
        this.isEvaluating = false;
        if (res.success) {
          // Pass the evaluation data to the result component via Router state
          this.router.navigate(['/mock-tests/result'], { state: { result: res.data } });
        } else {
          this.errorMessage = 'Failed to evaluate answers.';
        }
      },
      error: (err) => {
        this.isEvaluating = false;
        this.errorMessage = 'Evaluation process failed.';
        console.error(err);
      }
    });
  }
}
