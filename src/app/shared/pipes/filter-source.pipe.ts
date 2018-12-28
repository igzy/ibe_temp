import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSource'
})
export class FilterSourcePipe implements PipeTransform {

  transform(source: any, args: any, argInitial: any): any {
    if (!args && !argInitial) {
      return source;
    }
     if (argInitial) {
      return source.filter(element => {

        const city = element.location.city.toUpperCase();
        const cityInitial = city.substring(0, 1);
        if (argInitial === cityInitial) {
          if (args) {
            return element.code.toLowerCase().includes(args) ||
              element.location.city.toLowerCase().includes(args) ||
              element.location.country.toLowerCase().includes(args);
          } else {
            return true;
          }
        }
      });
     } else {
      return source.filter(element => {
        return element.code.toLowerCase().includes(args)
         || element.location.city.toLowerCase().includes(args)
         || element.location.country.toLowerCase().includes(args)});
     }

  }
}
