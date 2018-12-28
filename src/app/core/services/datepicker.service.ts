import { Subject } from 'rxjs';
import { DEFAULT_LANGUAGE, I18N_VALUES, LANGUAGE_KEY } from '../../configs/app-settings.config';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class DatePickerService extends NgbDatepickerI18n {

  language = DEFAULT_LANGUAGE;

  subjectClearDate = new Subject;
  subjectClearDate$ = this.subjectClearDate.asObservable();

  now = new Date();
  currentDate: { year: number, month: number, day: number } = {
    year: this.now.getFullYear(),
    month: this.now.getMonth() + 1,
    day: this.now.getDate()
  };

  constructor() {
    super();
  }

  clearDate() {
    this.subjectClearDate.next(true);
  }

  // ABSTRACT
  getWeekdayShortName(weekday: number): string {
    this.fetchLanguage();
    return I18N_VALUES[this.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    this.fetchLanguage();
    return I18N_VALUES[this.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }

  fetchLanguage(){
    this.language = sessionStorage.getItem(LANGUAGE_KEY);
    if (!this.language) {
      this.language = DEFAULT_LANGUAGE;
    }
  }
}
