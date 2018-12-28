import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckInTripComponent } from './components/check-in-trip/check-in-trip.component';
import { BookingSearchModule } from '../booking/booking.module';

@NgModule({
  imports: [
    CommonModule,
    BookingSearchModule
  ],
  declarations: [CheckInTripComponent],
  exports: [
    CheckInTripComponent
  ]
})
export class CheckInTripModule { }
