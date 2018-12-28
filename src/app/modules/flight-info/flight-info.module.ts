import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingSearchModule } from '../booking/booking.module';


import { FlightInfoContentComponent } from '../flight-info/components/flight-info-content/flight-info-content.component';
import { FlightInfoComponent } from '../flight-info/components/flight-info/flight-info.component';

import { FlightStatusComponent } from '../booking/components/flight-status/flight-status.component';
import { FlightInfoDateComponent } from './components/flight-info-date/flight-info-date.component';
@NgModule({
  imports: [
    CommonModule,
    BookingSearchModule
  ],
  declarations: [
    FlightInfoComponent,
    FlightInfoContentComponent,
    FlightInfoDateComponent 
  ],
  exports:[
    FlightInfoComponent
  ]
})
export class FlightInfoModule { }

