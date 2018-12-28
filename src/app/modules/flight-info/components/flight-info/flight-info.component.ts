import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { LanguageService } from '../../../../core/services/language.service';
import { BOOKING_APP } from '../../../../configs/app-settings.config';
import { StatusResultModel } from '../../../../shared/models/flight-status-result-model';

@Component({
  selector: 'app-flight-info',
  templateUrl: './flight-info.component.html',
  styleUrls: ['./flight-info.component.scss']
})
export class FlightInfoComponent implements OnInit, OnChanges {
  @Input() translations: any;
  flightDates;

  constructor(
    private _languageService: LanguageService
  ) { }
 
  ngOnInit() {

    // const translationsSubscription = this._languageService.getTranslations(BOOKING_APP).subscribe(
    //   translations => {
    //     console.log(translations);
    //     this.translations = translations;
    //     console.log(this.translations);
    //   }, err => {
    //     console.error(err);
    //   }
    // );

    // console.log(this.translations);
  }

  statusResult(result: StatusResultModel[]) {
    let uniqueFlightDates = result.map(item => item.flightDate).filter((value, index, self) => self.indexOf(value) === index);
    this.flightDates = uniqueFlightDates;
  }

  ngOnChanges() {

  }

}
