import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services/notification-service.service';
import { ApplicantStore } from '../service/applicant.service';

@Injectable({
  providedIn: 'root',
})
export class HosGuard implements CanActivate {
  doneHOS: any;
  constructor(private store: ApplicantStore, private notification: NotificationService) {
    this.store.isDoneHOS.subscribe((val) => {
      this.doneHOS = val;
    });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.store.getForm('hos-rules') === null) {
      // this.notification.warning('You have not completed the HOS','Warning')
      return false;
    }
    return true;
  }
}
