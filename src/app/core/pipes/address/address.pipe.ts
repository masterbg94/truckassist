import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {
  transform(value: string, full_city_name: boolean): string {
    if (value === null) {
      return null;
    }
    const trimmed = value.split(',');
    let town = '';
    let state = '';
    if (trimmed[1]) {
      town = trimmed[1];
    }

    if ( full_city_name && trimmed[0] ) { town = trimmed[0]; }

    if (trimmed[2]) {
      state = trimmed[2];
      state = state.slice(0, 4);
    }
    const formatedAddress = town + ',' + state;
    return formatedAddress;
  }

}
