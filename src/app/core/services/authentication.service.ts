import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification-service.service';
import { environment } from 'src/environments/environment';
import { CommunicatorUserService } from './communicator-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;


  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService,
    private communicatorUserService: CommunicatorUserService
    // private communicatorUserDataService: CommunicatorUserDataService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Register user function
   *
   * @param data any
   */
  public registerUser(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'user/register', data);
  }

  /**
   * Get current user value function
   */
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   * User login function
   *
   * @param data Any
   */
  public userLogin(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'user/login', data).pipe(
      map((user: any) => {
        const { userType, companyId } = user.loggedUser;
        if (userType && (userType === 'company_owner' || userType === 'admin')) {
          this.http.post(environment.baseChatApiUrl + '/access', { companyId, token: `Bearer ${user.token}` }).subscribe(() => {});
        }
        localStorage.setItem('currentUser', JSON.stringify(user.loggedUser));
        localStorage.setItem('token', JSON.stringify(user.token));
        localStorage.setItem('userCompany', JSON.stringify(user.userCompany));
        this.communicatorUserService.requestChatUserData(user.loggedUser.companyId, user.loggedUser.id);
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  /**
   * Logout function
   */
  public logout() {
    this.currentUserSubject.next(null);
    this.communicatorUserService.changeMyStatus('offline');
    this.communicatorUserService.removeChatUserData();
    return this.http.get(environment.API_ENDPOINT + 'user/logout');
  }

  /**
   * It gets common data.
   */
  public getReferenceData() {
    this.notification.warning('WIP: Reference data');
  }

  public checkVerification(hashedUsername, code) {
    return this.http.get(environment.API_ENDPOINT + `user/verify/${hashedUsername}/${code}`);
  }

  public passwordStart(hashedUsername, id) {
    return this.http.get(environment.API_ENDPOINT + `user/set/password/start/${hashedUsername}/${id}`);
  }

  public setConfirmPassword(id, data) {
    return this.http.put(environment.API_ENDPOINT + `user/password/set/${id}`, data);
  }

  // send email
  public requestResetPassword(data) {
    return this.http.put(environment.API_ENDPOINT + `user/password/forgot`, data);
  }

  // can user set the pass
  public checkResetPassword(hashedUsername, code) {
    return this.http.get(environment.API_ENDPOINT + `user/password/request/${hashedUsername}/${code}`);
  }

  // send new password data / temporary headers
  public updateResetPassword(data) {
    // const resetToken = JSON.parse(localStorage.getItem('resetPasswordToken'));
    const resetToken = localStorage.getItem('resetPasswordToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + resetToken
      })
    };
    return this.http.put(environment.API_ENDPOINT + `user/password/reset`, data , httpOptions );
  }
}
