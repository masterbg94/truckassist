import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string) {
    if (!items) {
      return [];
    }

    searchText = searchText.trim().toLowerCase();

    if (!searchText) {
      return items;
    }

    return items.filter(item => item.name.toLowerCase().includes(searchText));

  }

}
