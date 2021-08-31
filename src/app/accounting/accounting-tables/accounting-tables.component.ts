import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { PayrollManageComponent } from './../payroll-manage/payroll-manage.component';
import { TableColumnDefinitionAccount, TableData, TableMainOptions } from './../models/accounting-table';
import { Component, OnInit, Input } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-accounting-tables',
  templateUrl: './accounting-tables.component.html',
  styleUrls: ['./accounting-tables.component.scss']
})
export class AccountingTablesComponent implements OnInit {
  constructor(private customModalService: CustomModalService) { }
  @Input() dataItem: TableData[];
  @Input() tableName: string;
  @Input() columns: TableColumnDefinitionAccount[];
  @Input() options: TableMainOptions;
  tableCurrentIndex: number;

  removeType: any = {
    Bonuses: 'Bonus',
    Deductions: 'Deduction',
    Credits: 'Credit'
  };

  ngOnInit(): void {
  }

  openAddNew() {
    const data = {
      type: 'new',
      id: null,
      title: this.tableName
    };
    this.customModalService.openModal(PayrollManageComponent, { data }, null, { size: 'small' });
  }

  openEdit(itemData) {
    const data = {
      type: 'edit',
      id: itemData, // Za sad neka salje ceo objekat
      title: this.tableName
    };

    this.customModalService.openModal(PayrollManageComponent, { data }, null, { size: 'small' });
  }

  deleteItem(indx) {
    // this.dataItem.splice(indx, 1);
    const data = {
      name: 'delete',
      type: 'remove-item',
      text: null,
      mainCategory: this.tableName,
      category: this.removeType[this.tableName],
      index: indx
    };
    this.customModalService.openModal(DeleteDialogComponent, { data }, null, { size: 'small' });
  }


  onDrop(event: CdkDragDrop<string[]>) {
    this.tableCurrentIndex = event.currentIndex;
    moveItemInArray(this.dataItem, event.previousIndex, event.currentIndex);
  }

}
