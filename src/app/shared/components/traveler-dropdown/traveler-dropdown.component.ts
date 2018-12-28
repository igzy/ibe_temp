import { Component, OnInit, Input, Output, EventEmitter, forwardRef, OnChanges, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonsBfmService } from '../../../core/services/commons-bfm.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MobileService } from '../../../core/services/mobile.service';

@Component({
  selector: 'app-traveler-dropdown',
  templateUrl: './traveler-dropdown.component.html',
  styleUrls: ['./traveler-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TravelerDropdownComponent)
    }
  ]
})
export class TravelerDropdownComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() origin;
  @Input() destination;
  @Input() translations;
  @Input() control: FormControl;
  @Input() cabinClassPatch;
  @Input() passengersPatch;
  _showDropdown: boolean;

  @Input() isDateValid = false;

  @Output() selectionChanged: EventEmitter<string> = new EventEmitter<string>(); paxTypes: any;

  @ViewChild('selectClass') selectClass: ElementRef;
  passengers: any;
  paxNumbers = [];
  paxMaxNumber: number;
  paxMaxType: any;
  isDropdownVisible = false;
  chosenClass = '';
  flightClassValue;
  disableDropdown = true;
  // adultCount = 1;
  // childCount = 0;
  // infantCount = 0;
  totalPassengerCount: number;
  @Input() paxInputFocus = false;
  counterData: any;

  get showDropdown(): boolean {
    return this._showDropdown;
  }

  @Input()
  set showDropdown(showDropdown) {
    this._showDropdown = showDropdown;
  }

  isMobile = false;
  // totalPax: number =  0;

  constructor(private _commonsBfmService: CommonsBfmService, private mobileService: MobileService, private elRef: ElementRef) {}

  ngOnInit() {
    this.fetchFromTranslation();
    this.passengers = {
      ADT: 1
    };
    this.flightClassValue = 'E';
    this.checkIfMobile();
    this.totalPassengerCount = this.getTotalPassengers();
  }

  ngOnChanges() {
    console.log(this.control);
    if (this.origin !== undefined && this.destination !== undefined && this.origin && this.destination) {
      this.disableDropdown = false;
      this._commonsBfmService
      .getPassengerTypes(
        sessionStorage.marketcode,
        this.origin[0],
        this.destination[0],
        sessionStorage.tripType
      )
      .subscribe(data => {
        this.paxMaxType = data.data.pax.types;
        this.paxMaxNumber = data.data.pax.rules.tot;
        // console.log('paxMaxType', this.paxMaxType);
        this.paxTypes = Object.getOwnPropertyNames(
          data.data.pax.types
        );
        // console.log('this.paxTypes', this.paxTypes);
        this.reOrderPaxType();
        this.paxNumbers = [];
        if (this.passengersPatch) {
          for (let i = 0; i < this.paxTypes.length; i++) {
              const paxTypeCount = this.passengersPatch[this.paxTypes[i]];
              this.paxNumbers.push(paxTypeCount);
              this.totalPassengerCount = this.getTotalPassengers();
          }
        } else {
          for (let i = 0; i < this.paxTypes.length; i++) {
              if (this.paxTypes[i] === 'ADT') {
                this.paxNumbers.push(1);
              } else {
                this.paxNumbers.push(0);
              }
          }
        }
      });
    } else {

      this.disableDropdown = true;
    }

    if (this.cabinClassPatch) {
      this.flightClassValue = this.cabinClassPatch;
      this.updateChoseClass();
    }


    if(this.isDateValid){
      setTimeout(()=>{
        this.updateChoseClass();
        for (let i = 0; i < this.paxTypes.length; i++) {
          this.passengers[this.paxTypes[i]] = this.paxNumbers[i];
        }
        this.propagateChange(this.passengers);
        this.selectionChanged.emit(this.flightClassValue);
        if(!this.isMobile){
          this.isDropdownVisible = true;
        }

      },0);

    }
    this.fetchFromTranslation();
  }

  reOrderPaxType() {
    // temporay fix only since no age is available yet for sorting of the types;
    const chdPos = this.paxTypes.indexOf('CHD');
    const infPos = this.paxTypes.indexOf('INF');
    const newchdPos = infPos;
    const newInfPos = chdPos;
    this.paxTypes[newchdPos] = 'CHD';
    this.paxTypes[newInfPos] = 'INF';
  }

  onFocus(value: number) {
    if(value === 0 ){
      this.isDropdownVisible = true;
    }else {
      this.isDropdownVisible = false;
    }

  }


  incrementCount(index) {
    if (this.paxMaxNumber === this.getTotalPassengers() || this.paxNumbers[index] === this.paxMaxType[this.paxTypes[index]].max) {
      // Do Nothing
    } else {
      this.paxNumbers[index] += 1;
    }
    // this.totalPax = this.getTotalPassengers();
  }

  decrementCount(index) {
    if (this.paxNumbers[index] === this.paxMaxType[this.paxTypes[index]].min) {
      // Do Nothing
    } else {
      this.paxNumbers[index] -= 1;
    }
    // this.totalPax = this.getTotalPassengers();
  }

  getTotalPassengers() {
    if (!this.paxNumbers) {
      return 1;
    } else {
      let total = 0;

      for (let i = 0; i < this.paxNumbers.length; i++) {
        total += this.paxNumbers[i];
      }
      return total;
    }
  }

  // ControlValueAccessor
  writeValue(value: any) {
    if (value) {
      this.passengers = value;
      // console.log(value);
    }
  }
  propagateChange = (_: any) => {};
  touchedCallback = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {
    this.touchedCallback = fn;
  }

  checkIfMobile() {
    this.mobileService.getIsMobile().subscribe(value => this.isMobile = value);
  }

  @HostListener('document:click', ['$event']) onClick(event) { // close the ddw when user clicks the other dropdown
      if(!(this.elRef.nativeElement.contains(event.target))){
        this.onFocus(1);
      }else{
        if(!this.isDropdownVisible && !this.disableDropdown){
          this.onFocus(0);
        }
      }
  }

  confirmSelection(){
    this.updateChoseClass();
    for (let i = 0; i < this.paxTypes.length; i++) {
      this.passengers[this.paxTypes[i]] = this.paxNumbers[i];
    }
    this.propagateChange(this.passengers);
    this.selectionChanged.emit(this.flightClassValue);
    this.onFocus(1);
  }

  fetchFromTranslation() {
    if (this.translations) {
      this.counterData = this.translations.BOOKING_APP.BOOK_A_FLIGHT.PAX_TYPE;
    }
  }

  updateChoseClass() {
    switch (this.flightClassValue) {
      case 'E':
      this.chosenClass = this.translations.BOOKING_APP.BOOK_A_FLIGHT.CABIN_ECONOMIC_CLASS;
      break;
      case 'B':
      this.chosenClass = this.translations.BOOKING_APP.BOOK_A_FLIGHT.CABIN_BUSINESS_CLASS;
      break;
      case 'F':
      this.chosenClass = 'FIRST';
      break;
    }
    this.totalPassengerCount = this.getTotalPassengers();
  }

}
