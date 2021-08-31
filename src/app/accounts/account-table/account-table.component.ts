import { takeUntil } from 'rxjs/operators';
import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Subscription, Subject } from 'rxjs';
import { CustomModalService } from '../../core/services/custom-modal.service';
import { SharedService } from '../../core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { AccountsManageComponent } from '../accounts-manage/accounts-manage.component';
import { AccountImportComponent } from '../account-import/account-import.component';
import { AccountData, ManageAccount } from '../../core/model/account';
import { ContactAccountService } from '../../core/services/contactaccount.service';

import { TableColumnDefinition, TableData, TableOptions, TableSubject } from '../../shared/truckassist-table/models/truckassist-table';
import { getExtendedToolsAccountsColumnDefinition, getToolsAccountsColumnDefinition } from 'src/assets/utils/settings/toolsAccounts-columns';
import { NewLabel } from 'src/app/core/model/label';
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
  selector: 'app-account-table',
  templateUrl: '../account-table/account-table.component.html',
  styleUrls: ['../account-table/account-table.component.scss'],
})
export class AccountTableComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public accountColumns: TableColumnDefinition[] = [];
  private accounts: AccountData[] = [];
  public loadingItems = true;
  private labels: NewLabel[] = [];
  private destroy$: Subject<void> = new Subject<void>();

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
    private accountService: ContactAccountService,
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
      this.deleteSelectedAccount(resp.data.id);
    });

    this.accountService.emitAccountLabel
    .pipe(takeUntil(this.destroy$))
    .subscribe((response) => {
      if (response.type) {
        if (response.type === 'edit-label') {
          const indexChange = this.labels.findIndex((x) => x.labelId === response.resp.labelId);
          this.labels[indexChange] = response.resp;
        } else if (response.type === 'add-label') {
          this.labels.push(response.resp);
        } else if (response.type === 'delete-label-account') {
          const index = this.labels.findIndex((x) => x.labelId === response.resp.id);
          this.labels.splice(index, 1);
        }
        const avcol = this.labels.map((x) => x.labelColor);
        this.availableColors = this.colorPalette.filter((x) => avcol.indexOf(x) < 0);
      } else {
        const modified = this.accounts.find((x) => x.id === response.resp.id);
        this.accounts[this.accounts.indexOf(modified)] = response.resp;
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
      this.sendAccountData();
    });

    this.accountService.emitAccountsUpdate
    .pipe(takeUntil(this.destroy$))
    .subscribe((response) => {
      if (response.type === 'add-account') {
        this.accounts.push(response.resp);
        if (response.resp.labelId !== 0) {
          this.labelAddition(response);
        } else if (response.resp.labelId === 0) {
          this.noLabelCount++;
        }
      } else {
        const modified = this.accounts.find((x) => x.id === response.resp.id);
        this.accounts[this.accounts.indexOf(modified)] = response.resp;

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
      this.sendAccountData();
    });

    this.initTableOptions();
    this.getAccounts();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.accountService.reloadAccount) {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 200);
      this.accountService.reloadAccount = false;
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
          name: 'edit-account',
        },
      ],
      deleteAction: {
        title: 'Delete',
        name: 'delete-account',
        type: 'account',
        text: 'Are you sure you want to delete account(s)?',
      },
      type: 'account',
      class: 'account-card',
    };
  }

  public getAccounts(): void {
    const labels$ = this.accountService.getLabelsByType('companyAccountLabel');
    const accounts$ = this.accountService.getAllItems('account');

    forkJoin([accounts$, labels$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([accounts, labels]: [AccountData[], NewLabel[]]) => {
        this.accounts = accounts;
        this.labels = labels;
        // get labelName for sorting
        this.accounts = this.accounts.map((a) => {
          const label = this.labels.find((l) => l.labelId === a.labelId);
          a.labelName = label ? label.labelName : '';
          return a;
        });
        const avcol = this.labels.map((x) => x.labelColor);
        this.availableColors = this.colorPalette.filter((x) => avcol.indexOf(x) < 0);
        this.noLabelCount = this.accounts.filter(x => x.labelId === null).length;
        this.sendAccountData();
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  public openImportModal() {
    this.customModalService.openModal(AccountImportComponent);
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getToolsAccountsColumnDefinition();
    }
  }

  private getExtendedGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      return getExtendedToolsAccountsColumnDefinition();
    }
  }

  private sendAccountData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Accounts',
        field: 'active',
        data: this.accounts,
        extended: false,
        labels: this.labels,
        availableColors: this.availableColors,
        noLabelCount: this.noLabelCount,
        gridNameTitle: 'Account',
        stateName: 'accounts',
        gridColumns: this.getGridColumns('accounts', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('accounts', resetColumns),
      },
    ];

    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (this.accounts.length && action.id) {
      const account = this.accounts.find((t) => t.id === action.id);
      if (account) {
        action.account = this.clonerService.deepClone<AccountData>(account);
      }
    }
    if (action.type === 'edit-account') {
      this.editSelectedAccount(action.id);
    } else if (action.type === 'delete-account') {
      this.deleteSelectedAccount(action.id);
    } else if (action.type === 'insert-event') {
      this.addAccount();
    } else if (action.type === 'init-columns-event') {
      this.sendAccountData(true);
    } else if (action.type === 'import-event') {
      this.openImportModal();
    } else if (action.type === 'save-note-event') {
      this.saveNote(action);
    }
  }

  private saveNote(data: any) {
    const saveData: AccountData = this.clonerService.deepClone<AccountData>(data.account);
    saveData.doc.note = data.value;

    this.spinner.show(true);
    this.accountService
      .updateItem('account', saveData.id, saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.notification.success('Account Note successfully updated.', 'Success:');
          const customResponse = {
            resp: response,
            oldLabel: data.id.labelId
          };
          this.accountService.emitAccountsUpdate.emit(customResponse);
          this.spinner.show(false);
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  public editSelectedAccount(id: number) {
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(AccountsManageComponent, { data }, null, { size: 'small' });
  }

  public deleteSelectedAccount(id: number) {
    this.accountService.deleteItem('account', id).subscribe(
      () => {
        this.notification.success('Account successfully deleted.', 'Success:');
        this.accountService.emitAccountsUpdate.emit(true);
      },
      () => {
        this.shared.handleServerError();
      }
    );

    let count = 0;
    const interval = setInterval(() => {
      this.getAccounts();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  public addAccount() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(AccountsManageComponent, { data }, null, { size: 'small' });
  }

  public callDelete(accontsForDelete: DeletedItem[]): void {
    for (const account of accontsForDelete) {
      this.accountService.deleteItem('account', account.id).subscribe(
        () => {
          this.notification.success('Account successfully deleted.', 'Success:');
          this.accountService.emitAccountsUpdate.emit(true);
        },
        () => {
          this.shared.handleServerError();
        }
      );
    }

    let count = 0;
    const interval = setInterval(() => {
      this.getAccounts();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  public callStatus(event: any): void {}

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
