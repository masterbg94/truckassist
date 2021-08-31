import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarByField',
  pure: true
})
export class AvatarByFieldPipe implements PipeTransform {

  transform(inputObject: any, inputString: string): any {
    return this.getAvatarByField(inputObject, inputString);
  }

  public getAvatarByField(inputObject: any, inputString: string): string {
    inputString = inputString.replace(/\[(\w+)\]/g, '.$1');
    inputString = inputString.replace(/^\./, '');
    const a = inputString.split('.');

    a.forEach((element) => {
      inputObject = inputObject && inputObject[element] ? inputObject[element] : null;
    });

    return inputObject && typeof inputObject === 'string' ? inputObject : '';
  }

}
