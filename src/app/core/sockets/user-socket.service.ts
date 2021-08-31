import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserSocket extends Socket {

  constructor() {
    super({
      url: `${environment.baseSocketUrl}/users`,
      options: {
        withCredentials: false
      }
    });
  }

}
