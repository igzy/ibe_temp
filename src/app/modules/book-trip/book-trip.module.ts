import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookTripComponent } from './components/book-trip/book-trip.component';
import { BookingSearchModule } from '../booking/booking.module';

@NgModule({
  imports: [
    CommonModule,
    BookingSearchModule
  ],
  declarations: [BookTripComponent],
  exports: [
    BookTripComponent
  ]
})
export class BookTripModule { }
