import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactRoutingModule } from './contact-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ContactImportComponent } from './contact-import/contact-import.component';
import { ContactManageComponent } from './contact-manage/contact-manage.component';
import { ContactTableComponent } from './contact-table/contact-table.component';

@NgModule({
  declarations: [
    ContactTableComponent,
    ContactImportComponent,
    ContactManageComponent,
  ],
  imports: [CommonModule, ContactRoutingModule, SharedModule],
})
export class ContactModule {}
