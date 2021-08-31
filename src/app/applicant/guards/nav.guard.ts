import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services/notification-service.service';
import { ApplicantStore } from '../service/applicant.service';

@Injectable({
  providedIn: 'root',
})
export class NavGuard implements CanActivate {
  counter = 0;
  constructor(
    private store: ApplicantStore,
    private router: Router,
    private notification: NotificationService,
    private actRoute: ActivatedRoute
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (
      (this.store.getStepCounter() < 11 && this.counter === 0) ||
      this.store.getStepCounter() === null
    ) {
      this.counter = 0;
      this.router.createUrlTree(['application'], { relativeTo: this.actRoute });
      //  this.notification.warning('You have not completed the application part','Warning')
    } else {
      if (this.store.getStepCounter() === 12) {
        this.counter = 12;
        return;
      }
      return true;
    }
  }
}
