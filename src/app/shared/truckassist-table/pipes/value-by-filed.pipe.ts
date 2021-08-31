import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueByField',
  pure: true,
})
export class ValueByFieldPipe implements PipeTransform {
  transform(row: any, field: string): any {
    return this.byString(row, field);
  }

  private byString(inputObject: any, inputString: string): any {
    inputString = inputString.replace(/\[(\w+)\]/g, '.$1');
    inputString = inputString.replace(/^\./, '');
    const a = inputString.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
      const k = a[i];
      if (typeof inputObject === 'object') {
        if (k in inputObject) {
          if (inputObject[k]) {
            inputObject = inputObject[k];
          } else {
            return '';
          }
        } else {
          return '';
        }
      } else {
        return inputObject[inputString];
      }
    }
    return inputObject;
  }
}
