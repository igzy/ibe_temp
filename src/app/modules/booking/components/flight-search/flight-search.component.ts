import { Component, OnInit, OnDestroy, Input, OnChanges} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MULTICITY_MAX_ROWS,
  LANGUAGE_KEY,
  AIRLINE_ID_KEY,
  TRIP_TYPE_KEY,
  MARKET_CODE_KEY,
  TOKEN_BFM_KEY,
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_METHOD,
  SEARCH_LIST_COOKIE,
  MULTICITY_MIN_ROWS,
  E_RETAIL_ACTIVATED,
  MARKET_CODE_SENEGAL,
  MARKET_CODE_MOROCCO,
  LANGUAGE_CODE_ARABIC,
  USER_LOGGED_INDICATOR_KEY,
  LOGIN_URL,
  LOGIN_URL_SESSION_KEY,
  COUNTRY_NAME_CODE_MOROCCO,
  DEVICE_TYPE_WEB,
  DEVICE_TYPE_MOBILE} from '../../../../configs/app-settings.config';
  import { OriginResultModel } from '../../../../shared/models/origins-result.model';
  import { DestinationResultModel } from '../../../../shared/models/destination-result.model';
  import { BookingService } from '../../../../core/services/booking.service';
  import { PromocodeBodyModel } from '../../../../shared/models/promocode.model';
  import { LocationOutputModel } from '../../../../shared/models/location-result.model';
  import { HistorySearchModel, SearchHistoryObject } from '../../../../shared/models/history-search-model';
  import { CookieService } from '../../../../core/services/cookie.service';
