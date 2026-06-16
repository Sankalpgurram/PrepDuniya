import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StartInterviewResponse {
  success: boolean;
  data: {
    questions: string[];
  };
}

export interface NextInterviewResponse {
  success: boolean;
  data: {
    feedback: string;
    next_question: string;
  };
}

export interface SubmitInterviewResponse {
  success: boolean;
  data: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    improvement: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = `${environment.apiUrl}/interview`;

  constructor(private http: HttpClient) { }

  startInterview(company: string, role: string, type: 'technical' | 'hr'): Observable<StartInterviewResponse> {
    return this.http.post<StartInterviewResponse>(`${this.apiUrl}/start`, { company, role, type });
  }

  nextQuestion(previous_question: string, user_answer: string, company: string, role: string): Observable<NextInterviewResponse> {
    return this.http.post<NextInterviewResponse>(`${this.apiUrl}/next`, { previous_question, user_answer, company, role });
  }

  submitInterview(questions: string[], answers: string[], company: string, role: string, type: 'technical' | 'hr'): Observable<SubmitInterviewResponse> {
    return this.http.post<SubmitInterviewResponse>(`${this.apiUrl}/submit`, { questions, answers, company, role, type });
  }
}
