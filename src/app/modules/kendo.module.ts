import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { InputsModule, SwitchModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { LabelModule } from '@progress/kendo-angular-label';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SortableModule,
    GridModule,
    DropDownsModule,
    ButtonsModule,
    SchedulerModule,
    InputsModule,
    DateInputsModule,
    SwitchModule,
    PDFModule,
    LayoutModule,
    ExcelExportModule,
    PDFExportModule,
    LabelModule,
  ],
  exports: [
    CommonModule,
    SortableModule,
    GridModule,
    DropDownsModule,
    ButtonsModule,
    SchedulerModule,
    InputsModule,
    DateInputsModule,
    SwitchModule,
    PDFModule,
    LayoutModule,
    ExcelExportModule,
    PDFExportModule,
    LabelModule,
  ],
  providers: [],
})
export class KendoModule {}
