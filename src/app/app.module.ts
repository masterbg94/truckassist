import { CommunicatorModule } from './communicator/communicator.module';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './base.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './core/services/authentication.service';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

// import * as Sentry from '@sentry/browser';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { RoutingComponent } from './routing/routing.component';
import { GpsComponent } from './gps/gps.component';
import { GoogleMapsAPIWrapper } from '@agm/core';

import { CommunicatorToastMessageComponent } from './communicator-toast-message/communicator-toast-message.component';
import { MilesComponent } from './miles/miles.component';
import { MarkersComponent } from './routing/markers/markers.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AngularResizedEventModule} from 'angular-resize-event';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { CommunicatorMiniModule } from './communicator-mini/communicator-mini.module';
import { NotificationSocket } from './core/sockets/notification-socket.service';
import { ChatSocket } from './core/sockets/chat-socket.service';
import { CommunicatorNotificationService } from './core/services/communicator-notification.service';
import { CommunicatorService } from './core/services/communicator.service';
import { CommunicatorUserDataService } from './core/services/communicator-user-data.service';
import { CommunicatorUserService } from './core/services/communicator-user.service';
import { UserSocket } from './core/sockets/user-socket.service';
import { GalleryComponent } from './communicator/gallery/gallery.component';

import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { RootStoreModule } from './root-store/root-store.module';
import { SocketIoModule } from 'ngx-socket-io';
import { Tax2290Module } from './tax2290/tax2290.module';
/*
Sentry.init({
  dsn: "https://f802351b524b497d879ce3e40bb21110@o389757.ingest.sentry.io/5228859"
  //,
  //integrations: [new Sentry.Integrations.Breadcrumbs({ console: false, dom:false })]
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
  }
}
*/
@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    RoutingComponent,
    GpsComponent,
    CommunicatorToastMessageComponent,
    MilesComponent,
    MarkersComponent,
    GalleryComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    HammerModule,
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    PickerModule,
    AngularResizedEventModule,
    InfiniteScrollModule,
    CommunicatorMiniModule,
    CommunicatorModule,
    SocketIoModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    YouTubePlayerModule,
    RootStoreModule,
    Tax2290Module
  ],
  providers: [
    AuthenticationService,
    GoogleMapsAPIWrapper,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
    },
    NotificationSocket,
    ChatSocket,
    UserSocket,
    CommunicatorUserService,
    CommunicatorNotificationService,
    CommunicatorService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
