import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.router';

import { AppComponent } from './app.component';
import { DateService } from './core/services/date.service';
import { PromocodeService } from './core/services/promocode.service';
import { BookingSearchModule } from './modules/booking/booking.module';
import { FlightInfoModule } from './modules/flight-info/flight-info.module';
import { SharedModule } from './shared/shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from './core/services/booking.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonsBfmService } from './core/services/commons-bfm.service';
import { DatePickerService } from './core/services/datepicker.service';
import { CookieService } from './core/services/cookie.service';
import { MmbService } from './core/services/mmb.service';
import { MobileService } from './core/services/mobile.service';
import { MarketService } from './core/services/market-service';
import { SearchHistoryService } from './core/services/search-history.service';
import { LanguageService } from './core/services/language.service';
import { CheckInService } from './core/services/check-in.service';
import { FlightInfoService } from './core/services/flight-status.service';
import { CommonsEPricingService } from './core/services/commons-epricing.service';
import { ManageYourBookingModule } from './modules/manage-your-booking/manage-your-booking.module';
import { CheckInTripModule } from './modules/check-in-trip/check-in-trip.module';
import { BookTripModule } from './modules/book-trip/book-trip.module';
import { RadioButtonService } from './core/services/radio-button.service';
import { ModalComponent } from './shared/components/modal/modal.component';
import { AuthorizationService } from './core/services/authorization.service';
import { HTTP_INTERCEPTORS } from '../../node_modules/@angular/common/http';
import { RamHttpInterceptor } from './shared/interceptor/ram-http.nterceptor';

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BookingSearchModule,
    NgbModule.forRoot(), 
    AppRoutingModule,
    FlightInfoModule,
    ManageYourBookingModule,
    CheckInTripModule,
    BookTripModule
  ],
  providers: [
    DatePickerService,
    DateService,
    CommonsBfmService,
    PromocodeService,
    BookingService,
    CookieService,
    MmbService,
    MobileService,
    MarketService,
    SearchHistoryService,
    LanguageService,
    CheckInService,
    FlightInfoService,
    CommonsEPricingService,
    RadioButtonService,
    AuthorizationService,
    { provide: HTTP_INTERCEPTORS, useClass: RamHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
