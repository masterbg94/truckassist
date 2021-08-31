import {AfterViewInit, Component, HostListener, OnInit, OnDestroy, Renderer2} from '@angular/core';

import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import {SharedService} from './core/services/shared.service';
import {Subject} from 'rxjs';
import {RoutingFullscreenService} from './core/services/routing-fullscreen.service';
import moment from 'moment';
import {AuthenticationService} from './core/services/authentication.service';
import {CustomModalService} from './core/services/custom-modal.service';
import {CommunicatorUserService} from './core/services/communicator-user.service';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  private destroy$: Subject<void> = new Subject<void>();
  previewPdfActive = false;
  previewImgActive = false;
  lowResMode = false;
  imgSource: any;
  fileExt = '';
  daysLeft;
  today = new Date();

  trialVisible = false;
  fixedHeader = false;
  userCompany;
  companySubscribed;
  companyTrialExpired;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private titleService: Title,
    private mapModeServise: RoutingFullscreenService,
    private auth: AuthenticationService,
    private modalService: CustomModalService,
    private communicatorUserService: CommunicatorUserService,
    private idle: Idle,
    private renderer: Renderer2
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route: any) => {
          while (route.firstChild) {
            route = route.firstChild;
          }

          setTimeout(() => {
            const magicLineWrapper = document.getElementById('magicLineInner');
            const activeLink = magicLineWrapper?.querySelector('a.is-active.active');
            if (activeLink == null && (document.getElementById('magicLine') !== null)) {
              document.getElementById('magicLine').remove();
              document.getElementById('navbar-container').classList.remove('magic-line-active');
            } else {
              if (document.getElementById('magicLine') == null) {
                this.sharedService.emitMagicLine.emit(true);
              }
            }
          }, 750);

          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route: any) => route.data)
      )
      .subscribe((event: any) => {
        this.titleService.setTitle(event.title);
        const user = JSON.parse(localStorage.getItem('currentUser'));
        // TODO check also if user is on trial from User response (future).
        this.trialVisible = (this.router.url.includes('applicant') || user == undefined || user == null) ? false : true;
      });
  }

  ngOnInit() {
    if (localStorage.getItem('userCompany') != null) {
      this.getCompanySubscription();
    }

    this.configureIdle();
    this.lowResMode = (window.innerWidth < 1261) ? true : false;
    this.sharedService.emitTogglePdf.subscribe((resp: any) => {
      this.previewPdfActive = resp;
    });
    document.addEventListener('scroll', this.scroll, true);
    window.addEventListener('resize', this.resize, true);

    this.mapModeServise.currentMapMode
    .pipe(takeUntil(this.destroy$))
    .subscribe((mapMode: boolean) => {
      this.trialVisible = !mapMode;
    });

    this.auth.currentUser
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        if (res) {
          this.calculateDaysLeft();
          this.getCompanySubscription();
        }
      }
    );
    if (this.communicatorUserService.user?.status !== 'busy') {
      this.communicatorUserService.changeMyStatus('online');
    }
  }

  onDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.idle.stop();
    this.communicatorUserService.changeMyStatus('offline');
  }

  private configureIdle() {
    this.idle.setIdle(1);
    this.idle.setTimeout(3 * 60);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      if (this.communicatorUserService.user?.status !== 'busy') {
        if (!this.isUserInChat()) {
          if (this.communicatorUserService.user?.status !== 'online') {
            this.communicatorUserService.changeMyStatus('online');
          }
        } else {
          if (this.communicatorUserService.user?.status !== 'active') {
            this.communicatorUserService.changeMyStatus('active');
          }
        }
      }
      this.idle.watch();
    });

    this.idle.onTimeout
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      if (!['away', 'busy'].includes(this.communicatorUserService.user?.status)) {
        this.communicatorUserService.changeMyStatus('away');
      }
      this.idle.stop();
      this.idle.watch();

    });

    this.idle.watch();
  }

  scroll = (event): void => {
    if (event.target.nodeName == '#document') {
      if (this.trialVisible) {
        if (window.pageYOffset > 95) {
          this.fixedHeader = true;
        }
        if (window.pageYOffset <= 94.99) {
          this.fixedHeader = false;
        }
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const element = document.getElementById('trial-wrapper');
      if (typeof (element) != 'undefined' && element != null) {
        this.trialVisible = true;
      }
    }, 1000);
  }

  resize = (event): void => {
    window.scrollTo(window.pageXOffset, window.pageYOffset - 1);
    window.scrollTo(window.pageXOffset, window.pageYOffset + 1);
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    const clickParrent = e.srcElement.offsetParent?.className;
    if (
      clickParrent === undefined ||
      clickParrent.includes('k-editor') ||
      clickParrent.includes('k-picker-wrap') ||
      clickParrent.includes('k-button') ||
      clickParrent.includes('note-col') ||
      clickParrent.includes('dispacher-table') ||
      e.srcElement.className.includes('note-column') ||
      clickParrent.includes('type-accordion2') ||
      e.srcElement.offsetParent?.children[0]?.className?.includes('note-col')
    ) {
    } else {
      this.sharedService.emitCloseNote.emit(true);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const res = event.currentTarget.innerWidth;
    this.lowResMode = (res < 1260) ? true : false;
    const dropdownPanel = Array.from(document.getElementsByClassName('ng-dropdown-panel') as HTMLCollectionOf<HTMLElement>);
    const ngSelectF = document.getElementsByClassName('ng-select-opened')[0];
    let leftOffset;
    let topOffset;
    if (ngSelectF !== null && ngSelectF !== undefined) {
      leftOffset = ngSelectF.getBoundingClientRect().left;
      topOffset = ngSelectF.getBoundingClientRect().top + 26;
    }
    if (dropdownPanel !== null && dropdownPanel !== undefined && dropdownPanel.length > 0) {
      dropdownPanel[0].style.left = leftOffset.toString() + 'px';
      dropdownPanel[0].style.top = topOffset.toString() + 'px';
    }
  }

  calculateDaysLeft() {
    const accountCreated = JSON.parse(localStorage.getItem('userCompany')).createdAt;

    const result = moment(this.today).diff(moment(accountCreated), 'days');
    if (result < 0) {
      this.daysLeft = Math.abs(14 - result);
    } else {
      this.daysLeft = 14 - result;
      if (this.daysLeft < 0) {
        /* setTimeout(() => {
          this.modalService.openModal(ExpiredNewModalComponent, null , null , { size: 'expired' });
        } , 3000); */
      }
    }
  }

  private isUserInChat() {
    return this.router.url.includes('communicator');
  }

  getCompanySubscription() {
    this.userCompany = JSON.parse(localStorage.getItem('userCompany'));
    this.companySubscribed = this.userCompany?.subscribed;
    this.companyTrialExpired = this.userCompany?.trialExpired;
    this.setProgressColor();
  }

  setProgressColor() {
    setTimeout(() => {
      const progressChange = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLElement>;
      if (this.companySubscribed == 0) {
        this.renderer.addClass(progressChange[0], 'expiration-banner');
      } else {
        if (progressChange[0].classList.contains('expiration-banner')) {
          this.renderer.removeClass(progressChange[0], 'expiration-banner');
        }
      }
    });
  }
}
