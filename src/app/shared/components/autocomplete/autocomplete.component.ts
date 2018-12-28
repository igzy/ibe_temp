import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter, forwardRef, OnChanges, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl} from '@angular/forms';
import { LocationOutputModel } from '../../models/location-result.model';
import { MobileService } from '../../../core/services/mobile.service';
import { OriginResultModel } from '../../models/origins-result.model';


@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AutocompleteComponent),
    }
  ]
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor, OnChanges {

  @ViewChild('origin') inputOrigin: ElementRef;
  @Input() source: any;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  @Input() dropdownLabel;
  @Input() selectLabel;
  @Input() mobilePlaceHolder;
  @Input() leftIcon;
  @Input() rightIcon = 'fa fa-angle-down';
  @Input() dropdownBodyClass;
  @Input() control: FormControl;
  @Input() patch: OriginResultModel;
  @Input() translations: any;
  @Input() focusInput = false;

  isMobile: boolean;
  filterText: string;
  isDropdownVisible = false;
  valid = true;
  selectedCity = null;
  availableLetters = [];
  letterFilter;
  ddwTrigger = null;
  locationOutput: OriginResultModel;
  allowCloseDropdown = false;

  constructor(private mobileService: MobileService) { }

  selectSource(s) {

    const code = [];
    this.inputOrigin.nativeElement.value = `${s.code} - ${s.location.city} - ${s.label}`;
    this.selectedCity = null;
    this.selectedCity = s;
    code.push(s.code);
    this.propagateChange(code);
    this.locationOutput = s;
    this.notify.emit(this.locationOutput);
    this.onFocus(false);
    this.filterText = null;
    this.letterFilter = null;

    console.log(this.inputOrigin.nativeElement.value);
  }

  ngOnInit() {
    this.mobileService.getIsMobile().subscribe(value => this.isMobile = value);

  }

  updateAvailableLetters(origins: any[], filterText: string) {
    if (origins) {
      const originsArr = origins;
      for (let i = 0; i < originsArr.length; i++ ) {
        const city = originsArr[i].location.city.toUpperCase();
        const cityInitial = city.charAt(0);
        let pushFlag = false;
        if (filterText) {
          const upperFilterText = filterText.toUpperCase();
          const country = originsArr[i].location.country.toUpperCase();
          const code = originsArr[i].code.toUpperCase();
          if (country.includes(upperFilterText) || code.includes(upperFilterText) || city.includes(upperFilterText)) {
            pushFlag = true;
          }
        } else {
          pushFlag = true;
        }
        if (pushFlag && !this.availableLetters.includes(cityInitial.toUpperCase())) {
          this.availableLetters.push(cityInitial);
        }
      }
    }
  }

  onKeyup(text: string) {
    this.filterText = text.toLowerCase();
    if (text === '' || text == null) {
      this.selectedCity = null;
    } else {
      this.availableLetters.length = 0;
    }
    this.updateAvailableLetters(this.source.origins, text);
  }

  onFocus(status: boolean) {
    this.isDropdownVisible = status;
    this.touchedCallback(null);
    this.letterFilter = null;
    this.filterText = null;
    if (status === false) {
      if (this.inputOrigin.nativeElement.value === '') {
        this.valid = false;
        this.notify.emit(null);
        this.propagateChange(null);
      } else {
        this.valid = true;
      }
    } else {
      if (this.source) {
        this.updateAvailableLetters(this.source.origins, null);
      }
      this.propagateChange(null);
      this.notify.emit(null);

      setTimeout( () => {
        this.inputOrigin.nativeElement.focus();
      }, 0 );

      if (document.getElementById('bookingAppContainerId')) {
        document.getElementById('bookingAppContainerId').scrollIntoView();
      }
    }
  }

  onFilterSelected(selectedLetter: any) {
    setTimeout(() => {
      this.inputOrigin.nativeElement.focus();
    }, 0);
    this.allowCloseDropdown = true;
    if (selectedLetter !== 'disabled') {
      this.letterFilter = selectedLetter;
    }
  }

  public onButtonClick(event) {
    this.onFocus(true);
  }

  public onClickDisplaySelected(event) {
    this.ddwTrigger = 'valueBox';
    this.onFocus(true);
  }

  ngOnChanges() {
    if (this.patch) {
      this.selectedCity = this.patch;
    } else if (this.focusInput) {
      this.availableLetters.length = 0;
      if (this.source) {
        this.updateAvailableLetters(this.source.origins, null);
      }
      this.notify.emit(null);
      this.propagateChange(null);
    }
  }

  closeDropDown() {
    this.onFocus(false);
  }
  // ControlValueAccessor

  writeValue(value: any) {

  }

  propagateChange = (_: any) => {};
  touchedCallback = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {
    this.touchedCallback = fn;
  }

  onTouched() {
    this.touchedCallback(null);

  }

  onBlur($event) {
    event.stopPropagation();
    if (!this.allowCloseDropdown) {
      this.isDropdownVisible = false;
    }
    this.allowCloseDropdown = false;
  }

  onDivClick(){
    this.allowCloseDropdown = true;    
  }

  onMouseUP(){
    this.allowCloseDropdown = false;
    this.inputOrigin.nativeElement.focus();
  }
}
