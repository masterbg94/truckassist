import { takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { ChangePasswordComponent } from 'src/app/core/authentication/change-password/change-password.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { AuthenticationService } from '../services/authentication.service';
import { DriverManageComponent } from 'src/app/driver/driver-manage/driver-manage.component';
import { TruckManageComponent } from 'src/app/truck/truck-manage/truck-manage.component';
import { Router } from '@angular/router';
import { GridCompression, GridCompressionService } from '../services/grid-compression.service';
import { ManageLoadComponent } from 'src/app/load/manage-load/manage-load.component';
import { MaintenanceManageComponent } from 'src/app/repairs/maintenance-manage/maintenance-manage.component';
import { SharedService } from 'src/app/core/services/shared.service';
import { OwnerManageComponent } from 'src/app/owners/owner-manage/owner-manage.component';
import { Subject } from 'rxjs';
import { AppUserService } from 'src/app/core/services/app-user.service';
import { TrailerManageComponent } from 'src/app/trailer/trailer-manage/trailer-manage.component';
import { CompanyUserManageComponent } from 'src/app/company/app-company-user/company-user-manage/company-user-manage.component';
import { AppSharedService } from '../services/app-shared.service';
import { AccountsManageComponent } from '../../accounts/accounts-manage/accounts-manage.component';
import { ContactManageComponent } from '../../contact/contact-manage/contact-manage.component';
import { TodoManageComponent } from '../../todo/todo-manage/todo-manage.component';
import { CustomerManageComponent } from 'src/app/customer/customer-manage/customer-manage.component';
import { ShipperManageComponent } from 'src/app/customer/shipper-manage/shipper-manage.component';
import { UserProfile } from '../model/user-profile';
import { FuelManageComponent } from './../../accounting/fuel-manage/fuel-manage.component';
import { RoutingFullscreenService } from '../services/routing-fullscreen.service';
import { RepairShopManageComponent } from 'src/app/shared/app-repair-shop/repair-shop-manage/repair-shop-manage.component';
import { CommunicatorNotificationService } from '../services/communicator-notification.service';
import { CommunicatorUserService } from '../services/communicator-user.service';
import { CommunicatorUserDataService } from '../services/communicator-user-data.service';
declare var $: any;
declare var magicLine;
declare var anime;

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() currentUser: UserProfile;
  private destroy$: Subject<void> = new Subject<void>();
  public isFullScreen = false;
  public expandInput = false;
  public userCompany: any;
  public company: any;
  public redCircleValue = 5;
  isActiveLinkSafety = false;

  // Chat messages
  unreadMessage = false;

  public menuItems: Array<{ route: string; name: string }> = [
    { route: '/dashboard', name: 'Dashboard' },
    { route: '/dispatcher', name: 'Dispatch' },
    { route: '/loads', name: 'Load' },
    { route: '/customers', name: 'Customer' },
    { route: '/drivers', name: 'Driver' },
    { route: '/trucks', name: 'Truck' },
    { route: '/trailers', name: 'Trailer' },
    { route: '/repairs', name: 'Repair' },
    { route: '/owners', name: 'Owner' },
    /*  { route: '/accounting', name: 'Accounting' }, */
    /*  { route: '/safety', name: 'Safety' }, */
  ];
  public searchCollapsed = true;
  // public showSubtitle = true;

  /* Sidebar variables */
  public showSideBar = false;

  /* Drop down variables */
  public showoptions = false;
  public showtooloptions = false;
  public changecolor = false;
  /*
  public options = [
    { option: 'Driver', path: 'driver' },
    { option: 'Trailer', path: 'trailer' },
    { option: 'Broker', path: 'broker' },
    { option: 'Contact', path: 'contact' },
    { option: 'Event', path: '' },
    { option: 'Owner', path: 'owner' },
    { option: 'Repair', path: 'repair' },
    { option: 'Credit', path: '' },
    { option: 'Bonus', path: '' },
    { option: 'Truck', path: 'truck' },
    { option: 'Load', path: 'load' },
    { option: 'Shipper', path: 'shipper' },
    { option: 'Account', path: 'account' },
    { option: 'Task', path: 'task' },
    { option: 'User', path: 'user' },
    { option: 'Shop', path: 'shop' },
    { option: 'Deduction', path: '' },
    { option: 'Fuel', path: 'fuel' },
  ]; */

  public options = [
    { option: 'Driver', path: 'driver' },
    { option: 'Trailer', path: 'trailer' },
    { option: 'Broker', path: 'broker' },
    { option: 'Truck', path: 'truck' },
    { option: 'Load', path: 'load' },
    { option: 'Shipper', path: 'shipper' },
  ];

  public secondOptions = [
    { option: 'Contact', path: 'contact' },
    { option: 'Event', path: '' },
    { option: 'Account', path: 'account' },
    { option: 'Task', path: 'task' },
  ];

  public thirdOptions = [
    { option: 'Owner', path: 'owner' },
    { option: 'User', path: 'user' },
  ];

  public fourthOptions = [
    { option: 'Repair', path: 'repair' },
    { option: 'Shop', path: 'shop' },
  ];

  public fiveOptions = [
    { option: 'Credit', path: '' },
    { option: 'Bonus', path: '' },
    { option: 'Deduction', path: '' },
    { option: 'Fuel', path: 'fuel' },
  ];

  trialVisible = true;
  daysLeft = 10;
  public proba = false;
  public counter = 0;
  public width = '0px';
  public isOpen: boolean;

  public paths = [
    { path: '/tools/contacts' },
    { path: '/tools/miles' },
    { path: '/tools/mvr' },
    { path: '/tools/reports' },
    { path: '/tools/todo' },
    { path: '/tools/calendar' },
    { path: '/tools/statistics' },
    { path: '/tools/factoring' },
    { path: '/tools/routing' },
    { path: '/tools/accounts' },
  ];

  pathsSafety = [
    { path: '/safety/accident' },
    { path: '/safety/violation' },
    { path: '/safety/log' },
    { path: '/safety/scheduled-insurance' },
  ];

  pathsAccounting = [
    { path: '/accounting/payroll' },
    { path: '/accounting/fuel' },
    { path: '/accounting/ifta' },
    { path: '/accounting/ledger' },
    { path: '/accounting/tax' },
  ];

  public isBlue = false;
  public avatarError = false;
  isAccountingLinkActive = false;

  currentUserStatus?: string;
  showSafetyOptions: boolean;
  showAccountingOptions: boolean;
  private unreadInterval: any;
  public loading = false;
  isMapFullScreen: boolean;
  userInfoDropDownOpened: boolean;
  switchCompanyActive: boolean;
  switchCompanyDropItems = [
    {companyName: 'JD Freight Inc'},
    {companyName: 'MLC Freight Inc'},
    {companyName: 'GG Freight Inc'}
  ]

  constructor(
    private authService: AuthenticationService,
    private customModalService: CustomModalService,
    public router: Router,
    private userService: AppUserService,
    private shared: SharedService,
    private sharedService: AppSharedService,
    private elementRef: ElementRef,
    private communicatorNotificationService: CommunicatorNotificationService,
    private mapModeServise: RoutingFullscreenService,
    private communicatorUserService: CommunicatorUserService,
    private communicatorUserDataService: CommunicatorUserDataService
  ) {
    this.router.events.subscribe((event) => {
      for (const path of this.paths) {
        if (this.router.url === path.path) {
          this.isBlue = true;
          break;
        } else {
          this.isBlue = false;
        }
      }

      for (const path of this.pathsSafety) {
        if (this.router.url === path.path) {
          this.isActiveLinkSafety = true;
          break;
        } else {
          this.isActiveLinkSafety = false;
        }
      }

      for (const path of this.pathsAccounting) {
        if (this.router.url === path.path) {
          this.isAccountingLinkActive = true;
          break;
        } else {
          this.isAccountingLinkActive = false;
        }
      }
    });
  }

  get changeStatusOption() {
    if (['online', 'active', 'away'].includes(this.communicatorUserService.user?.status)) {
      return 'busy';
    } else {
      if (this.isUserInChat()) {
        return 'active';
      } else {
        return 'online';
      }
    }
  }

  get userStatus() {
    return this.currentUserStatus;
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    this.showtooloptions = false;
    this.showSafetyOptions = false;
    this.showAccountingOptions = false;
    if (!clickedInside) {
      this.showoptions = false;
      this.changecolor = false;
      this.counter = 0;
    } else if (clickedInside) {
      if (this.counter === 1) {
        this.showoptions = false;
        this.counter = 0;
      }
      if (this.showoptions) {
        this.counter = 1;
      }
    }
  }

  ngOnInit() {
    this.userCompany = JSON.parse(localStorage.getItem('userCompany'));

    this.userService.updatedUser.pipe(takeUntil(this.destroy$)).subscribe((user: UserProfile) => {
      if (user.id === this.currentUser.id) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
      }
    });

    this.communicatorNotificationService
      .onHasUnreadSubscriptionsChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasUnread: boolean) => {
        this.unreadMessage = hasUnread;
      });

    this.communicatorNotificationService.trackHasUnreadSubscriptions();

    this.mapModeServise.currentMapModeSpecial
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isMapFullScreen = data;
      });

    this.userService.createNewUser.pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      }, 1000);
    });

    this.sharedService.updateOfficeFactoringSubject.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const currentUserJsonString = localStorage.getItem('currentUser');
      const { companyId } = JSON.parse(currentUserJsonString);
      this.sharedService.getCompany(companyId).subscribe((res) => {
        this.userCompany = { ...res };
      });
    });

    this.shared.emitMagicLine.pipe(takeUntil(this.destroy$)).subscribe((resp: boolean) => {
      if (resp) {
        this.handleMagicLine();
      }
    });

    this.communicatorUserDataService.chatUser
      .pipe(takeUntil(this.destroy$))
      .subscribe((chatUser: any) => {
        setTimeout(() => (this.currentUserStatus = chatUser?.status));
      });
  }

  ngAfterViewInit() {
    this.handleMagicLine();
  }

  public onCloseDrop() {
    console.log('onCloseDrop');
    this.counter = 0;
    this.showoptions = false;
    this.shared.notifyOther({ option: 'call_child', value: true });

    if (!document.getElementById('user_info_dropdown').classList.contains('show')) {
      this.userInfoDropDownOpened = true;
    } else {
      this.userInfoDropDownOpened = false;
    }
  }

  /* Method For Out Outside Click */
  onClickOutside() {
    if(this.userInfoDropDownOpened){
      this.counter = 0;
      this.showoptions = false;
      this.shared.notifyOther({ option: 'call_child', value: true });
      this.userInfoDropDownOpened = false;
    }
  }

  preventNavigation($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  // private hidingSubtitleTimer(): void {
  //   setTimeout(() => {
  //     this.showSubtitle = false;
  //   }, 10000);
  // }

  public handleMagicLine() {
    const myMagicLine = new magicLine(document.querySelectorAll('.magic-line-menu'), {
      mode: 'line',
      animationCallback: (el: any, params: any) => {
        // https://animejs.com/documentation/
        anime({
          targets: el,
          left: params.left,
          top: params.top,
          width: params.width,
          height: params.height,
          easing: 'easeInOutQuad',
          duration: 250,
        });
      },
    });
    myMagicLine.init();
  }

  headerLogoClick() {
    const linkWrapper = document.querySelector('.magic-line-inner');
    const links = linkWrapper.querySelectorAll('a');
    Array.prototype.forEach.call(links, (el) => {
      el.classList.remove('active');
    });
  }

  /**
   * Full screen function
   */
  public fullScreen() {
    if (document.fullscreenElement) {
      this.isFullScreen = false;
      document.exitFullscreen();
    } else {
      this.isFullScreen = true;
      document.documentElement.requestFullscreen();
    }
  }

  doSomething() {
    this.isOpen = false;
    this.showSideBar = false;
  }
  /* Sidebar */
  onShowSideBar() {
    this.isOpen = !this.isOpen;
    this.showSideBar = !this.showSideBar;
  }

  /* Open model in drop down */
  public openModal(index: number, options: any) {
    const path = options[index].path;
    const data = {
      type: 'new',
      vehicle: 'truck',
    };
    switch (path) {
      case 'driver':
        this.customModalService.openModal(DriverManageComponent, { data }, null, { size: 'small' });
        break;

      case 'truck':
        this.customModalService.openModal(TruckManageComponent, { data }, null, { size: 'small' });
        break;

      case 'fuel':
        this.customModalService.openModal(FuelManageComponent, { data }, null, { size: 'small' });
        break;

      case 'shop':
        this.customModalService.openModal(RepairShopManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case 'trailer':
        this.customModalService.openModal(TrailerManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case 'load':
        this.customModalService.openModal(ManageLoadComponent, { data }, null, {
          size: 'xxl',
        });
        break;

      case 'repair':
        this.customModalService.openModal(MaintenanceManageComponent, { data }, null, {
          size: 'large',
        });
        break;

      case 'owner':
        this.customModalService.openModal(OwnerManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case 'user':
        this.customModalService.openModal(CompanyUserManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case 'account':
        this.customModalService.openModal(AccountsManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case 'contact':
        this.customModalService.openModal(ContactManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case 'task':
        this.customModalService.openModal(TodoManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case 'broker':
        this.customModalService.openModal(CustomerManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case 'shipper':
        this.customModalService.openModal(ShipperManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      default:
        return;
    }
  }

  /**
   * Change password function
   */
  public updateProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.userService
      .getUserByUsername(currentUser.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (user: any) => {
          this.customModalService.openModal(ChangePasswordComponent, user, null, { size: 'small' });
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
  }

  /**
   * Logout function
   */
  public logout() {
    // localStorage.removeItem('currentUser');
    // localStorage.removeItem('token');
    // localStorage.removeItem('userCompany');
    localStorage.clear();
    this.router.navigate(['/login']);
    this.authService.logout();
  }

  /* Option bar for models in nav*/
  onDropOptions() {
    console.log('Open drop Down');
    this.showoptions = !this.showoptions;
    console.log('shop options')
    console.log(this.showoptions)
    if (this.changecolor) {
      this.changecolor = false;
    }
  }

  onDropToolOptions(event: any) {
    event.stopPropagation();
    this.showtooloptions = !this.showtooloptions;
    this.showSafetyOptions = false;
    this.showAccountingOptions = false;

    if (this.showoptions) {
      this.showoptions = false;
    }
  }

  onDropSafetyOptions(event: any) {
    event.stopPropagation();
    this.showSafetyOptions = !this.showSafetyOptions;
    this.showtooloptions = false;
    this.showAccountingOptions = false;

    if (this.showoptions) {
      this.showoptions = false;
    }
  }

  onDropAccountingOptions(event: any) {
    event.stopPropagation();
    this.showAccountingOptions = !this.showAccountingOptions;
    this.showtooloptions = false;
    this.showSafetyOptions = false;

    if (this.showoptions) {
      this.showoptions = false;
    }
  }

  OnChange_color() {
    this.changecolor = !this.changecolor;
    if (this.showtooloptions) {
      this.showtooloptions = false;
    }
  }

  addBorderOnFirstColunm() {
    const liNum = $('#acc-modal-ul li').length; // This computes the number of list items
    const colNum = 2; // This is the number of columns you want

    $('#acc-modal-ul li').each(function (i) {
      if (i % Math.floor(liNum / colNum) === 0) {
        $(this).addClass('topBorder');
      }
      if ((i + 1) % Math.floor(liNum / colNum) === 0) {
        $(this).addClass('bottomBorder');
      }
    });
  }

  toggleSearch() {
    this.searchCollapsed = !this.searchCollapsed;
    if (!this.searchCollapsed) {
      document.getElementById('search-input').focus();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.communicatorNotificationService.untrackHasUnreadSubscriptions();
  }

  private isUserInChat() {
    return this.router.url.includes('communicator');
  }

  changeMyStatus() {
    this.communicatorUserService.changeMyStatus(this.changeStatusOption);
  }

  toggleActivity(tooltip: any): void {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open();
    }
  }
}
