import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppCompanySettingsComponent } from './app-company-settings/app-company-settings.component';
import { AppCompanyInfoComponent } from './app-company-info/app-company-info.component';
import { AppCompanyDocumentComponent } from './app-company-document/app-company-document.component';
import { AppCompanyPaymentComponent } from './app-company-payment/app-company-payment.component';
import { AppCompanyUserListComponent } from './app-company-user/app-company-user-list/app-company-user-list.component';
import { AppCompanyFuelAccountComponent } from './app-company-fuel-account/app-company-fuel-account.component';

const routes: Routes = [
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
  {
    path: 'settings',
    component: AppCompanySettingsComponent,
    children: [
     /*  { path: '', redirectTo: 'general', pathMatch: 'full' },
      {
        path: 'general',
        component: AppCompanyInfoComponent,
        data: { title: 'General settings' }
      }, */
     /*  {
        path: 'documents',
        component: AppCompanyDocumentComponent,
        data: { title: 'Company documents' }
      },
      {
        path: 'billing',
        component: AppCompanyPaymentComponent,
        data: { title: 'Company billing' }
      },
      {
        path: 'users',
        component: AppCompanyUserListComponent,
        data: { title: 'Company users' }
      }, */
      {
        path: 'fuel',
        component: AppCompanyFuelAccountComponent,
        data: { title: 'Company fuel' }
      }
    ],
    data: { title: 'Company settings' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {
}
