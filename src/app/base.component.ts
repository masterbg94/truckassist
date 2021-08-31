import { CommunicatorHelpersService } from './core/services/communicator-helpers.service';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { GridCompression, GridCompressionService } from './core/services/grid-compression.service';
import { RoutingFullscreenService } from './core/services/routing-fullscreen.service';
import { animate, style, transition, trigger, keyframes, state } from '@angular/animations';
import { CommunicatorNotificationService } from './core/services/communicator-notification.service';
import { CommunicatorUserDataService } from './core/services/communicator-user-data.service';
import { GalleryService } from './core/services/gallery.service';
import { AppUserService } from 'src/app/core/services/app-user.service';
import { UserProfile } from 'src/app/core/model/user-profile';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  animations: [
    trigger('scrollButtonAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.6)' }),
        animate('200ms', style({ transform: 'scale(0.8)' })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(0.8)' }),
        animate('200ms', style({ transform: 'scale(0.6)' })),
      ]),
    ]),
  ],
})
export class BaseComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public expanded = false;
  public showScrollButton = false;
  public scrollConfig = {
    suppressScrollX: false,
    suppressScrollY: false,
  };
  public pathsForToolApp = [
    { path: '/tools/gpstracking' },
    { path: '/tools/contacts' },
    { path: '/tools/miles' },
    { path: '/tools/mvr' },
    { path: '/tools/reports' },
    { path: '/tools/todo' },
    { path: '/tools/calendar' },
    { path: '/tools/statistics' },
    { path: '/tools/factoring' },
    { path: '/tools/routing' },
    { path: '//tools/accounts' },
  ];
  mapFullScreen: boolean;
  private toastSubscription: Subscription;
  toastMessages: any[] = [];

  toastTimeouts: any[] = [];
  noHoverTimeout: any;

  private hoverId?: string = null;

  private currentUserStatus?: string;

  isGalleryVisible = false;

  currentUser: any;

  isDragOverAttachment: boolean = false;

  constructor(
    config: NgbModalConfig,
    private gridCompressionService: GridCompressionService,
    public router: Router,
    private mapModeServise: RoutingFullscreenService,
    private communicatorNotificationService: CommunicatorNotificationService,
    private userService: AppUserService,
    private communicatorUserDataService: CommunicatorUserDataService,
    private communicatorHelpersService: CommunicatorHelpersService,
    private shared: SharedService,
    private galleryService: GalleryService,
    private changeRef: ChangeDetectorRef
  ) {
    config.backdrop = false;
  }

  ngOnInit() {
    // const scroll = document.getElementById('scrollTop');
    this.getUserData();
    window.onscroll = () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        // scroll.style.display = 'block';
        this.showScrollButton = true;
      } else {
        // scroll.style.display = 'none';
        this.showScrollButton = false;
      }
    };

    this.gridCompressionService.currentDataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: GridCompression) => {
        if (data && data.checked) {
          this.expanded = data.expanded;
          this.changeRef.detectChanges();
        }
      });

    this.mapModeServise.currentMapMode
      .pipe(takeUntil(this.destroy$))
      .subscribe((mapMode: boolean) => {
        this.mapFullScreen = mapMode;
      });

    this.galleryService.galleryVisibility
      .pipe(takeUntil(this.destroy$))
      .subscribe((visibility: boolean) => (this.isGalleryVisible = visibility));

    this.communicatorUserDataService.chatUser
      .pipe(takeUntil(this.destroy$))
      .subscribe((chatUser: any) => setTimeout(() => (this.currentUserStatus = chatUser?.status)));

    this.communicatorNotificationService.allowToastMessages();
    this.toastSubscription = this.communicatorNotificationService
      .onToastReceived()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: { type: string; data: any }) => {
        if (this.currentUserStatus !== 'busy' && this.toastMessages.length < 5) {
          this.toastMessages.push(res);

          if (this.hoverId === null) {
            const timeout = setTimeout(() => {
              this.closeToastMessage(res.data.id);
            }, 3000);

            this.toastTimeouts.push({
              id: res.data.id,
              timeout,
            });
          }
        }
      });
  }

  ngOnDestroy() {
    this.communicatorNotificationService.disallowToastMessages();
    this.toastSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.communicatorNotificationService?.disallowToastMessages();
  }

  private removeToast(id: string) {
    const removeIndex = this.toastMessages.findIndex((item) => item.data.id === id);
    if (removeIndex !== -1) {
      this.toastMessages.splice(removeIndex, 1);
    }
  }

  private removeTimeout(id: string) {
    const removeTimeoutIndex = this.toastTimeouts.findIndex((item) => item.id === id);
    if (removeTimeoutIndex !== -1) {


        clearTimeout(this.toastTimeouts[removeTimeoutIndex].timeout);
        this.toastTimeouts.splice(removeTimeoutIndex, 1);


    }
  }

  closeToastMessage(id: string) {
    document.getElementById('toast').classList.add('toast-expired')
    setTimeout(() => {
      this.removeToast(id);
      this.removeTimeout(id);
    },300)

  }

  hoverToastMessage(id: string) {
    this.hoverId = id;

    if (this.noHoverTimeout) {
      clearTimeout(this.noHoverTimeout);
    }

    this.createMissingTimeouts();

    const index = this.toastMessages.findIndex((item) => item.data.id === this.hoverId);

    if (index !== -1) {
      const removeTimeoutIds = this.toastMessages
        .filter((item, i) => i >= index)
        .map((item) => item.data.id);

      for (const removeTimeoutId of removeTimeoutIds) {
        this.removeTimeout(removeTimeoutId);
      }
    }
  }

  private createMissingTimeouts() {
    const timeoutIds = this.toastTimeouts.map((item) => item.id);

    const missingToastTimeoutIds = this.toastMessages
      .filter((item) => !timeoutIds.includes(item.data.id))
      .map((item) => item.data.id);

    for (let i = 0; i < missingToastTimeoutIds.length; i++) {
      const timeout = setTimeout(() => {
        this.closeToastMessage(missingToastTimeoutIds[i]);
      }, 3000 * (i + 1));

      this.toastTimeouts.push({
        id: missingToastTimeoutIds[i],
        timeout,
      });
    }
  }

  @HostListener('document:mousemove', ['$event'])
  public onMouseMove(target) {
    if (target.pageX < 200) {
      document.getElementById('noteSidebar') &&
        document.getElementById('noteSidebar').classList.add('active');
    } else if (window.innerWidth - target.pageX < 200) {
      document.getElementById('mySidebar') &&
        document.getElementById('mySidebar').classList.add('active');
    } else {
      document.getElementById('mySidebar') &&
        document.getElementById('mySidebar').classList.remove('active');

      document.getElementById('noteSidebar') &&
        document.getElementById('noteSidebar').classList.remove('active');
    }
  }

  noHoverToastMessage(id: string) {
    if (this.noHoverTimeout) {
      clearTimeout(this.noHoverTimeout);
    }

    this.noHoverTimeout = setTimeout(() => {
      this.hoverId = null;
      this.createMissingTimeouts();
    }, 500);
  }

  /**
   * Top function
   */
  public top() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * On list scroll function
   */
  public onListScroll() {
    const scroll = document.getElementById('scrollTop');
    // TODO STEVAN
    /*
    hide and show button based on position of window
    */
  }

  /**
   * Reset back to top function
   */
  public resetBackToTop() {
    // const scroll = document.getElementById('scrollTop');
    // scroll.style.display = 'none';
    this.showScrollButton = false;
  }

  public getUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userService
      .getUserByUsername(currentUser.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (user: UserProfile) => {
          this.currentUser = user;
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
  }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDragOverAttachment = true;
    console.log('dragover')
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if(!evt.fromElement) {
      this.isDragOverAttachment = false;
    }
  }

  @HostListener('drop', ['$event']) public onDragDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDragOverAttachment = false;
  }

  onDragDropFile(files: FileList) {
    this.communicatorHelpersService.getUserDropBoxAttachment(files);
  }

  onDropBackground(event) {
    this.isDragOverAttachment = event;
  }
}
