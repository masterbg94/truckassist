import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = JSON.parse(localStorage.getItem('token'));
    if (request.url.includes('/api/v2/')) {
      if (token !== undefined && token !== '' && token !== null) {
        request = request.clone({
          setHeaders: {
            api_key: '1234',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        });
      } else {
        this.authService.logout();
      }
    }
    return next.handle(request);
  }
}
