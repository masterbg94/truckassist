import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DragDropModule
  ],
  exports: [
    CommonModule,
    DragDropModule
  ]
})
export class MaterialModule {}
