import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberOfMessages'
})
export class NumberOfMessagesPipe implements PipeTransform {
  transform(value: number, message?: boolean) {
    if (!message) {
      if (value > 9) {
        return '9+';
      }
      return value;
    } else {
      if (!value) {
        return '';
      }
      if (value === 1) {
        return 'You have 1 new message';
      } else {
        return `You have ${value} new messages`;
      }
    }
  }
}
