import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  public unreadCount = signal<number>(0);

  constructor(private http: HttpClient) {
    // Poll for notifications every 30 seconds
    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.getNotifications())
    ).subscribe(res => {
      if (res.success) {
        const unread = res.data.filter((n: any) => !n.is_read).length;
        this.unreadCount.set(unread);
      }
    });
  }

  getNotifications(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/read-all`, {});
  }
}
