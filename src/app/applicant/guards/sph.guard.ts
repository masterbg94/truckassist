import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services/notification-service.service';
import { ApplicantStore } from '../service/applicant.service';

@Injectable({
  providedIn: 'root',
})
export class SphGuard implements CanActivate {
  doneSPH: any;
  constructor(private store: ApplicantStore, private notification: NotificationService) {
    this.store.isDoneSPH.subscribe((val) => {
      this.doneSPH = val;
      console.log(val);
    });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.store.getForm('SPH') === null) {
      // this.notification.warning('You have not completed the Safety Performance History','Warning: ')
      return false;
    }
    return true;
  }
}
