import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicatorMiniComponent } from './communicator-mini.component';
import { SharedModule } from '@progress/kendo-angular-dialog';
import { CommunicatorModule } from '../communicator/communicator.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ChatSocket } from '../core/sockets/chat-socket.service';
import { NotificationSocket } from '../core/sockets/notification-socket.service';
import { CommunicatorService } from '../core/services/communicator.service';
import { CommunicatorNotificationService } from '../core/services/communicator-notification.service';
import { UserSocket } from '../core/sockets/user-socket.service';
import { CommunicatorUserService } from '../core/services/communicator-user.service';

@NgModule({
  declarations: [CommunicatorMiniComponent],
  imports: [
    SharedModule,
    CommonModule,
    CommunicatorModule,
    AngularSvgIconModule.forRoot()
  ],
  exports: [CommunicatorMiniComponent],
  providers: [
    ChatSocket,
    NotificationSocket,
    UserSocket,
    CommunicatorUserService,
    CommunicatorService,
    CommunicatorNotificationService
  ]
})
export class CommunicatorMiniModule { }
