import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, map, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

  private loadUserFromToken() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      if (this.isTokenExpired(token)) {
         this.logout();
      } else {
         try {
           const decoded = jwtDecode(token);
           this.currentUserSubject.next(decoded);
         } catch(e) {
           this.logout();
         }
      }
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp === undefined) return false;
      const date = new Date(0); 
      date.setUTCSeconds(decoded.exp);
      return date.valueOf() < new Date().valueOf();
    } catch (err) {
      return true;
    }
  }

  isLoggedIn(): boolean {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  signup(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/signup`, userData).pipe(
      tap(response => {
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          this.loadUserFromToken();
        }
      })
    );
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          this.loadUserFromToken();
        }
      })
    );
  }

  googleLogin(credential: string) {
    return this.http.post<any>(`${this.apiUrl}/google`, { credential }).pipe(
      tap(response => {
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          this.loadUserFromToken();
        }
      })
    );
  }

  getProfile() {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.getValue();
  }

  logout() {
    if (typeof window !== 'undefined') {
       localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
