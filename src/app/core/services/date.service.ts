import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  formatDate(date: { year: number, month: number, day: number}): string {
    let stringDate = '';
    if (date) {
      stringDate += date.year + '-';
      stringDate += this.padNumber(date.month) + '-';
      stringDate +=  this.padNumber(date.day) + 'T00:00:00.000Z';
    }
    return stringDate;
  }

  padNumber(value: number) {
    return `0${value}`.slice(-2);
  }
}
