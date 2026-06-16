import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface JobMatchResponse {
  success: boolean;
  data: any[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) { }

  getJobs(skills: string[], location: string = ''): Observable<JobMatchResponse> {
    let params = new HttpParams();
    if (skills && skills.length > 0) {
      params = params.set('skills', skills.join(','));
    }
    if (location) {
      params = params.set('location', location);
    }
    return this.http.get<JobMatchResponse>(this.apiUrl, { params });
  }
}
