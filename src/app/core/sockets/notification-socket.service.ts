import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable()
export class NotificationSocket extends Socket {

  constructor() {
    super({
      url: `${environment.baseSocketUrl}/notifications`,
      options: {
        withCredentials: false
      }
    });
  }

}
