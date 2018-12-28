import { Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Output, EventEmitter,
  OnDestroy } from '@angular/core';
import { NgbCalendar, NgbInputDatepicker, NgbDatepickerI18n, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerService } from '../../../core/services/datepicker.service';
import { FormControl, Validators } from '@angular/forms';
import { MobileService } from '../../../core/services/mobile.service';
import { E_PRICING_MAX_NIGHTS, E_PRICING_MAX_DAY_NIGHTS } from '../../../configs/app-settings.config';
import { BookingService } from '../../../core/services/booking.service';
import { DateService } from '../../../core/services/date.service';
import { CalendarPriceDateInputModel } from '../../models/calendar-price-input-model';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { LanguageService } from '../../../core/services/language.service';
import { Subscription } from 'rxjs';
import { NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { CommonsEPricingService } from '../../../core/services/commons-epricing.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NgbDatepickerI18n,
      useClass: DatePickerService
    }
  ]
})
export class DatePickerComponent implements OnInit, OnChanges, OnDestroy {

  // CONFIG
  minDate: NgbDate;
  @Input() startDate;
  @Input() displayMonths = 1;
  @Input() autoClose = 'outside';
  @Input() navigation = 'arrows';
  @Input() outsideDays = 'collapsed';
  @Input() isOneway = true;
  @Input() returnDateControl: FormControl;
  @Input() departureDateControl: FormControl;
  @Input() disabled = false;
  @Input() calendarPriceInput: CalendarPriceDateInputModel;
  @Input() translations;
  @Input() fromDatePatch: NgbDate;
  @Input() toDatePatch: NgbDate;
  @Input() dateFocus:boolean = false;
  calendarPrices: any[] = [];

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  destinationDateLabel: string;
  arrivalDateLabel: string;
  state: string;
  datepickerWidth: string;

  mobileDisplay = {departure : { header: 'Departure', subHeader: 'Choose date'}, arrival : {header : 'Arrival', subHeader: 'Choose date'}};

  isMobile = false;
  direction: string;

  private datepickerState: ElementRef;
  @ViewChild('dpinput') datepickerInput: ElementRef;
  @ViewChild('dp') datepicker: NgbInputDatepicker;
  @ViewChild('dpstate') set content(content: ElementRef) {
    this.datepickerState = content;
  }

  allSubs: Subscription[] = [];

  constructor(private calendar: NgbCalendar,
    private _bookingService: BookingService,
    private _dateService: DateService,
    private mobileService: MobileService,
    private _languageService: LanguageService,
    private _epricingService: CommonsEPricingService) { }

  ngOnInit() {
    this.checkWidthForDatePicker();
    this.minDate = this.calendar.getToday();
    registerLocaleData( es );
    const languageSubscription = this._languageService.directionUpdate$.subscribe(data => {
        if (data) {
          this.direction = data;
        }
    });
    this.allSubs.push(languageSubscription);
  }

  ngOnChanges(simplechange: SimpleChanges) {
    this.direction = this._languageService.getDir();
    this.fetchFromTranslation();
    this.state = this.destinationDateLabel;
    if (this.fromDatePatch) {
      this.fromDate = this.fromDatePatch;
    } else {
      this.fromDate = undefined;
    }
    if (this.toDatePatch) {
      this.toDate = this.toDatePatch;
    } else {
      this.toDate = undefined;
    }
    if (simplechange.isOneway) {
      if (simplechange.isOneway.currentValue) {
        this.displayMonths = 1;
        if (this.returnDateControl) {
          this.returnDateControl.setValidators(null);
          this.returnDateControl.setValue(null);
          this.returnDateControl.updateValueAndValidity();
        }
      } else {
        this.displayMonths = 2;
        if (this.returnDateControl) {
          this.returnDateControl.setValidators(Validators.required);
          this.returnDateControl.updateValueAndValidity();
        }
      }
    }
  }

  onClick() {
    
    if (this.returnDateControl) {
      this.returnDateControl.markAsTouched();
      if (!this.returnDateControl.value) {
        this.toDate = undefined;
      }
    }

    if (this.departureDateControl) {
      this.departureDateControl.markAsTouched();
      if (!this.departureDateControl.value) {
        this.fromDate = undefined;
        this.hoveredDate = undefined;
      }
    }

    if (this.calendarPriceInput && (this.isOneway || (!this.isOneway && !this.fromDate))) {
      // let requestPayload: CalendarPriceRequestModel = this.createCalendarPricePayload();
      // this.getCalendarPrices(requestPayload);
      this.getCalendarPriceForDate(this.minDate);
    }
    this.datepicker.toggle();
    this.datepickerWidth = this.datepickerInput.nativeElement.lastElementChild.offsetWidth + 'px';
  }

