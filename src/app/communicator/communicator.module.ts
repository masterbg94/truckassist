import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicatorComponent } from './communicator.component';
import { NumberOfMessagesPipe } from './number-of-messages/number-of-messages.pipe';
import { ChannelItemComponent } from '../communicator/channel-item/channel-item.component';
import { DirectItemComponent } from '../communicator/direct-item/direct-item.component';
import { ReceiverMessageComponent } from './message-group/receiver-message-list/reciever-message/receiver-message.component';
import { SenderMessageComponent } from './message-group/sender-message-list/sender-message/sender-message.component';
import { MessageGroupComponent } from '../communicator/message-group/message-group.component';
import { CommunicatorRoutingModule } from './communicator-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SenderMessageListComponent } from './message-group/sender-message-list/sender-message-list.component';
import { ReceiverMessageListComponent } from './message-group/receiver-message-list/receiver-message-list.component';
import { ChatSearchComponent } from './chat-search/chat-search.component';
import { ReactionComponent } from './message-group/reaction/reaction.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ChatEmojiComponent } from './chat-emoji/chat-emoji.component';
import { ScrollFixDirective } from './chat-directives/ScrollFix.directive';
import { MessageAttachmentComponent } from './message-attachment/message-attachment.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageAttachmentThumbComponent } from './message-attachment-thumb/message-attachment-thumb.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { DragDropFileDirective } from './chat-directives/dragDropFile.directive';
import { ChatSocket } from '../core/sockets/chat-socket.service';
import { NotificationSocket } from '../core/sockets/notification-socket.service';
import { CommunicatorNotificationService } from '../core/services/communicator-notification.service';
import { CommunicatorService } from '../core/services/communicator.service';
import { CommunicatorUserService } from '../core/services/communicator-user.service';
import { UserSocket } from '../core/sockets/user-socket.service';
import { ChatUserInfoComponent } from './chat-user-info/chat-user-info.component';
import { ChatContentInfoComponent } from './chat-user-info/chat-content-info/chat-content-info.component';
import { ChatContentPreviewComponent } from './chat-user-info/chat-content-preview/chat-content-preview.component';
import { LinkComponent } from './link/link.component';
import { ChatVideoPreviewComponent } from './chat-video-preview/chat-video-preview.component';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { ChatChannelActionsComponent } from './chat-channel-actions/chat-channel-actions.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ChatSearchContainerComponent } from './chat-search-container/chat-search-container.component';
@NgModule({
  declarations: [
    CommunicatorComponent,
    NumberOfMessagesPipe,
    ChannelItemComponent,
    DirectItemComponent,
    SenderMessageComponent,
    ReceiverMessageComponent,
    SenderMessageListComponent,
    ReceiverMessageListComponent,
    MessageGroupComponent,
    ChatSearchComponent,
    ReactionComponent,
    ChatEmojiComponent,
    ScrollFixDirective,
    MessageAttachmentComponent,
    MessageAttachmentThumbComponent,
    ChatContainerComponent,
    DragDropFileDirective,
    ChatUserInfoComponent,
    ChatContentInfoComponent,
    ChatContentPreviewComponent,
    LinkComponent,
    ChatVideoPreviewComponent,
    ChatChannelActionsComponent,
    ChatSearchContainerComponent,
  ],
  providers: [
    NgbActiveModal,
    ChatSocket,
    NotificationSocket,
    UserSocket,
    CommunicatorUserService,
    CommunicatorService,
    CommunicatorNotificationService,
  ],
  imports: [
    CommonModule,
    CommunicatorRoutingModule,
    SharedModule,
    PickerModule,
    AngularResizedEventModule,
    InfiniteScrollModule,
    NgxDocViewerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    YouTubePlayerModule,
    LayoutModule
  ],
  exports: [ChatSearchComponent, ChatSearchContainerComponent, DirectItemComponent, ChannelItemComponent, ChatContainerComponent, ChatVideoPreviewComponent, ChatChannelActionsComponent, DragDropFileDirective],
  entryComponents: [],
})
export class CommunicatorModule {}