import { BookingSearchRequest } from '../../../../shared/models/booking-search-request-model';
import { DateService } from '../../../../core/services/date.service';
import { MobileService } from '../../../../core/services/mobile.service';
import { CalendarPriceDateModel, CalendarPriceDateInputModel } from '../../../../shared/models/calendar-price-input-model';
import { ERetailSearchRequest, ERetailPayWithMilesSearchRequest } from '../../../../shared/models/e-retail-request-model';
import { MarketService } from '../../../../core/services/market-service';
import { SearchHistoryService } from '../../../../core/services/search-history.service';
import { LanguageService } from '../../../../core/services/language.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { RadioButtonService } from '../../../../core/services/radio-button.service';

  @Component({
    selector: 'app-flight-search',
    templateUrl: './flight-search.component.html',
    styleUrls: ['./flight-search.component.scss']
  })
  export class FlightSearchComponent implements OnInit, OnDestroy, OnChanges {

    flightSearchForm: FormGroup;
    allSubs: Subscription[] = [];
    origins: FormArray;
    destinations: FormArray;
    departureDates: FormArray;
    currentRows = 2; // DEFAULT NUMBER OF MULTICITY ROW
    maxRows = MULTICITY_MAX_ROWS; // MAX NUMBER OF MULTICITY ROWS
    minRows = MULTICITY_MIN_ROWS;

    paxInformation = { 'max': 9, 'types': [{ 'code': 'INF', 'max': 9 }, { 'code': 'ADT', 'max': 3 }, { 'code': 'CHD', 'max': 5 }] };

    // Origin
    originSource: OriginResultModel[] = [];

    bookingParams: {
      tripType: string;
      market: string,
      language: string,
      airlineId: string,
      origin?: string
    };

    destinationSource: DestinationResultModel[] = [];
    destinationSourceArr: any[] =  [];

    tabHeaders = [/* 'Round trip', 'One way', 'Multi-city' */];

    promocodeBody: PromocodeBodyModel;
    searchHistoryModel: HistorySearchModel = {
      originDate: null,
      destinationDate: null,
      origin: null,
      destination: null,
      tripType: null,
      cabinClass: null,
      passengers: null
    };
    selectedNonMultiCityPaymentMethod: string = null;

    searchHistoryModelList: HistorySearchModel[] = [];

    isLoggedIn = false;
    isMobile = false;

    calendarPriceInput: CalendarPriceDateInputModel;

    market: string;
    showPaymentMethod = false;
    showSearchHistory = false;

    direction: string;

    mobileHeaderTitle: string;

    @Input() translations: any;
    @Input() redemption = false;
    originCountryName: string;
    originCountryNameForMulti: string[] = [];

    originPatch: OriginResultModel;
    destinationPatch: DestinationResultModel;
    preSelectTabHeaderIndex = 0;
    cabinClassPatch: string;
    passengersPatch: any;
    departureDatePatch: NgbDate;
    returnDatePatch: NgbDate;

    originInputFocus = false;
    destinationInputFocus = false;
    dateInputFocus1 = false;
    dateInputFocus2 = false;
    paxInputFocus = false;

    multiCityFocus = [
      {
        originInputFocus: false,
        destinationInputFocus: false,
        multiCityDate: false,
        paxInputFocus: false,
      },
      {
        originInputFocus: false,
        destinationInputFocus : false,
        multiCityDate: false,
        paxInputFocus: false,
      }
    ];

    patchTriggerIndicator = false;
    paxTouchFlag = false;
    paymentMethodTouchFlag = false;

    paymentMethodOriginCountryNameCode = '';

    constructor(private _bookingService: BookingService,
      private _fb: FormBuilder,
      private _cookieService: CookieService,
      private _dateService: DateService,
      private _mobileService: MobileService,
      private _marketService: MarketService,
      private _searchHistoryService: SearchHistoryService,
      private _languageService: LanguageService,
      private _radioButtonService: RadioButtonService) { }

      ngOnInit() {
        this.checkMobileView();
        this.fetchFromTranslation();

        if (sessionStorage.getItem(USER_LOGGED_INDICATOR_KEY)) {
          this.isLoggedIn = JSON.parse(sessionStorage.getItem(USER_LOGGED_INDICATOR_KEY));
        }
        // INITIALIZATION OF FORM GROUP
        this.flightSearchForm = this._fb.group({
          market: this._fb.control(sessionStorage.getItem(MARKET_CODE_KEY)),
          language: this._fb.control(sessionStorage.getItem(LANGUAGE_KEY)),
          airlineId: this._fb.control(sessionStorage.getItem(AIRLINE_ID_KEY), Validators.required),
          tripType: this._fb.control(sessionStorage.getItem(TRIP_TYPE_KEY), Validators.required),
          origin: this._fb.control(null, Validators.required),
          destination: this._fb.control(null, Validators.required),
          passengers: this._fb.control(null, Validators.required),
          departureDate: this._fb.control(null, Validators.required),
          returnDate: this._fb.control(null, Validators.required),
          cabinClass: this._fb.control(null, Validators.required),
          origins: this._fb.array([this.createControl()]),
          destinations: this._fb.array([this.createControl()]),
          departureDates: this._fb.array([this.createControl()]),
          payWithMilesInd: this._fb.control(false),
          paymentMethod: this._fb.control(null)
        });

        this.setShowPaymentMethod();

        // INITIALIZATION OF BOOKING PARAMS FOR GETTING THE ORIGINS
        this.createBookingParams();

        this.fetchOrigins();

        const marketSubscription = this._marketService.marketUpdate$.subscribe(flag => {
          if (flag) {
            this.setShowPaymentMethod();
            this.fetchOrigins();
          }
        });

        const showSearchHistorySubsription = this._searchHistoryService.showHistoryFlag$.subscribe(flag => {
          if (flag) {
            this.showSearchHistory = true;
          }
        });

        const dirSubscription = this._languageService.directionUpdate$.subscribe(data => {
          if (data) {
            this.direction = data;
          }
        });

        const languageSubscription = this._languageService.languageUpdate$.subscribe(data => {
          if (data) {
            this.flightSearchForm.patchValue({'language': data});
            this.fetchOrigins();
          }
        });

        this.allSubs.push(languageSubscription);
        this.allSubs.push(dirSubscription);
        this.allSubs.push(showSearchHistorySubsription);
        this.allSubs.push(marketSubscription);

        console.log(this.flightSearchForm);
    }

    fetchOrigins() {
      const id = setInterval(() => {

        this.createBookingParams();
        if (sessionStorage.getItem(TOKEN_BFM_KEY) !== null &&
            sessionStorage.getItem(MARKET_CODE_KEY) !== null) {
          // FETCHING ORIGINS
          const originSubscription = this._bookingService.getOrigins(this.bookingParams)
          .pipe(
            map(origin => {
              const origins = [];
              for (const o in origin) {
                if (origin.hasOwnProperty(o)) {
                  origins.push(origin[o]);
                }
              }
              return origins;
            })
          )
          .subscribe(origins => {
            if (!origins) {
              return;
            }
            this.originSource = origins[0];
          }
        );
        this.allSubs.push(originSubscription);
        clearInterval(id);
      }
      }, 500);
    }

    createBookingParams() {
      this.bookingParams = {
        'tripType': sessionStorage.getItem(TRIP_TYPE_KEY),
        'market': sessionStorage.getItem(MARKET_CODE_KEY),
        'language': sessionStorage.getItem(LANGUAGE_KEY),
        'airlineId': sessionStorage.getItem(AIRLINE_ID_KEY)
      };
    }

    fetchFromTranslation() {
      if (this.translations) {
        this.tabHeaders = this.translations.BOOKING_APP.BOOK_A_FLIGHT.TRIP_TYPES;
        if (!this.mobileHeaderTitle) {
          this.mobileHeaderTitle = this.translations.BOOKING_APP.BOOK_A_FLIGHT.TITLE;
        }
      }
    }

    setShowPaymentMethod() {
      sessionStorage.removeItem(PAYMENT_METHOD);
      this.market =  sessionStorage.getItem(MARKET_CODE_KEY);
      this.flightSearchForm.patchValue({'market': this.market});
      const tripType = this.flightSearchForm.value.tripType;
      if (this.market === MARKET_CODE_MOROCCO
            || this.market === MARKET_CODE_SENEGAL
            || (tripType !== 'M' && this.originCountryName === COUNTRY_NAME_CODE_MOROCCO)
            || (tripType === 'M' && this.originCountryNameForMulti.includes(COUNTRY_NAME_CODE_MOROCCO))) {
        this.showPaymentMethod = true;
        // this.flightSearchForm.get('paymentMethod').setValue();
        this.paymentMethodOriginCountryNameCode = COUNTRY_NAME_CODE_MOROCCO;
        this.flightSearchForm.get('paymentMethod').setValidators(Validators.required);
        this.flightSearchForm.get('paymentMethod').updateValueAndValidity();
      } else {
        this.showPaymentMethod = false;
        this.resetPaymentMethod();
      }
    }

    createPromoCodeBody(): any {
      if (this.flightSearchForm.valid) {
        const tripType = this.flightSearchForm.value.tripType;
        let destinationTemp;
        let originTemp;
        let inboundDateTemp;
        let outboundDateTemp;
        if (tripType === 'M') {
          const originsArr = this.flightSearchForm.get('origins');
          const destinationsArr = this.flightSearchForm.get('destinations');
          const departureDatesArr = this.flightSearchForm.get('departureDates');
          destinationTemp = originsArr.get('0').value;
          originTemp = destinationsArr.get('0').value;
          outboundDateTemp = departureDatesArr.get('0').value;
        } else {
          destinationTemp = this.flightSearchForm.controls['destination'].value;
          originTemp = this.flightSearchForm.controls['origin'].value;
          inboundDateTemp = this.flightSearchForm.controls['returnDate'].value;
          outboundDateTemp = this.flightSearchForm.controls['departureDate'].value;
        }
        const passengersTemp = this.flightSearchForm.controls['passengers'].value;
        const cabinClassTemp = this.flightSearchForm.controls['cabinClass'].value;
        const tripTypeTemp = this.flightSearchForm.controls['tripType'].value;
        if (inboundDateTemp) {
            inboundDateTemp = inboundDateTemp.year.toString() + '-' +
          ('00' + inboundDateTemp.month.toString()).slice(-2) + '-' +
          ('00' + inboundDateTemp.day.toString()).slice(-2) + 'T00:00:00.000';
        }
        outboundDateTemp = outboundDateTemp.year.toString() + '-' +
        ('00' + outboundDateTemp.month.toString()).slice(-2) + '-' +
        ('00' + outboundDateTemp.day.toString()).slice(-2) + 'T00:00:00.000';
        let passengersTempContent = {};

        const passengersArr = [];
        if (passengersTemp.ADT) {
          passengersTempContent = {};
          passengersTempContent = {
            'amount': passengersTemp.ADT,
            'passengerType': 'ADT'
          };
          passengersArr.push(passengersTempContent);
        }

        if (passengersTemp.CHD) {
          passengersTempContent = {};
          passengersTempContent = {
            'amount': passengersTemp.CHD,
            'passengerType': 'CHD'
          };
          passengersArr.push(passengersTempContent);
        }

        if (passengersTemp.INF) {
          passengersTempContent = {};
          passengersTempContent = {
            'amount': passengersTemp.INF,
            'passengerType': 'INF'
          };
          passengersArr.push(passengersTempContent);
        }

        const body: PromocodeBodyModel = {
          'destination': destinationTemp[0],
          'origin': originTemp[0],
          'passengers': passengersArr,
          'outboundDate': outboundDateTemp,
          'inboundDate': inboundDateTemp,
          'cabinClass': cabinClassTemp,
          'tripType': tripTypeTemp
        };
        return body;
      }
    }

    originChanged(locationOutput: OriginResultModel, position: number) {
      const tripType = this.flightSearchForm.value.tripType;
      if (locationOutput) {
        if (position === null) {
          this.searchHistoryModel.origin = locationOutput;
        }
        this.bookingParams.origin = locationOutput.code;
        if (position === null) {
          this.originCountryName = locationOutput.location.countryName;
        } else {
          this.originCountryNameForMulti[position] = locationOutput.location.countryName;
        }
        // GET DESTINATION
        // console.log('Petición de Destinations: ', this.bookingParams);
        const destinationSubscription = this._bookingService.getDestinations(this.bookingParams)
        .pipe(
          map(destination => {
            const destinations = [];
            for (const o in destination) {
              if (destination.hasOwnProperty(o)) {
                destinations.push(destination[o]);
              }
            }
            return destinations;
          })
        )
        .subscribe(
          (destination: any) => {
            if (!destination) {
              return;
            }
            const destinationStr = JSON.stringify(destination);
            const formattedDest = JSON.parse(destinationStr.replace('destinations', 'origins'));
            if (position !== null) {
              this.destinationSourceArr[position] = formattedDest[0];
            } else {
              this.destinationSource = formattedDest[0];
            }
          }
        );
        this.allSubs.push(destinationSubscription);
        this.promocodeBody = this.createPromoCodeBody();
      } else {
        if (position === null) {
          this.originCountryName = '';
        } else {
          this.originCountryNameForMulti[position] = '';
        }
        if (tripType !== 'M') {
          this.searchHistoryModel.origin = null;
          this.searchHistoryModel.destination = null;
          this.searchHistoryModel.destinationDate = null;
          this.searchHistoryModel.originDate = null;
          this.searchHistoryModel.passengers = null;
          this.searchHistoryModel.cabinClass = null;
        }
      }
      this.setShowPaymentMethod();
      this.resetDestination(position);
      this.resetDates(position);
      if (!this.patchTriggerIndicator && !this.isMobile) {

        this.nextFocus(position);
      }
      // cabin class will react only on round trip/ one-way and 1st row of multicity..
      if ((position === null && tripType !== 'M') || (position === 0 && tripType === 'M')) {
        this.resetPaxCabinClass();
      }
    }

    destinationChanged(locationOutput: DestinationResultModel, position: number) {
      const tripType = this.flightSearchForm.value.tripType;
      if (locationOutput) {
        if (position === null) {
          this.searchHistoryModel.destination = locationOutput;
        }
        this.promocodeBody = this.createPromoCodeBody();
        this.calendarPriceInput = this.createCalendarPriceInput(position);
      } else {
        if (tripType !== 'M') {
          this.searchHistoryModel.destination = null;
          this.searchHistoryModel.destinationDate = null;
          this.searchHistoryModel.originDate = null;
          this.searchHistoryModel.passengers = null;
          this.searchHistoryModel.cabinClass = null;
        }
      }
      this.resetDates(position);
      if (!this.patchTriggerIndicator && !this.isMobile) {
        this.nextFocus(position);
      }
      // cabin class will react only on round trip/ one-way and 1st row of multicity..
      if ((position === null && tripType !== 'M') || (position === 0 && tripType === 'M')) {
        this.resetPaxCabinClass();
      }
    }

    resetOrigin(position: number) {
      if (position !== null) {
        this.destinationSourceArr[position] = [];
        const originsArr = this.flightSearchForm.get('origins');
        originsArr.get('' + position).setValue(undefined);
        originsArr.get('' + position).markAsUntouched();
        originsArr.get('' + position).updateValueAndValidity();
      } else {
        this.originPatch = undefined;
        this.destinationSource = [];
        this.flightSearchForm.get('origin').setValue(undefined);
        this.flightSearchForm.get('origin').markAsUntouched();
        this.flightSearchForm.get('origin').updateValueAndValidity();
      }
    }

    resetDestination(position: number) {
      if (position !== null) {
        this.destinationSourceArr[position] = [];
        const destinationArr = this.flightSearchForm.get('destinations');
        destinationArr.get('' + position).setValue(undefined);
        destinationArr.get('' + position).markAsUntouched();
        destinationArr.get('' + position).updateValueAndValidity();
      } else {
        this.destinationPatch = undefined;
        this.destinationSource = [];
        this.flightSearchForm.get('destination').setValue(undefined);
        this.flightSearchForm.get('destination').markAsUntouched();
        this.flightSearchForm.get('destination').updateValueAndValidity();
      }
    }

    resetDates(position: number) {
      if (position !== null) {
        const destinationDatesArr = this.flightSearchForm.get('departureDates');
        destinationDatesArr.get('' + position).setValue(undefined);
        destinationDatesArr.get('' + position).markAsUntouched();
        destinationDatesArr.get('' + position).updateValueAndValidity();
      } else {
        this.departureDatePatch = undefined;
        this.returnDatePatch = undefined;
        this.flightSearchForm.get('departureDate').setValue(undefined);
        this.flightSearchForm.get('departureDate').markAsUntouched();
        this.flightSearchForm.get('departureDate').updateValueAndValidity();
        this.flightSearchForm.get('returnDate').setValue(undefined);
        this.flightSearchForm.get('returnDate').markAsUntouched();
        this.flightSearchForm.get('returnDate').updateValueAndValidity();
      }
    }

    resetPaxCabinClass() {
      this.cabinClassPatch = undefined;
      this.passengersPatch = undefined;
      this.flightSearchForm.get('passengers').setValue(undefined);
      this.flightSearchForm.get('passengers').markAsUntouched();
      this.flightSearchForm.get('passengers').updateValueAndValidity();
      this.flightSearchForm.get('cabinClass').setValue(undefined);
      this.flightSearchForm.get('cabinClass').markAsUntouched();
      this.flightSearchForm.get('cabinClass').updateValueAndValidity();
    }

    dateChanged(flag: boolean) {
      if (flag) {
        this.promocodeBody = this.createPromoCodeBody();
        this.searchHistoryModel.originDate = this.flightSearchForm.value.departureDate;
        this.departureDatePatch = this.flightSearchForm.value.departureDate;
        if (this.flightSearchForm.value.returnDate && this.flightSearchForm.value.tripType === 'R') {
          this.searchHistoryModel.destinationDate = this.flightSearchForm.value.returnDate;
          this.returnDatePatch = this.flightSearchForm.value.returnDate;
        }
        if (!this.patchTriggerIndicator && !this.isMobile) {
          this.nextFocus(null);
        }
      }

    }

    formatDate(date) {
      const monthNames = this.translations.BOOKING_APP.MONTHS;

      return `${monthNames[date.month - 1]} - ${date.day}`;
    }

    ngOnDestroy () {
      for (const sub of this.allSubs) {
        sub.unsubscribe();
      }
    }

    changeTrip(tripType: string) {

      if (!tripType) {
        return;
      }

      if (tripType === 'O' || tripType === 'R') {
        // ONEWAY & ROUND TRIP

        // // ADD CONTROLS
        // this.flightSearchForm.addControl('origin', this.createControl());
        // this.flightSearchForm.addControl('destination', this.createControl());
        // this.flightSearchForm.addControl('departureDate', this.createControl());
        // this.flightSearchForm.addControl('returnDate', this.createControl());
        // this.resetPaxCabinClass();
        // this.resetDates(null);
        // this.resetDestination(null);
        // this.resetOrigin(null);

        // // REMOVE CONTROLS FOR MULTI-CITY
        this.flightSearchForm.removeControl('origins');
        this.flightSearchForm.removeControl('destinations');
        this.flightSearchForm.removeControl('departureDates');

        // persisting values for one-way and round trip.
        this.originPatch = this.searchHistoryModel.origin;
        this.destinationPatch = this.searchHistoryModel.destination;
        this.departureDatePatch = this.searchHistoryModel.originDate;
        this.returnDatePatch = this.searchHistoryModel.destinationDate;
        this.cabinClassPatch = this.searchHistoryModel.cabinClass;
        this.passengersPatch = this.searchHistoryModel.passengers;
        if (this.searchHistoryModel.cabinClass) {
          this.flightSearchForm.patchValue({'cabinClass': this.searchHistoryModel.cabinClass});
          this.flightSearchForm.get('cabinClass').markAsTouched();
          this.flightSearchForm.get('cabinClass').updateValueAndValidity();
          this.cabinClassPatch = this.searchHistoryModel.cabinClass;
        } else {
          this.flightSearchForm.get('cabinClass').setValue(undefined);
          this.flightSearchForm.get('cabinClass').updateValueAndValidity();
        }
        if (this.searchHistoryModel.passengers) {
          this.flightSearchForm.patchValue({'passengers': this.searchHistoryModel.passengers});
          this.flightSearchForm.get('passengers').markAsTouched();
          this.flightSearchForm.get('passengers').updateValueAndValidity();
          this.passengersPatch = this.searchHistoryModel.passengers;
        } else {
          this.flightSearchForm.get('passengers').setValue(undefined);
          if (this.paxTouchFlag) {
            this.flightSearchForm.get('passengers').markAsTouched();
          } else {
            this.flightSearchForm.get('passengers').markAsUntouched();
          }
          this.flightSearchForm.get('passengers').updateValueAndValidity();
          this.passengersPatch = this.searchHistoryModel.passengers;
        }

        if (this.selectedNonMultiCityPaymentMethod) {
          this.flightSearchForm.patchValue({'paymentMethod': this.selectedNonMultiCityPaymentMethod});
          this.flightSearchForm.get('paymentMethod').markAsTouched();
          this.flightSearchForm.get('paymentMethod').updateValueAndValidity();
          setTimeout( () => {
            this._radioButtonService.setSelectedPaymentMethod(this.selectedNonMultiCityPaymentMethod);
          }, 0 );
        } else {
          if (this.paymentMethodTouchFlag) {
            this.flightSearchForm.get('paymentMethod').markAsTouched();
          } else {
            this.flightSearchForm.get('paymentMethod').markAsUntouched();
          }
        }
      } else if (tripType === 'M') {
        // MULTI-CITY

        // ADD CONTROLS
        this.flightSearchForm.addControl('origins', this._fb.array([
          this.createControl(), this.createControl()
        ]));
        this.flightSearchForm.addControl('destinations', this._fb.array([
          this.createControl(), this.createControl()
        ]));
        this.flightSearchForm.addControl('departureDates', this._fb.array([
          this.createControl(), this.createControl()
        ]));

        // // REMOVE ONEWAY & ROUNTRIP
        // this.flightSearchForm.removeControl('origin');
        // this.flightSearchForm.removeControl('destination');
        // this.flightSearchForm.removeControl('departureDate');
        // this.flightSearchForm.removeControl('returnDate');

        this.resetPaxCabinClass();

        if (!(this.market === MARKET_CODE_MOROCCO || this.market === MARKET_CODE_SENEGAL)) {
          this.resetPaymentMethod();
        }
      }

      this.currentRows = MULTICITY_MIN_ROWS;
    }

    validateAllFormFields(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormArray) {
          Object.keys(control.controls).forEach(subField => {
            const subControl = control.get(subField);
            subControl.markAsTouched({ onlySelf: true });
          });
        } else if (control instanceof FormGroup) {
          this.validateAllFormFields(control);
        }
        // persists touch value of passengers and paymentMethod for trip types O and R.
        if (field === 'passengers') {
          if (this.flightSearchForm.value.tripType !== 'M') {
            this.paxTouchFlag = true;
          } else {
            this.paxTouchFlag = false;
          }
        } else if (field === 'paymentMethod') {
          if (this.flightSearchForm.value.tripType !== 'M') {
            this.paymentMethodTouchFlag = true;
          } else {
            this.paymentMethodTouchFlag = false;
          }
        }
      });
    }

    onSubmit() {
      if (this.flightSearchForm.value.tripType === 'M') {
        // // REMOVE ONEWAY & ROUNTRIP
        this.flightSearchForm.removeControl('origin');
        this.flightSearchForm.removeControl('destination');
        this.flightSearchForm.removeControl('departureDate');
        this.flightSearchForm.removeControl('returnDate');
      }

      let deviceType = DEVICE_TYPE_WEB;
      if (this.isMobile) {
        deviceType = DEVICE_TYPE_MOBILE;
      }

      if (sessionStorage.getItem(LANGUAGE_KEY) === 'en') {
        sessionStorage.setItem(LANGUAGE_KEY, 'gb');
      }
      console.log(this.flightSearchForm);

      console.log('formulario válido?:' + this.flightSearchForm.status);
      if (sessionStorage.getItem(PAYMENT_METHOD) === null) {
        sessionStorage.setItem(PAYMENT_METHOD, DEFAULT_PAYMENT_METHOD);
      }

      if (this.flightSearchForm.valid) {
        if (this.flightSearchForm.value.tripType !== 'M') {
          if (this.flightSearchForm.value.tripType !== 'R') {
            this.searchHistoryModel.destinationDate = null;
          }
          try {
            this._cookieService.setSearchHistoryCookie(SEARCH_LIST_COOKIE, this.searchHistoryModel);
          } catch {
            console.log('Error encountered on saving the search history. Proceeding with the e-retail API call..');
          }
        }
        if (E_RETAIL_ACTIVATED) {
          const payWithMilesInd = this.flightSearchForm.value.payWithMilesInd;
          if (payWithMilesInd || this.redemption) {
            const eRetailPayWithMilesRequestData = new ERetailPayWithMilesSearchRequest(this.flightSearchForm.value,
                                                                  deviceType, this._dateService);
            this._bookingService.getPayWithMilesRedirectionDetails(eRetailPayWithMilesRequestData).subscribe((response: any) => {
              if (response.status === '302' ) {
                  window.location.href = response.data.url + '?' + response.data.body;
                  // window.open(response.data.url+'?'+ response.data.body);// <-- if they want to redirect on new tab.
              }}, (error) => {
            });
          } else {
            const eRetailRequestData = new ERetailSearchRequest(this.flightSearchForm.value, deviceType, this._dateService);
            this._bookingService.askIfRetail(eRetailRequestData).subscribe((response: any) => {
              if (response.status === '302' ) {
                  window.location.href = response.data.url + '?' + response.data.body;
                  // window.open(response.data.url+'?'+ response.data.body);// <-- if they want to redirect on new tab.
              }}, (error) => {
            });
          }
        } else {
          const requestData = new BookingSearchRequest(this.flightSearchForm.value , this._dateService);
          const availabilitySubscription = this._bookingService.getAvailability(requestData).pipe(map(availability => {
            const availabilities = [];
            for (const o in availability) {
              if (availability.hasOwnProperty(o)) {
                availabilities.push(availability[o]);
              }
            }
            return availabilities;
          }))
          .subscribe(
            (availability: any) => {
              if (!availability) {
                return;
              }
              sessionStorage.setItem('tripType', this.flightSearchForm.get('tripType').value);
              sessionStorage.setItem('passengersType', JSON.stringify(this.flightSearchForm.controls['passengers'].value));
            }
          );
          this.allSubs.push(availabilitySubscription);
        }
      } else {
        this.validateAllFormFields(this.flightSearchForm);
        // retrieve the removed controls and values for non multi-city
        if (this.flightSearchForm.value.tripType === 'M') {
          this.flightSearchForm.addControl('origin', this.createControl());
          this.flightSearchForm.addControl('destination', this.createControl());
          this.flightSearchForm.addControl('departureDate', this.createControl());
          this.flightSearchForm.addControl('returnDate', this.createControl());
          this.patchSelectedSearchHistory(this.searchHistoryModel, false);
        }
      }
    }

    patchCabinType(value) {

      this.flightSearchForm.patchValue({'cabinClass': value});
      this.flightSearchForm.get('passengers').markAsTouched();
      this.promocodeBody = this.createPromoCodeBody();
      // this.calendarPriceInput = this.createCalendarPriceInput(null);
      if (this.flightSearchForm.value.tripType !== 'M') {
        this.searchHistoryModel.passengers = this.flightSearchForm.value.passengers;
        this.searchHistoryModel.cabinClass = this.flightSearchForm.value.cabinClass;
        this.resetFocus();
      } else {
        if (!this.isMobile) {
        this.multiCityFocus[0].paxInputFocus = false;
        this.multiCityFocus[1].destinationInputFocus = true;
        }
      }
    }

    tripTypeChanged (value) {
      let tripTypeValue;
      this.direction = this._languageService.getDir();
      if (value) {
        this.preSelectTabHeaderIndex = this.tabHeaders.indexOf(value);
      }
      // this.searchHistoryModel = {
      //   originDate: null,
      //   destinationDate: null,
      //   origin: null,
      //   destination: null,
      //   tripType: null,
      //   cabinClass: null,
      //   passengers: null
      // };
      this.destinationInputFocus = false;
      this.dateInputFocus1 = false;
      this.paxInputFocus = false;
      this.dateInputFocus2 = false;
      this.paxInputFocus = false;
      this.multiCityFocus = [
        {
          originInputFocus: false,
          destinationInputFocus: false,
          multiCityDate: false,
          paxInputFocus: false,
        },
        {
          originInputFocus: false,
          destinationInputFocus : false,
          multiCityDate: false,
          paxInputFocus: false,
        }
      ];
      this.destinationSourceArr[0] = [];
      this.destinationSourceArr[1] = [];
      switch (value) {
        case this.tabHeaders[0]: tripTypeValue = 'R'; break;
        case this.tabHeaders[1]: tripTypeValue = 'O'; break;
        case this.tabHeaders[2]: tripTypeValue = 'M'; break;
      }
      this.flightSearchForm.patchValue({'tripType': tripTypeValue});
      this.searchHistoryModel.tripType = tripTypeValue;
      this.changeTrip(tripTypeValue);
      this.originCountryNameForMulti = [];
      this.setShowPaymentMethod();
    }

    resetPaymentMethod() {
      this._radioButtonService.setSelectedPaymentMethod(null);
      this.flightSearchForm.get('paymentMethod').setValue(undefined);
      this.flightSearchForm.get('paymentMethod').setValidators(null);
      this.flightSearchForm.get('paymentMethod').markAsUntouched();
      this.flightSearchForm.get('paymentMethod').updateValueAndValidity();
    }

    createControl(): FormControl {
      return this._fb.control(null, Validators.required);
    }

    addRow(): void {
      if (this.currentRows < this.maxRows) {
        // ADD NEW CONTROL TO THE ORIGINS FOR MULTI-CITY
        this.origins = this.flightSearchForm.get('origins') as FormArray;
        this.origins.push(this.createControl());
        // ADD NEW CONTROL TO THE DESTINATIONS FOR MULTI-CITY
        this.destinations = this.flightSearchForm.get('destinations') as FormArray;
        this.destinations.push(this.createControl());
        // ADD NEW CONTROL TO THE DEPARTUREDATES FOR MULTI-CITY
        this.departureDates = this.flightSearchForm.get('departureDates') as FormArray;
        this.departureDates.push(this.createControl());
        this.currentRows++;
      }
    }

    removeRow(i): void {
      this.origins.removeAt(i);
      this.destinations.removeAt(i);
      this.departureDates.removeAt(i);
      this.currentRows--;
    }

    checkMobileView() {
      this._mobileService.getIsMobile().subscribe(value => this.isMobile = value);
    }

    getDropdownLabel($event: LocationOutputModel) {
      console.log($event);
    }

    createCalendarPriceInput(position: number) {
      const calPriceInput = new CalendarPriceDateModel(this.flightSearchForm.value);
      return calPriceInput;
    }

    onSelectedPaymentMethod(selectedPaymentMethod: string) {
      sessionStorage.setItem(PAYMENT_METHOD, selectedPaymentMethod);
      this.flightSearchForm.patchValue({'paymentMethod': selectedPaymentMethod});
      this.promocodeBody = this.createPromoCodeBody();
      if (this.flightSearchForm.value.tripType !== 'M') {
        this.selectedNonMultiCityPaymentMethod = selectedPaymentMethod;
      }
      console.log(selectedPaymentMethod);
    }

    onClickPayWithMilesLink() {
    let loginURl = LOGIN_URL;
    if (sessionStorage.getItem(LOGIN_URL_SESSION_KEY)) {
      loginURl = sessionStorage.getItem(LOGIN_URL_SESSION_KEY);
    }
      window.location.href = loginURl;
    }

    onHideSearchHistory() {
      this.showSearchHistory = false;
      this._searchHistoryService.hideSearchHistory();
    }

    ngOnChanges() {
      this.fetchFromTranslation();
    }

    updateSelectionForMulticity(position: number) {
      const destinationDatesArr = this.flightSearchForm.get('departureDates');
      // let changedDateValue = destinationDatesArr.get('' + position).value;
      this.promocodeBody = this.createPromoCodeBody();
      for (let i = position + 1; i <= this.currentRows - 1; i++) {
        if (destinationDatesArr.get('' + i).value) {
          destinationDatesArr.get('' + i).setValue(undefined);
          destinationDatesArr.get('' + i).markAsUntouched();
          destinationDatesArr.get('' + i).updateValueAndValidity();
        }
      }
      if (!this.patchTriggerIndicator && !this.isMobile) {
        this.nextFocus(position);
      }
    }

  /* searchHistoryTriggerflag will be true if patch is triggered by selecting search history.
    This will be false if it's coming from search button to handle persisting of values for one-way and round trip.
    */
  patchSelectedSearchHistory(history: HistorySearchModel, searchHistoryTriggerflag: boolean) {
    this.searchHistoryModel = new SearchHistoryObject(history);
    this.patchTriggerIndicator = true;
    this.destinationInputFocus = false;
    this.dateInputFocus1 = false;
    this.paxInputFocus = false;
    this.dateInputFocus2 = false;
    this.paxInputFocus = false;

    if (history.tripType && searchHistoryTriggerflag) {
      const tripTypeValue = history.tripType;
      switch (tripTypeValue) {
        case 'R': this.preSelectTabHeaderIndex = 0; break;
        case 'O': this.preSelectTabHeaderIndex = 1; break;
      }
      this.flightSearchForm.patchValue({'tripType': tripTypeValue});
      this.changeTrip(tripTypeValue);
    }
    if (history.origin) {
      this.originPatch = history.origin;
      if (history.tripType !== 'M') {
        this.originCountryName = history.origin.location.countryName;
      } else {
        this.originCountryName = '';
      }
      this.setShowPaymentMethod();
      this.flightSearchForm.patchValue({'origin': [history.origin.code]});
      this.flightSearchForm.get('origin').markAsTouched();
      this.flightSearchForm.get('origin').updateValueAndValidity();
      this.originChanged(history.origin, null);
    }
    if (history.destination) {
      this.destinationPatch = history.destination;
      this.flightSearchForm.patchValue({'destination': [history.destination.code]});
      this.flightSearchForm.get('destination').markAsTouched();
      this.flightSearchForm.get('destination').updateValueAndValidity();
    }
    if (history.originDate) {
      this.flightSearchForm.patchValue({'departureDate': history.originDate});
      this.flightSearchForm.get('departureDate').markAsTouched();
      this.flightSearchForm.get('departureDate').updateValueAndValidity();
      this.departureDatePatch = history.originDate;
    }
    if (history.destinationDate) {
      this.flightSearchForm.patchValue({'returnDate': history.destinationDate});
      this.flightSearchForm.get('returnDate').markAsTouched();
      this.flightSearchForm.get('returnDate').updateValueAndValidity();
      this.returnDatePatch = history.destinationDate;
    }
    if (history.cabinClass && searchHistoryTriggerflag) {
      this.flightSearchForm.patchValue({'cabinClass': history.cabinClass});
      // if (flag) {
        this.flightSearchForm.get('cabinClass').markAsTouched();
      this.flightSearchForm.get('cabinClass').updateValueAndValidity();
      // }
      this.cabinClassPatch = history.cabinClass;
    }

    if (history.passengers && searchHistoryTriggerflag) {
      this.flightSearchForm.patchValue({'passengers': history.passengers});
      // if (flag) {
        this.flightSearchForm.get('passengers').markAsTouched();
        this.flightSearchForm.get('passengers').updateValueAndValidity();
      // }
      this.passengersPatch = history.passengers;
    }
    this.patchTriggerIndicator = false;
  }

  resetFocus() {
    this.paxInputFocus = false;
  }

  nextFocus(index = 0) {
    switch (this.flightSearchForm.value.tripType) {
      case 'R':
        if (this.flightSearchForm.controls.origin.status === 'VALID' &&
          this.flightSearchForm.controls.destination.status === 'INVALID' &&
          this.flightSearchForm.controls.departureDate.status === 'INVALID' &&
          this.flightSearchForm.controls.returnDate.status === 'INVALID' &&
          this.flightSearchForm.controls.passengers.status === 'INVALID') {
            this.destinationInputFocus = true;
        } else if (this.flightSearchForm.controls.origin.status === 'VALID' &&
          this.flightSearchForm.controls.destination.status === 'VALID' &&
          this.flightSearchForm.controls.departureDate.status === 'INVALID' &&
          this.flightSearchForm.controls.returnDate.status === 'INVALID') {
          this.dateInputFocus1 = true;
          this.paxInputFocus = false;
        } else if (this.flightSearchForm.controls.origin.status === 'VALID' &&
          this.flightSearchForm.controls.destination.status === 'VALID' &&
          this.flightSearchForm.controls.departureDate.status === 'VALID' &&
          this.flightSearchForm.controls.returnDate.status === 'VALID') {
          this.paxInputFocus = true;

          }
        break;
      case 'O':
        if (this.flightSearchForm.controls.origin.status === 'VALID' &&
          this.flightSearchForm.controls.destination.status === 'INVALID' &&
          this.flightSearchForm.controls.departureDate.status === 'INVALID' &&
          this.flightSearchForm.controls.passengers.status === 'INVALID') {
          this.destinationInputFocus = true;
        } else if (this.flightSearchForm.controls.origin.status === 'VALID' &&
          this.flightSearchForm.controls.destination.status === 'VALID' &&
          this.flightSearchForm.controls.departureDate.status === 'INVALID') {
            this.dateInputFocus2 = true;
            this.paxInputFocus = false;
        } else if (
          this.flightSearchForm.controls.origin.status === 'VALID' &&
          this.flightSearchForm.controls.destination.status === 'VALID' &&
          this.flightSearchForm.controls.departureDate.status === 'VALID') {
            this.paxInputFocus = true;
        }
        break;
      case 'M':

        if (this.flightSearchForm.controls['origins']['controls'][index]['status'] === 'VALID' &&
          this.flightSearchForm.controls['destinations']['controls'][index]['status'] === 'INVALID' &&
          this.flightSearchForm.controls['departureDates']['controls'][index]['status'] === 'INVALID' &&
          this.flightSearchForm.controls['passengers']['status'] === 'INVALID') {
            this.multiCityFocus[index].destinationInputFocus = true;
        } else if (this.flightSearchForm.controls['origins']['controls'][index]['status'] === 'VALID' &&
          this.flightSearchForm.controls['destinations']['controls'][index]['status'] === 'VALID' &&
          this.flightSearchForm.controls['departureDates']['controls'][index]['status'] === 'INVALID' ) {
          this.multiCityFocus[index].multiCityDate = true;
          this.multiCityFocus[0].paxInputFocus = false;
        } else if (this.flightSearchForm.controls['origins']['controls'][index]['status'] === 'VALID' &&
          this.flightSearchForm.controls['destinations']['controls'][index]['status'] === 'VALID' &&
          this.flightSearchForm.controls['departureDates']['controls'][index]['status'] === 'VALID') {
            if (index === 0 ) {
              this.multiCityFocus[0].paxInputFocus = true;
            }

          }
        break;
      default:
        break;
    }
  }

}
