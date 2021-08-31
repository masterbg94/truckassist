import { takeUntil } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AppUserService } from 'src/app/core/services/app-user.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { CompanyUserManageComponent } from '../company-user-manage/company-user-manage.component';
import {
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import {
  getExtendedUsersColumnDefinition,
  getUsersColumnDefinition,
} from 'src/assets/utils/settings/users-columns';
import { dateFormat, formatPhoneNumber } from 'src/app/core/helpers/formating';
import { ToastrService } from 'ngx-toastr';
import { mapUserData } from 'src/assets/utils/methods-global';
import { UserState } from 'src/app/core/model/user';

@Component({
  selector: 'app-app-company-user-list',
  templateUrl: './app-company-user-list.component.html',
})
export class AppCompanyUserListComponent implements OnInit, OnDestroy {
  public users: any[] = [];
  public usersForEdit = [];
  @Input() inputData: any;
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public userColumns: TableColumnDefinition[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  public loadingItems = true;
  public userTable = '';

  constructor(
    private userService: AppUserService,
    private shared: SharedService,
    private customModalService: CustomModalService,
    private changeRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.getUserData();
    this.getUserList();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.userService.reloadUserTabel) {
      let count = 0;
      const interval = setInterval(() => {
        this.getUserData();
        this.getUserList();
        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 200);
      this.userService.reloadUserTabel = false;
    }
  }

  private initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: true,
      data: this.tableSubject,
      useAdditionalFeatures: true,
      toolbarActions: {
        hideImport: true,
        hideExport: true,
        hideLockUnlock: false,
        hideAddNew: false,
        hideColumns: true,
        hideCompress: true,
        hideEmail: true,
        hideDelete: true,
        hidePrint: true,
        hideDeleteMultiple: true,
        hideSwitch: true,
        userTabelStyle: true,
        hideLabel: true,
        hideSelectNumber: false,
        hideTabs: true,
        hideSwitchView: true
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      mainActions: [],
    };
    this.changeRef.detectChanges();
  }

  getUserData() {
    const users$ = this.userService.getUsersList();
    forkJoin([users$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        // TODO: dodati type za userData takodje proslediti utils metodi za mapiranje objekta
        ([users]: [any]) => {
          this.users = users.map((user) => {
            return mapUserData(user);
          });
          console.log(this.users);
          this.sendUserData();
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getUsersColumnDefinition();
    }
  }

  private getExtendedGridColumns(
    stateName: string,
    resetColumns: boolean
  ): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      return getExtendedUsersColumnDefinition();
    }
  }

  private sendUserData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Active',
        field: 'active',
        data: this.users,
        extended: false,
        allowSelectRow: true,
        dontShowChips: true,
        gridNameTitle: 'User',
        stateName: 'company_users',
        gridColumns: this.getGridColumns('company_users', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('company_users', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (action.type === 'insert-event') {
      this.addNewUser();
    } else if (action.type === 'init-columns-event') {
      this.sendUserData(true);
    } else if (action.type === 'delete') {
      this.deleteUser(action);
    }
  }

  public addNewUser() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(CompanyUserManageComponent, { data }, null, {
      size: 'small',
    });
  }

  onEditUser(event: any) {
    let enabled: number;
    if (event.edit) {
      this.openUserEdit(this.usersForEdit[event.index]);
    } else {
      if (event.disableUser) {
        this.users[event.index].status ? (enabled = 0) : (enabled = 1);
        this.updateUser(
          this.users[event.index].id,
          {
            status: enabled,
          },
          event.index,
          enabled
        );
      }
    }
  }

  openUserEdit(user: any) {
    const data = {
      type: 'edit',
      user,
    };
    this.customModalService.openModal(CompanyUserManageComponent, { data }, null, {
      size: 'small',
    });
  }

  getUserList() {
    const users$ = this.userService.getUsersList();
    forkJoin([users$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([users]: [any[]]) => {
          this.usersForEdit = users;
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  updateUser(id: number, data: any, index: number, enabled: number) {
    this.userService
      .updateUser(id, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.toastr.success(`User successfully ${enabled ? 'Disabled' : 'Enabled'}.`, ' ');
          this.users[index].status = enabled;
          this.sendUserData();
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  deleteUser(action: any) {
    if (action.userType !== 'Owner') {
      this.userService
        .deleteUser(action.item.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.toastr.success(`User successfully deleted`, ' ');
            for (let i = 0; i < this.users.length; i++) {
              if (this.users[i].id === res.id) {
                this.users.splice(i, 1);
              }
            }
            this.sendUserData();
          },
          () => {
            this.shared.handleServerError();
          }
        );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
