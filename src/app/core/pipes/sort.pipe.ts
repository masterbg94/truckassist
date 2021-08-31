import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  public getExpireData(expireData: any): any {
    if (expireData) {
      const newDate = new Date(expireData ? expireData : '');
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    } else {
      return undefined;
    }
  }

  transform(values: any[], key?: string): any[] {
    if (!Array.isArray(values) || values.length <= 0) {
      return [];
    }

    return values.sort((a: any, b: any) => {
      return this.getExpireData(b[key]) - this.getExpireData(a[key]);
    });
  }
}
