import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { UserProfile } from '../model/user-profile';

@Injectable({
  providedIn: 'root',
})
export class AppUserService {
  private newUser = new Subject<void>();
  private updatedUserSubject = new Subject<UserProfile>();
  public reloadUserTabel: boolean;

  constructor(private http: HttpClient) {}

  get createNewUser() {
    return this.newUser;
  }

  get updatedUser() {
    return this.updatedUserSubject;
  }

  // v2 ////////////////////////////////////////////////////////////////////////
  public createUser(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'user/create', data).pipe(
      tap(() => {
        this.newUser.next();
      })
    );
  }

  public getUsersList() {
    /* return this.http.get(environment.API_ENDPOINT + 'user/list/1/' + environment.perPage); */
    return this.http.get(environment.API_ENDPOINT + 'company/user/list/1/' + environment.perPage);
  }

  public updateUser(id: any, data: any): Observable<UserProfile> {
    return this.http.put<UserProfile>(environment.API_ENDPOINT + `user/id/${id}`, data).pipe(
      tap(() => {
        // localStorage.setItem('currentUser', JSON.stringify(userData));
        this.updatedUserSubject.next(data);
      })
    );
  }

  public getUserByUsername(username: string) {
    return this.http.get(environment.API_ENDPOINT + `user/username/${username}`);
  }

  public deleteUser(userId: number) {
    return this.http.delete(environment.API_ENDPOINT + `user/delete/${userId}`);
  }

}
