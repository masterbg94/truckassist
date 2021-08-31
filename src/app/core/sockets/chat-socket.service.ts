import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable()
export class ChatSocket extends Socket {

  constructor() {
    super({
      url: `${environment.baseSocketUrl}/chats`,
      options: {
        withCredentials: false
      }
    });
  }

}
