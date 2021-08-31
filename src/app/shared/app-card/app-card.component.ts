import { takeUntil } from 'rxjs/operators';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CustomModalService } from '../../core/services/custom-modal.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { Subject } from 'rxjs';
import { AppSharedService } from '../../core/services/app-shared.service';
import { OwnerManageComponent } from '../../owners/owner-manage/owner-manage.component';
import { SharedService } from '../../core/services/shared.service';
import { AccountsManageComponent } from '../../accounts/accounts-manage/accounts-manage.component';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ContactManageComponent } from '../../contact/contact-manage/contact-manage.component';
import { ContactAccountService } from '../../core/services/contactaccount.service';
import { NewLabel } from '../../core/model/label';
import { formatAddress } from '../../../assets/utils/settings/formatting';
import { HighlightText } from 'src/app/core/model/shared/searchFilter';

@Component({
  selector: 'app-card',
  templateUrl: './app-card.component.html',
  styleUrls: ['./app-card.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('150ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('150ms', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
    ]),
    trigger('fadeAnim', [
      transition('void => *', [
        style({ opacity: 0, height: '11px', width: '40px' }),
        animate('150ms 500ms', style({ opacity: 1, height: '*', width: '*' })),
      ]),
      transition('* => void', [
        style({ opacity: 1, height: '*', width: '*' }),
        animate('150ms 500ms', style({ opacity: 0, height: '11px', width: '40px' })),
      ]),
    ]),

    trigger('flip', [
      state(
        'front',
        style({
          transform: 'rotateX(0deg)',
        })
      ),
      state(
        'back',
        style({
          transform: 'rotateX(180deg)',
        })
      ),
      transition('front => back', [
        animate(
          '500ms 0s',
          keyframes([
            style({
              transform: 'perspective(1000px) rotateX(0deg)',
              offset: 0,
            }),
            style({
              transform: 'perspective(1000px) scale3d(1.3, 1.3, 1.3) rotateX(80deg)',
              offset: 0.4,
            }),
            style({
              transform: 'perspective(1000px) scale3d(1.3, 1.3, 1.3) rotateX(100deg)',
              offset: 0.5,
            }),
            style({
              transform: 'perspective(1000px) scale3d(0.95, 0.95, 0.95) rotateX(180deg)',
              offset: 0.8,
            }),
            style({
              transform: 'perspective(1000px) rotateX(180deg)',
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('back => front', [
        animate(
          '500ms 0s',
          keyframes([
            style({
              transform: 'perspective(1000px) rotateX(180deg)',
              offset: 0,
            }),
            style({
              transform: 'perspective(1000px) scale3d(1.3, 1.3, 1.3) rotateX(100deg)',
              offset: 0.4,
            }),
            style({
              transform: 'perspective(1000px) scale3d(1.3, 1.3, 1.3) rotateX(80deg)',
              offset: 0.5,
            }),
            style({
              transform: 'perspective(1000px) scale3d(0.95, 0.95, 0.95) rotateX(0deg)',
              offset: 0.8,
            }),
            style({
              transform: 'perspective(1000px) rotateX(0deg)',
              offset: 1,
            }),
          ])
        ),
      ]),
    ]),

    trigger('flipStateY', [
      state(
        'active',
        style({
          transform: 'rotateY(180deg)',
        })
      ),
      state(
        'inactive',
        style({
          transform: 'rotateY(0)',
        })
      ),
      transition('active => inactive', animate('300ms ease-out')),
      transition('inactive => active', animate('300ms ease-in')),
    ]),

    trigger('flipStateX', [
      state(
        'active',
        style({
          transform: 'rotateX(180deg)',
        })
      ),
      state(
        'inactive',
        style({
          transform: 'rotateX(0)',
        })
      ),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in')),
    ]),

    trigger('reveneueSlide', [
      transition(':enter', [
        style({ width: '50%', opacity: 0.5 }),
        animate('100ms', style({ width: '*', opacity: 1 })),
      ]),
      transition(':leave', [animate('100ms', style({ width: '50%', opacity: 0 }))]),
    ]),
  ],
})
export class AppCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: any;
  @Input() type = 'card';
  @Input() index;
  @Output() countOwners = new EventEmitter();
  @Input() labels = null;
  @Input() availableColors;
  @Input() highlightingWords: HighlightText[];
  private destroy$: Subject<void> = new Subject<void>();
  public selectedItem: any[] = [];
  public infoVisible: boolean;
  public isRevenueActive: boolean;
  public keyVisible: any[] = [];
  public showPass: any[] = [];
  public showCurrentLabel: any[] = [];
  public createLabelVisible = false;
  public editLabelVisible = false;
  public editableLabel: any;
  public createLabelName: string;
  public createLabelColor: string;
  public labelType: string;
  public cardLabelData: NewLabel;
  public haveCardData: boolean;
  public triangleOpacity: boolean;
  public colorPalette: any = [
    '#005CD4',
    '#0080FF',
    '#50A8FF',
    '#0093CE',
    '#00ACF0',
    '#49CBFF',
    '#008C8F',
    '#00C4BB',
    '#31E5DD',
    '#009E61',
    '#00C76E',
    '#50DC96',
    '#FFE567',
    '#FFD400',
    '#FFAA00',
    '#FF7B1D',
    '#FF5C50',
    '#E61D0D',
    '#873565',
    '#CF3991',
    '#F84D9F',
    '#442265',
    '#7040A1',
    '#9842D8',
  ];
  public filteredLabels: NewLabel[];
  private allowSave = false;
  private isEdit = false;
  labelsToggled: boolean;
  cardPassword: string;

  flip = 'inactive';
  toggledRev = false;

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-driver',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-item',
      type: 'driver',
      text: 'Are you sure you want to delete driver?',
    },
  };
  constructor(
    private customModalService: CustomModalService,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private sharedService: AppSharedService,
    private shared: SharedService,
    private contactAccountService: ContactAccountService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // this.labels = this.labels.filter((x) => x.id !== this.data.doc.labelId);

    if (this.type === 'account' || this.type === 'contact') {
      // this.returnCardColor(this.data.labelId);
      if (this.labels) {
        this.returnCardColor(this.data.labelId);
      }
      this.decryptPassword(this.data.id);
      this.decideLabelType();
      this.filteredLabels = this.labels.filter((x) => x.labelId !== this.data.labelId);
    }
    /*    if (this.type !== 'owner') {
          if (this.type === 'account') {
            this.typeOfService = this.accountService;
          } else {
            this.typeOfService = this.contactService;
          }
        }*/
    this.infoVisible = false;
    this.isRevenueActive = false;

    /* Account subscription */
      // this.contactAccountService.emitAccountLabel
      // .pipe(takeUntil(this.destroy$))
      // .subscribe((response: any) => {
      //   if (response.resp) {
      //     if (this.labels && this.data && this.data.id === response.resp.id) {
      //       console.log('response', response);
      //       this.returnCardColor(response.resp.labelId);
      //       this.filteredLabels = this.labels.filter((x) => x.id !== response.resp.labelId);
      //     }
      //   }
      // });

    /* Contacts subscription */
      // this.contactAccountService.emitContactLabel
      // .pipe(takeUntil(this.destroy$))
      // .subscribe((response: any) => {
      //   if (response.resp) {
      //     if (this.labels && this.data && this.data.id === response.resp.id) {
      //       // console.log('resp', resp);
      //       this.returnCardColor(response.resp.labelId);
      //       this.filteredLabels = this.labels.filter((x) => x.labelId !== response.resp.labelId);
      //     }
      //   }
      // });
  }

  crateLabelForm() {
    this.createLabelVisible = !this.createLabelVisible;
  }

  emitLabel(x) {
    if (this.type === 'account') {
      this.contactAccountService.emitAccountLabel.emit(x);
    } else if (this.type === 'contact') {
      this.contactAccountService.emitContactLabel.emit(x);
    }
  }

  setLabelColor(x) {
    this.createLabelColor = x;
    if (this.isEdit) {
      this.allowSave = true;
    } else {
      if (this.createLabelName.length >= 2) {
        this.allowSave = true;
      } else {
        this.allowSave = false;
      }
    }
  }

  deleteLabel(id) {
    this.contactAccountService.deleteLabel(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.notification.success('Label deleted', 'Success');
        const customResponse = {
          resp,
          type: 'delete-label-' + this.type
        };
        this.emitLabel(customResponse);
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  decideLabelType() {
    if (this.type === 'contact') {
      this.labelType = 'companyContactLabel';
    } else if (this.type === 'account') {
      this.labelType = 'companyAccountLabel';
    }
  }

  setCardLabel(cardId, labelId) {
    const cardLabel = {
      labelId,
    };
    this.contactAccountService.updateItem(this.type, cardId.id, cardLabel)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.notification.success('Card label updated successfully', 'Success');
        if (this.labels && this.data && this.data.id === resp.id) {
          this.returnCardColor(resp.labelId);
          this.filteredLabels = this.labels.filter((x) => x.labelId !== resp.labelId);
        }
        // if (labelId != 0) {
        const customizedResponse = {
          resp,
          oldLabel: cardId.labelId
        };
        this.emitLabel(customizedResponse);
        // }
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  returnCardColor(d) {
    if (this.type === 'account' || this.type === 'contact') {
      const a = this.labels;
      if (d !== null || true) {
        this.cardLabelData = this.labels.find((x) => x.labelId === d);
      }
      if (this.cardLabelData) {
        this.haveCardData = true;
      } else {
        this.haveCardData = false;
      }
    }
  }

  public returnUsedColor(x) {
    return this.availableColors.includes(x);
  }

  createUpdateLabel() {
    const novi = new NewLabel();
    novi.key = this.createLabelName;
    novi.value = this.createLabelColor || '#606060';
    novi.domain = this.labelType;
    if (!this.isEdit) {
      this.contactAccountService.createLabel(novi)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          const emitLabel = {
            resp,
            type: 'add-label',
          };
          this.notification.success('Label added successfully.', 'Success:');
          this.emitLabel(emitLabel);
          this.createLabelVisible = false;
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    } else {
      const updateData = {
        domain: this.labelType,
        labelName: this.createLabelName,
        labelColor: this.createLabelColor,
      };
      this.contactAccountService.updateLabel(updateData, this.editableLabel.labelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          const emitLabel = {
            resp,
            type: 'edit-label',
          };
          this.notification.success('Label updated successfully', 'Success');
          /* Update label name & color */
          this.emitLabel(emitLabel);
          this.createLabelVisible = false;
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    }
    this.createLabelName = '';
    this.createLabelColor = '';
  }

  editLabel(id) {
    this.isEdit = true;
    this.editableLabel = this.labels.find((x) => x.labelId === id);
    this.createLabelVisible = !this.createLabelVisible;
    this.createLabelName = this.editableLabel.labelName;
    this.createLabelColor = this.editableLabel.labelColor;
  }

  cancelCreating() {
    this.createLabelVisible = !this.createLabelVisible;
    this.createLabelName = '';
    this.createLabelColor = '';
    this.allowSave = false;
    this.isEdit = false;
  }

  public isAllowedSave(value) {
    if (this.isEdit === false) {
      if (value.length <= 1) {
        this.allowSave = false;
      } else if (value.length >= 2 && this.createLabelColor) {
        this.allowSave = true;
      }
    } else if (this.isEdit === true) {
      if (value !== this.editableLabel.key) {
        this.allowSave = true;
      } else {
        this.allowSave = false;
      }
    }
  }

  public getPassword(i) {
    this.keyVisible[i] = !this.keyVisible[i];
  }

  public copy(event, val) {
    const selBox = document.createElement('textarea');
    selBox.value = val;
    document.body.appendChild(selBox);
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notification.success('Copied!', 'Success:');
  }

  formatAddress(address: string, unit: string, index: number) {
    return formatAddress(address, unit, index);
  }

  public editModal(id) {
    const data = {
      type: 'edit',
      id,
    };
    if (this.type === 'account') {
      this.customModalService.openModal(AccountsManageComponent, { data }, null, { size: 'small' });
    } else if (this.type === 'contact') {
      this.customModalService.openModal(ContactManageComponent, { data }, null, { size: 'small' });
    } else if (this.type === 'owner') {
      this.customModalService.openModal(OwnerManageComponent, { data }, null, { size: 'small' });
    }
  }

  public emitType() {
    switch (this.type) {
      case 'account':
        this.contactAccountService.emitAccountsUpdate.emit(true);
        break;
      case 'contact':
        this.contactAccountService.emitContactsUpdate.emit(true);
        break;
    }
  }

  public deleteItem(id: number) {
    this.spinner.show(true);
    if (this.type === 'account' || this.type === 'contact') {
      this.contactAccountService.deleteItem(this.type, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          if (resp.status === 'error') {
            this.notification.warning(resp.message);
            this.spinner.show(false);
          } else {
            if (this.type === 'account') {
              this.notification.success('Account deleted successfully.', 'Success:');
            } else {
              this.notification.success('Contact deleted successfully.', 'Success:');
            }
            // this.notification.success(resp.message);
            this.spinner.show(false);
            this.emitType();
          }
        },
        (error: any) => {
          this.notification.error('Something went wrong. Please try again.', 'Error:');
          this.spinner.show(false);
        }
      );
    } else if (this.type === 'owner') {
      this.sharedService.deleteOwner(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.notification.success('Owner deleted successfully.', 'Success:');
          this.shared.emitOwnerDelete.emit(true);
          // this.notification.success(res.message);
          this.spinner.show(false);
        },
        (error: any) => {
          this.notification.error('Something went wrong. Please try again.', 'Error:');
          this.spinner.show(false);
        }
      );
    }
  }

  toggleLabels() {
    this.labelsToggled = !this.labelsToggled;
  }

  toggleR() {
    this.toggledRev = !this.toggledRev;
  }

  toggleFlip() {
    this.flip = this.flip === 'inactive' ? 'active' : 'inactive';
  }

  decryptPassword(id) {
    if (this.type === 'account') {
      this.contactAccountService.decryptPassword(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          this.cardPassword = resp.password;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.returnCardColor(this.data.labelId);
    if (this.type === 'account' || this.type === 'contact') {
      this.filteredLabels = this.labels.filter((x) => x.labelId !== this.data.labelId);
    }
  }

  public openAction(data: any): void {
    if (data.type === 'edit-driver') {
      this.editModal(data.id);
    } else if (data.type === 'delete-item') {
      this.deleteItem(data.id);
    }
  }

  copyAll(data) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML =
      data.name + '\n' + data.doc.phone + '\n' + data.doc.email + '\n' + data.doc.address;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
