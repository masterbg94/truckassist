import { Pipe, PipeTransform } from '@angular/core';
import { TRAILER_LIST, TRUCK_LIST } from 'src/app/const';

@Pipe({
  name: 'tooltipBg',
  pure: true
})
export class TooltipBgPipe implements PipeTransform {

  transform(inputObject: any, args: any[]): any {
    return this.getTooltipBg(inputObject, args);
  }

  private getTooltipBg(inputObject: any, args: any[]): string {
    let color = '#ffffff';
    if (args[0] === 'truck') {
      const truckType = TRUCK_LIST.find(
        (t) => t.name === this.byString(inputObject, args[1])
      );
      if (truckType) {
        color = '#' + truckType.legendcolor;
      }
    } else if (args[0] === 'trailer') {
      const truckType = TRAILER_LIST.find(
        (t) => t.name === this.byString(inputObject, args[1])
      );
      if (truckType) {
        color = '#' + truckType.legendcolor;
      }
    }
    return color;
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

}
