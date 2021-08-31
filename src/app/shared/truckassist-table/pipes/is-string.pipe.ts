import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isString'
})
export class IsStringPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): boolean {
    return typeof value === 'string' || value instanceof String;
  }
}
