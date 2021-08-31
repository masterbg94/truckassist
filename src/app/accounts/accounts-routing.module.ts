import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountTableComponent } from './account-table/account-table.component';

const routes: Routes = [
  { path: '', component: AccountTableComponent, data: { title: 'Accounts' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {
}
