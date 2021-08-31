import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { NotificationService } from 'src/app/services/notification-service.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notification: NotificationService,
  ) {
  }

  canActivate() {
    const currentUser = this.authenticationService.currentUserValue;
    const token = JSON.parse(localStorage.getItem('token'));
    if (currentUser && (
      token !== undefined &&
      token !== null &&
      token !== ''
    )) {
      // TODO HANDLE ROLES SOMETIMES
      return true;
    }
    this.router.navigate(['/login']);
    this.notification.warning('Access forbidden, please contact administrator.', 'Warning:');
    return false;
  }
}
