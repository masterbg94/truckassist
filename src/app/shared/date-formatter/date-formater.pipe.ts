import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateformatter'
})
export class DateFormatterPipe implements PipeTransform {

  transform(value: any, ...args: any[]) {

    if (value.trim() === 0) {
      return value;
    }

    const formattedValue = value.split('/').reverse().join('/');

    const date = new Date(formattedValue);
    const currentDate = new Date();

    if (date.getFullYear() === currentDate.getFullYear()
      && date.getMonth() === currentDate.getMonth()) {

        if (date.getDate() === currentDate.getDate()) {
          return 'Today';
        } else if (date.getDate() === currentDate.getDate() - 1) {
          return 'Yesterday';
        }

    }

    return value;

  }

}
