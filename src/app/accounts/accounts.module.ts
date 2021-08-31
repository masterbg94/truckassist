import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsRoutingModule } from './accounts-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AccountImportComponent } from './account-import/account-import.component';
import { AccountTableComponent } from './account-table/account-table.component';
import { AccountsManageComponent } from './accounts-manage/accounts-manage.component';

@NgModule({
  declarations: [
    AccountImportComponent,
    AccountTableComponent,
    AccountsManageComponent,
  ],
  imports: [CommonModule, AccountsRoutingModule, SharedModule],
})
export class AccountsModule {}
