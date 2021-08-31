import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { OwnerRoutingModule } from './owners-routing.module';
import { OwnerManageComponent } from './owner-manage/owner-manage.component';
import { OwnersTableComponent } from './owner-table/owner-table.component';

@NgModule({
  declarations: [OwnerManageComponent, OwnersTableComponent],
  imports: [CommonModule, OwnerRoutingModule, SharedModule],
})
export class OwnersModule {}