  onDateSelection(date: NgbDate) {
    if (this.isOneway) {
      this.fromDate = date;
      this.toDate = undefined;
      this.datepicker.close();
      this.departureDateControl.patchValue(this.fromDate);
      this.departureDateControl.markAsTouched();
      this.formateDateForMobile();
      if (this.returnDateControl) {
        this.returnDateControl.patchValue(null);
      }
      this.notify.emit(true);

    } else {
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
        this.toDate = undefined;
        this.state = this.arrivalDateLabel;
        this.departureDateControl.patchValue(this.fromDate);
        this.returnDateControl.patchValue(null);
        this.departureDateControl.markAsTouched();
        this.returnDateControl.markAsTouched();
        if (this.calendarPriceInput) {
          this.getCalendarPriceForSelectedDepatureDate(this.fromDate);
        }
        this.formateDateForMobile();
      } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
        this.toDate = date;
        this.datepicker.close();
        this.state = this.destinationDateLabel;
        this.returnDateControl.patchValue(this.toDate);
        this.notify.emit(true);
        this.formateDateForMobile();
      } else {
        this.toDate = undefined;
        this.fromDate = date;
        this.state = this.arrivalDateLabel;
        this.departureDateControl.patchValue(this.fromDate);
        this.returnDateControl.patchValue(null);
        if (this.calendarPriceInput) {
          this.getCalendarPriceForSelectedDepatureDate(this.fromDate);
        }
        this.formateDateForMobile();
      }
  }


  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  checkWidthForDatePicker() {
    this.mobileService.getIsMobile().subscribe(value => this.isMobile = value);
    if (this.isMobile) {
      this.displayMonths = 1;
    }
  }

  formateDateForMobile() {
    const days = this.translations.BOOKING_APP.DAYS;
    const ordinals: string[] = ['th', 'st', 'nd', 'rd'];
    const monthNames = this.translations.BOOKING_APP.MONTHS_ABBREVIATED;
    const parseFromDate = new Date(
      this.fromDate.year,
      this.fromDate.month - 1,
      this.fromDate.day
    );

    const departureDateOrdinal = (ordinals[(parseFromDate.getDate() - 20 ) % 10] || ordinals[parseFromDate.getDate() ] || ordinals[0]);

    this.mobileDisplay.departure.header = days[parseFromDate.getDay()];
    this.mobileDisplay.departure.subHeader = parseFromDate.getDate() + departureDateOrdinal + '' + monthNames[parseFromDate.getMonth()];

    const arrivalDateOrdinal = (ordinals[(parseFromDate.getDate() - 20 ) % 10] || ordinals[parseFromDate.getDate() ] || ordinals[0]);

    if (this.toDate ) {
      const parseToDate = new Date(
        this.toDate.year,
        this.toDate.month - 1,
        this.toDate.day
      );
      this.mobileDisplay.arrival.header = days[parseToDate.getDay()];
      this.mobileDisplay.arrival.subHeader = parseToDate.getDate() + arrivalDateOrdinal + '' + monthNames[parseToDate.getMonth()];
    }
  }

  addDays(date: Date): Date {
    const result = new Date(date);
    const addend = E_PRICING_MAX_NIGHTS;
    result.setDate(date.getDate() + addend);
    return result;
  }

  getPrice(date: NgbDateStruct) {
    const calendarDate = date.year + '-' + `0${date.month}`.slice(-2) + '-' + `0${date.day}`.slice(-2);
    if (this.calendarPrices[calendarDate] && this.calendarPrices[calendarDate].amount) {
      return this.calendarPrices[calendarDate].amount;
    }
  }

  getCurrency(date: NgbDateStruct) {
    const calendarDate = date.year + '-' + `0${date.month}`.slice(-2) + '-' + `0${date.day}`.slice(-2);
    if (this.calendarPrices[calendarDate] && this.calendarPrices[calendarDate].amount) {
      const currencyCode = this.calendarPrices[calendarDate].currencyCode;
      return currencyCode;
    }
  }

  closeDatepicker() {
    this.datepicker.close();
  }

  isWeakCurrency(date: NgbDateStruct) {
    let isWeakCurrency = false;
    const calendarDate = date.year + '-' + `0${date.month}`.slice(-2) + '-' + `0${date.day}`.slice(-2);
    if (this.calendarPrices[calendarDate] && this.calendarPrices[calendarDate].amount) {
      const amount = JSON.stringify(this.calendarPrices[calendarDate].amount);
      const decimalIndex = amount.indexOf('.');
      const roundedAmt = amount.substring(0, decimalIndex);
      if (roundedAmt.length > 3) {
        isWeakCurrency = true;
      }
    }
    return isWeakCurrency;
  }

  ngOnDestroy () {
    for (const sub of this.allSubs) {
      sub.unsubscribe();
    }
  }

  fetchFromTranslation() {
    if (this.translations) {
      this.destinationDateLabel = this.translations.BOOKING_APP.BOOK_A_FLIGHT.DEPARTURE_DATE;
      this.arrivalDateLabel = this.translations.BOOKING_APP.BOOK_A_FLIGHT.RETURN_DATE;
    }
  }

  onNavigate(event: NgbDatepickerNavigateEvent) {
    if (event.current) {
      let basisDate: NgbDateStruct = {year: event.next.year, month: event.next.month, day: 1};
      if (this.minDate.after(NgbDate.from(basisDate))) {
        basisDate = this.minDate;
      }
      if (this.calendarPriceInput && (this.isOneway || (!this.isOneway && !this.fromDate))) {
        this.getCalendarPriceForDate(basisDate);
      }
    }
  }

  getCalendarPriceForDate(startDate: any) {
    console.log(startDate);
    const formattedEndDate =  this.addDays(new Date(this._dateService.formatDate(startDate)));
    const endDateMonth = formattedEndDate.getMonth().toString().length === 1 ? '0'
                        + (formattedEndDate.getMonth() + 1) : (formattedEndDate.getMonth() + 1);
    const endDateDay = formattedEndDate.getDate().toString().length === 1 ? '0' + formattedEndDate.getDate() : formattedEndDate.getDate();
    const startDateMonth = startDate.month.toString().length === 1 ? ('0' + startDate.month) : startDate.month;
    const startDateDay = startDate.day.toString().length === 1 ? ('0' + startDate.day) : startDate.day;
    const requestParam = {
      'startDate' : startDate.year + '-' + startDateMonth + '-' + startDateDay,
      'endDate' : formattedEndDate.getFullYear() + '-' + endDateMonth + '-' + endDateDay,
      'directFlight' : this.calendarPriceInput.directFlight,
      'maxDayNights' : E_PRICING_MAX_DAY_NIGHTS,
      'entityId' : this.calendarPriceInput.entityId,
      'market' : this.calendarPriceInput.market,
      'origin' : this.calendarPriceInput.origin,
      'destination': this.calendarPriceInput.destination,
      'tripType' : this.calendarPriceInput.tripType,
      'cabinClass' : this.calendarPriceInput.cabinClass
    };
    this._epricingService.getCalendarPricesForDates(requestParam).subscribe(
      (response: any) => {
        if (response.status = '200') {
          const data = response.data;
          if (data) {
            if (data.bestPriceForDates) {
              data.bestPriceForDates.forEach(priceItem => {
                this.calendarPrices[priceItem.departureDate.substr(0, priceItem.departureDate.indexOf('T'))] = {
                  'amount': priceItem.bestTotalPrice, 'currencyCode': priceItem.currency};
              });
            }
          }
        }
      },
      error => {
        if (error.status === 404) {
          console.log('error request', error);
        }
      },
    );
  }

  getCalendarPriceForSelectedDepatureDate(departureDate: any) {
    const departureDateMonth = departureDate.month.toString().length === 1 ? ('0' + departureDate.month) : departureDate.month;
    const departureDateDay = departureDate.day.toString().length === 1 ? ('0' + departureDate.day) : departureDate.day;
    const requestParam = {
      'departureDate' : departureDate.year + '-' + departureDateMonth + '-' + departureDateDay,
      'directFlight' : this.calendarPriceInput.directFlight,
      'maxNights' : E_PRICING_MAX_NIGHTS,
      'entityId' : this.calendarPriceInput.entityId,
      'market' : this.calendarPriceInput.market,
      'origin' : this.calendarPriceInput.origin,
      'destination': this.calendarPriceInput.destination,
      'tripType' : this.calendarPriceInput.tripType,
      'cabinClass' : this.calendarPriceInput.cabinClass
    };
    this._epricingService.getCalendarPricesForDepartures(requestParam).subscribe(
      (response: any) => {
        if (response.status = '200') {
          this.calendarPrices = [];
          const data = response.data;
          if (data) {
            if (data.returns) {
              data.returns.forEach(priceItem => {
                this.calendarPrices[priceItem.returnDate.substr(0, priceItem.returnDate.indexOf('T'))] = {
                  'amount': priceItem.price, 'currencyCode': data.currency};
              });
            }
          }
        }
      },
      error => {
        if (error.status === 404) {
          console.log('error request', error);
        }
      },
    );
  }

  checkSelected(date: NgbDate) {
    let returnVal = null;
    if (date.equals(this.fromDate)) {
      returnVal = 'selected';
    }

    if (date.equals(this.toDate)) {
      returnVal = 'selected';
    }
    return returnVal;
  }

  closeDropdown(){
    this.datepicker.close();
  }


}
