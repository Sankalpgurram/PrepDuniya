import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodingService {
  private apiUrl = `${environment.apiUrl}/coding`;

  constructor(private http: HttpClient) {}

  getProblems(difficulty?: string): Observable<any> {
    let params = new HttpParams();
    if (difficulty && difficulty !== 'all') {
      params = params.set('difficulty', difficulty);
    }
    return this.http.get(`${this.apiUrl}/problems`, { params });
  }

  getProblem(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/problems/${id}`);
  }

  submitCode(problem_id: number, language: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, { problem_id, language, code });
  }

  getLeaderboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaderboard`);
  }

  getHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`);
  }
}
