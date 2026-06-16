import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = `${environment.apiUrl}/resume`;

  constructor(private http: HttpClient) { }

  analyzeResume(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('resume', file);

    return this.http.post<any>(`${this.apiUrl}/analyze`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}