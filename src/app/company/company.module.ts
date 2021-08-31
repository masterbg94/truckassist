import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModule } from './company-routing.module';
import { AppCompanySettingsComponent } from './app-company-settings/app-company-settings.component';
import { AppCompanyInfoComponent } from './app-company-info/app-company-info.component';
import { AppCompanyDocumentComponent } from './app-company-document/app-company-document.component';
import { AppCompanyPaymentComponent } from './app-company-payment/app-company-payment.component';
import { AppCompanyUserListComponent } from './app-company-user/app-company-user-list/app-company-user-list.component';
import { AppCompanyFuelAccountComponent } from './app-company-fuel-account/app-company-fuel-account.component';
import { SharedModule } from '../shared/shared.module';
import { AppCompanySideNavComponent } from './app-company-side-nav/app-company-side-nav.component';
import { CompanyUserManageComponent } from './app-company-user/company-user-manage/company-user-manage.component';
import { EditCompanyInfoComponent } from './app-company-info/edit-company-info/edit-company-info.component';
import { AddDocumentComponent } from './app-company-document/add-document/add-document.component';

@NgModule({
  declarations: [
    AppCompanySettingsComponent,
    AppCompanyInfoComponent,
    AppCompanyDocumentComponent,
    AppCompanyPaymentComponent,
    AppCompanyUserListComponent,
    AppCompanyFuelAccountComponent,
    AppCompanySideNavComponent,
    CompanyUserManageComponent,
    EditCompanyInfoComponent,
    AddDocumentComponent
  ],
  imports: [CommonModule, CompanyRoutingModule, SharedModule]
})
export class CompanyModule {
}
