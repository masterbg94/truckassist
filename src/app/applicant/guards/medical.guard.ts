import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services/notification-service.service';
import { ApplicantStore } from '../service/applicant.service';

@Injectable({
  providedIn: 'root',
})
export class MedicalGuard implements CanActivate {
  doneMedical: any;

  constructor(private store: ApplicantStore, private notification: NotificationService) {
    this.store.isDoneMEdical.subscribe((val) => {
      this.doneMedical = val;
    });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.store.getForm('medical-cert') === null) {
      // this.notification.warning('You have not completed the medical certification','Warning: ')
      return false;
    }
    return true;
  }
}
