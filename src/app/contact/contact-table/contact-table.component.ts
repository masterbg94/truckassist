import { takeUntil } from 'rxjs/operators';
import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { CustomModalService } from '../../core/services/custom-modal.service';
import { SharedService } from '../../core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { ContactManageComponent } from '../contact-manage/contact-manage.component';
import { ContactImportComponent } from '../contact-import/contact-import.component';
import { ContactsData } from '../../core/model/contact';
import { ContactAccountService } from '../../core/services/contactaccount.service';

import { TableColumnDefinition, TableData, TableOptions, TableSubject } from '../../shared/truckassist-table/models/truckassist-table';
import { getExtendedToolsContactsColumnDefinition, getToolsContactsColumnDefinition } from 'src/assets/utils/settings/contacts-columns';
import { NewLabel } from 'src/app/core/model/label';
import { formatPhoneNumber } from 'src/app/core/helpers/formating';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import { UserState } from 'src/app/core/model/user';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SpinnerService } from 'src/app/core/services/spinner.service';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

@Component({
  selector: 'app-contact-table',
  templateUrl: '../contact-table/contact-table.component.html',
  styleUrls: ['../contact-table/contact-table.component.scss'],
})
export class ContactTableComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public contactColumns: TableColumnDefinition[] = [];
  public extendedColumns: TableColumnDefinition[] = [];
  private contacts: ContactsData[] = [];
  public loadingItems = true;
  public loadingContacts = false;
  public selectedTab = '';
  private destroy$: Subject<void> = new Subject<void>();
  private labels: NewLabel[] = [];

  public availableColors: any;
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
  noLabelCount;

  constructor(
    private contactService: ContactAccountService,
    private customModalService: CustomModalService,
    private shared: SharedService,
    private notification: NotificationService,
    private elementRef: ElementRef,
    private clonerService: ClonerService,
    private spinner: SpinnerService,
  ) {}

  ngOnInit(): void {
    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp: any) => {
      this.deleteSelectedContact(resp.data.id);
    });

    this.contactService.emitContactLabel
    .pipe(takeUntil(this.destroy$))
    .subscribe((response) => {
      if (response.type) {
        if (response.type === 'edit-label') {
          const indexChange = this.labels.findIndex((x) => x.labelId === response.resp.labelId);
          this.labels[indexChange] = response.resp;
        } else if (response.type === 'add-label') {
          this.labels.push(response.resp);
        } else if (response.type === 'delete-label-contact') {
          const index = this.labels.findIndex((x) => x.labelId === response.resp.id);
          this.labels.splice(index, 1);
        }
        const avcol = this.labels.map((x) => x.labelColor);
        this.availableColors = this.colorPalette.filter((x) => avcol.indexOf(x) < 0);
      } else {
        const modified = this.contacts.find((x) => x.id === response.resp.id);
        this.contacts[this.contacts.indexOf(modified)] = response.resp;
        if (response.oldLabel && response.resp.labelId) {
          this.labelSubstraction(response);
          this.labelAddition(response);
        } else if (!response.oldLabel && response.resp.labelId) {
          this.labelAddition(response);
          this.noLabelCount = this.noLabelCount - 1;
        } else if (!response.resp.labelId && response.oldLabel) {
          this.labelSubstraction(response);
          this.noLabelCount = this.noLabelCount + 1;
        }
      }
      this.sendContactData();
    });

    this.contactService.emitContactsUpdate
    .pipe(takeUntil(this.destroy$))
    .subscribe((response) => {
      if (response.type === 'add-contact') {
        this.contacts.push(response.resp);
        if (response.resp.labelId !== 0) {
          this.labelAddition(response);
        } else if (response.resp.labelId === 0) {
          this.noLabelCount++;
        }
      } else {
        const modified = this.contacts.find((x) => x.id === response.resp.id);
        this.contacts[this.contacts.indexOf(modified)] = response.resp;
        if (response.oldLabel && response.resp.labelId) {
          this.labelSubstraction(response);
          this.labelAddition(response);
        } else if (!response.oldLabel && response.resp.labelId) {
          this.labelAddition(response);
          this.noLabelCount = this.noLabelCount - 1;
        } else if (!response.resp.labelId && response.oldLabel) {
          this.labelSubstraction(response);
          this.noLabelCount = this.noLabelCount + 1;
        }
      }
      this.sendContactData();
    });

    this.initTableOptions();
    this.getContacts();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.contactService.reloadContact) {
      let count = 0;
      const interval = setInterval(() => {
        // this.getContacts();;
        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 200);
      this.contactService.reloadContact = false;
    }
  }

  private initTableOptions(): void {
    this.tableOptions = {
      data: this.tableSubject,
      disabledMutedStyle: true,
      useAdditionalFeatures: true,
      toolbarActions: {
        hideEmail: true,
        hideLabel: false,
        hideSelectNumber: true,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      mainActions: [
        {
          title: 'Edit',
          name: 'edit-contact',
        },
      ],
      deleteAction: {
        title: 'Delete',
        type: 'contact',
        name: 'delete-contact',
        text: 'Are you sure you want to delete contact(s)?',
      },
      type: 'contact',
      class: 'contact-card',
    };
  }

  public getContacts(): void {
    const contacts$ = this.contactService.getAllItems('contact');
    const labels$ = this.contactService.getLabelsByType('companyContactLabel');
    forkJoin([contacts$, labels$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([contacts, labels]: [ContactsData[], NewLabel[]]) => {
        this.contacts = contacts.map((contact) => {
          if (contact.doc && contact.doc.phone) {
            contact.doc.phone = contact.doc.phone ? formatPhoneNumber(contact.doc.phone) : '';
          }
          return contact;
        });
        this.labels = labels;
        // get labelName for sorting
        this.contacts = this.contacts.map((a) => {
          const label = this.labels.find((l) => l.labelId === a.labelId);
          a.labelName = label ? label.labelName : '';
          return a;
        });
        const avcol = this.labels.map((x) => x.labelColor);
        this.availableColors = this.colorPalette.filter((x) => avcol.indexOf(x) < 0);
        this.noLabelCount = this.contacts.filter(x => x.labelId === null).length;
        this.sendContactData();
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getToolsContactsColumnDefinition();
    }
  }

  private getExtendedGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      return getExtendedToolsContactsColumnDefinition();
    }
  }

  private sendContactData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Contacts',
        field: 'active',
        data: this.contacts,
        extended: false,
        labels: this.labels,
        availableColors: this.availableColors,
        noLabelCount: this.noLabelCount,
        gridNameTitle: 'Contact',
        stateName: 'contacts',
        gridColumns: this.getGridColumns('contacts', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('contacts', resetColumns),
      },
    ];

    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (this.contacts.length && action.id) {
      const contact = this.contacts.find((t) => t.id === action.id);
      if (contact) {
        action.contact = this.clonerService.deepClone<ContactsData>(contact);
      }
    }
    if (action.type === 'edit-contact') {
      this.editSelectedConatact(action.id);
    } else if (action.type === 'delete-contact') {
      this.deleteSelectedContact(action.id);
    } else if (action.type === 'insert-event') {
      console.log(this.contacts);
      this.addContact();
    } else if (action.type === 'import-event') {
      this.openImportModal();
    } else if (action.type === 'init-columns-event') {
      this.sendContactData(true);
    } else if (action.type === 'save-note-event') {
      this.saveNote(action);
    }
  }

  private saveNote(data: any) {
    const saveData: ContactsData = this.clonerService.deepClone<ContactsData>(data.contact);
    saveData.doc.note = data.value;

    this.spinner.show(true);
    this.contactService
      .updateItem('contact', saveData.id, saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.notification.success('Account Note successfully updated.', 'Success:');
          const customResponse = {
            resp: response,
            oldLabel: data.id.labelId
          };
          this.contactService.emitContactsUpdate.emit(customResponse);
          this.spinner.show(false);
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  public editSelectedConatact(id: number) {
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(ContactManageComponent, { data }, null, { size: 'small' });
  }

  public deleteSelectedContact(id: number) {
    this.contactService.deleteItem('contact', id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success('Contact successfully deleted.', 'Success:');
        this.contactService.emitAccountsUpdate.emit(true);
      },
      () => {
        this.shared.handleServerError();
      }
    );
    let count = 0;
    const interval = setInterval(() => {
      this.getContacts();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  public addContact() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(ContactManageComponent, { data }, null, { size: 'small' });
  }

  public callDelete(conactsToDelete: DeletedItem[]): void {
    for (const contact of conactsToDelete) {
      this.contactService.deleteItem('contact', contact.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.notification.success('Contacts successfully deleted.', 'Success:');
          this.contactService.emitAccountsUpdate.emit(true);
        },
        () => {
          this.shared.handleServerError();
        }
      );
    }
  }

  public callStatus(event: any): void {}

  public openImportModal() {
    this.customModalService.openModal(ContactImportComponent);
  }

  labelSubstraction(response) {
    const oldLabel = this.labels.find((x) => x.labelId === response.oldLabel);
    oldLabel.labelCount = oldLabel.labelCount - 1;
    this.labels[this.labels.indexOf(oldLabel)] = oldLabel;
  }

  labelAddition(response) {
    const nLabel = this.labels.find((x) => x.labelId === response.resp.labelId);
    nLabel.labelCount = nLabel.labelCount + 1;
    this.labels[this.labels.indexOf(nLabel)] = nLabel;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
