import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactTableComponent } from './contact-table/contact-table.component';

const routes: Routes = [{ path: '', component: ContactTableComponent, data: { title: 'Contacts' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactRoutingModule {}
