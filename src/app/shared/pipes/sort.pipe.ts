import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  pure: false
})
export class SortPipe implements PipeTransform {

  transform(value: any, propName: string, subPropName: string): any {

    if (value === 0 ) {
      return value;
    } else if (value && subPropName) {
      return value.sort((a, b) => {
          const c = a[propName];
          const d = b[propName];
        if (c[subPropName] > d[subPropName]) {
          return 1;
        } else {
          return -1;
        }
      });
    } else {
        return value.sort((a, b) => {
            if (a[propName] > b[propName]) {
              return 1;
            } else {
              return -1;
            }
        });
    }

  }

}
