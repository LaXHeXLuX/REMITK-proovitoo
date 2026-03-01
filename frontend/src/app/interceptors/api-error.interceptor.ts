import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  constructor(private notif: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'API request failed';
        this.notif.showError(`Request failed: ${msg}`);
        return throwError(() => err);
      })
    );
  }
}
