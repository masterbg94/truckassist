import { Component, Input, OnInit } from '@angular/core';
import { TableColumnDefinition, TableOptions } from '../models/truckassist-table';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.scss'],
})
export class ExportExcelComponent implements OnInit {
  @Input() columns: TableColumnDefinition[] = [];
  @Input() exportData: Array<any> = [];
  @Input() options: TableOptions;
  constructor() {}

  ngOnInit(): void {}

  public getValueByField(row: any, field: string): string {
    let value = this.byString(row, field);
    return value && field === 'commission' ? value.toString().replace('%', '') : value;
  }

  private byString(inputObject: any, inputString: string) {
    inputString = inputString.replace(/\[(\w+)\]/g, '.$1');
    inputString = inputString.replace(/^\./, '');
    const a = inputString.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
      const k = a[i];
      if (k in inputObject) {
        if (inputObject[k]) {
          inputObject = inputObject[k];
        } else {
          return;
        }
      } else {
        return;
      }
    }
    return inputObject;
  }

  public getExpireData(expireData: Date): Date {
    if (expireData) {
      const newDate = new Date(expireData ? expireData : '');
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    } else {
      return undefined;
    }
  }
}
