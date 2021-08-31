import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services/notification-service.service';
import { ApplicantStore } from '../service/applicant.service';

@Injectable({
  providedIn: 'root',
})
export class MvrGuard implements CanActivate {
  doneMVR: any;
  constructor(private store: ApplicantStore, private notification: NotificationService) {
    this.store.isDoneMVR.subscribe((val) => {
      this.doneMVR = val;
      console.log(val);
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.store.getForm('mvrAuth') === null) {
      // this.notification.warning('You have not completed the mvr authorization','Warning: ')
      return false;
    }
    return true;
  }
}
