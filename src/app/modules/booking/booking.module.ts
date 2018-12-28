import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';
import { SharedModule } from '../../shared/shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookingMenuComponent } from './components/booking-menu/booking-menu.component';
import { FlightStatusComponent } from './components/flight-status/flight-status.component';
import { ManageBookingComponent } from './components/manage-booking/manage-booking.component';
import { CheckInComponent } from './components/check-in/check-in.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  declarations: [
    FlightSearchComponent,
    BookingMenuComponent,
    FlightStatusComponent,
    ManageBookingComponent,
    CheckInComponent
  ],
  exports: [
    FlightSearchComponent,
    BookingMenuComponent,
    FlightStatusComponent,
    ManageBookingComponent,
    CheckInComponent
  ],
  providers: [

  ]
})
export class BookingSearchModule { }
