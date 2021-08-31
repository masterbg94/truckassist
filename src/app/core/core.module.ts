import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { SocketIoModule } from 'ngx-socket-io';
import { SharedModule } from '../shared/shared.module';
import { AppHeaderComponent } from './app-header/app-header.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';

import { SidebarComponent } from './app-header/sidebar/sidebar.component';
import { MaintenanceService } from './services/maintenance.service';
import { SortPipe } from './pipes/sort.pipe';
import { NoteSidebarComponent } from './app-header/note-sidebar/note-sidebar.component';
import { NoteSidebarContentsComponent } from './app-header/note-sidebar/note-sidebar-contents/note-sidebar-contents.component';
import { CommunicatorNotificationService } from './services/communicator-notification.service';
import { NotificationSocket } from './sockets/notification-socket.service';
import { ChatSocket } from './sockets/chat-socket.service';
import { CommunicatorService } from './services/communicator.service';
import { CommunicatorUserDataService } from './services/communicator-user-data.service';
import { CommunicatorUserService } from './services/communicator-user.service';
import { UserSocket } from './sockets/user-socket.service';
import { ExtendedTableHeaderComponent } from './extended-table-header/extended-table-header.component';
import { NavbarDropdownComponent } from './app-header/navbar-dropdown/navbar-dropdown.component';

@NgModule({
  declarations: [
    AppHeaderComponent,
    ExtendedTableHeaderComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    AuthenticationComponent,
    ImageCropperComponent,
    SpinnerComponent,
    SidebarComponent,
    SortPipe,
    NoteSidebarComponent,
    NoteSidebarContentsComponent,
    NavbarDropdownComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    NgIdleKeepaliveModule.forRoot(),
    SocketIoModule
  ],
  exports: [
    AppHeaderComponent,
    ExtendedTableHeaderComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    AuthenticationComponent,
    ImageCropperComponent,
    SpinnerComponent,
  ],
  providers: [
    MaintenanceService,
    SortPipe,
    ChatSocket,
    NotificationSocket,
    UserSocket,
    CommunicatorUserService,
    CommunicatorNotificationService,
    CommunicatorService
  ],
})
export class CoreModule {}
