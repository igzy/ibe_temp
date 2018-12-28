import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { RadioButtonChoiceModel } from '../../models/radio-button-option-model';
import { MobileService } from '../../../core/services/mobile.service';
import { BOOKING_MA_CARD,
  BOOKING_INT_CARD,
  BOOKING_CASH} from '../../../configs/app-settings.config';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit, OnChanges {
  @Input() market;
  @Input() countryName;
  @Input() dropdownLabel;
  @Input() leftIcon;
  @Input() rightIcon = 'fa fa-angle-down';
  @Input() dropdownBodyClass;
  @Input() translations;
  
  @Output() selectedPaymentMethod: EventEmitter<string> = new EventEmitter<string>();
  choices: RadioButtonChoiceModel[];
  
  marketPaymentMethods;
  countryNamePaymentMethods;

  isMobile = false;
  isDropdownVisible = false;
  mobPaymentMethodDescription: string;

  constructor(private _mobileService: MobileService) { }

  ngOnInit() {
    //this.choices = this.paymentMethods[this.market];

  }

  ngOnChanges(){
    if (this.translations) {
      //check first if there's a payment method for market. if there's none, check by country name
      if (this.getPaymentMethodForMarket()) {
        this.choices = this.getPaymentMethodForMarket();
      //check if there's a payment method for country name
      } else if (this.getPaymentMethodForCountryName()) {
        this.choices = this.getPaymentMethodForCountryName();
      }
    }
  }

  getPaymentMethodForMarket() {
    this.marketPaymentMethods = {
      'MA' : [{description: this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAYMENT_MOROCCAN_CREDIT_CARD, value: BOOKING_MA_CARD}, 
                  {description: this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAYMENT_INTERNATIONAL_CREDIT_CARD, value: BOOKING_INT_CARD},
                  {description: this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAYMENT_CASH, value: BOOKING_CASH}],
      'SN' : [{description: this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAYMENT_INTERNATIONAL_CREDIT_CARD, value: BOOKING_INT_CARD},
                   {description: this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAYMENT_CASH, value: BOOKING_CASH}],
    };
    if (this.marketPaymentMethods[this.market]) {
      return this.marketPaymentMethods[this.market];
    }
  }

  getPaymentMethodForCountryName() {
    this.countryNamePaymentMethods = {
      'MA' : [{description: this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAYMENT_MOROCCAN_CREDIT_CARD, value: BOOKING_MA_CARD}, 
                  {description: this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAYMENT_INTERNATIONAL_CREDIT_CARD, value: BOOKING_INT_CARD}]
    };
    if (this.countryNamePaymentMethods[this.countryName]) {
      return this.countryNamePaymentMethods[this.countryName];
    }
  }

  onSelectedChoiceEvent(paymentMethod: string){
    //console.log(paymentMethod);
    this.selectedPaymentMethod.emit(paymentMethod);
    switch (paymentMethod) {
      case BOOKING_MA_CARD:
      this.mobPaymentMethodDescription = this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAYMENT_MOROCCAN_CREDIT_CARD;
      break;
      case BOOKING_INT_CARD:
      this.mobPaymentMethodDescription = this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAYMENT_INTERNATIONAL_CREDIT_CARD;
      break;
      case BOOKING_CASH:
      this.mobPaymentMethodDescription = this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAYMENT_CASH;
      break;
    }
    //console.log(this.mobPaymentMethodDescription);
    this.isDropdownVisible = false;
   }

  checkIfMobile(){
	  this._mobileService.getIsMobile().subscribe(value => this.isMobile = value);
  }

  onFocus() {
      this.isDropdownVisible = !this.isDropdownVisible;
  }

}
