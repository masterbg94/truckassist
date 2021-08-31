import { Pipe, PipeTransform } from '@angular/core';
import { NewLabel } from 'src/app/core/model/label';

@Pipe({
  name: 'labelFilter'
})
export class LabelFilterPipe implements PipeTransform {

  transform(labels: NewLabel[], field: number): any {
    return labels.find(item => item.labelId === field);
  }

}
