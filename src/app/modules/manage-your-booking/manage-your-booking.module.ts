import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingSearchModule } from '../booking/booking.module';
import { ManageYourBookingComponent } from './components/manage-your-booking/manage-your-booking.component';

@NgModule({
  imports: [
    CommonModule,
    BookingSearchModule
  ],
  declarations: [ManageYourBookingComponent],
  exports: [
    ManageYourBookingComponent
  ]
})
export class ManageYourBookingModule { }
