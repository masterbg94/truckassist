import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './calendar.component';
import { CalendarManageComponent } from './calendar-manage/calendar-manage.component';
import { CalendarActionsComponent } from './calendar-actions/calendar-actions.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import { DialogModule } from '@progress/kendo-angular-dialog';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { SharedModule } from '../shared/shared.module';
import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';

import { from } from 'rxjs';
FullCalendarModule.registerPlugins([dayGridPlugin, listPlugin]);

@NgModule({
  declarations: [CalendarComponent, CalendarManageComponent, CalendarActionsComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FullCalendarModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    CalendarActionsComponent,
    SharedModule,
  ],
  entryComponents: [],
})
export class CalendarModule {}
