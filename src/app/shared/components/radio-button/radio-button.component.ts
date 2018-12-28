import { Component, OnInit, Input, forwardRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { RadioButtonChoiceModel } from '../../models/radio-button-option-model';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../core/services/language.service';
import { RadioButtonService } from '../../../core/services/radio-button.service';



@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RadioButtonComponent)
    }
  ]
})
export class RadioButtonComponent implements OnInit, ControlValueAccessor, OnDestroy {

  @Input() choices: RadioButtonChoiceModel[];
  @Input() label: string;
  @Input() control: FormControl;
  @Output() selectedChoiceEvent: EventEmitter<string> = new EventEmitter<string>();

  selectedChoice: any;

  direction: string;

  allSubs: Subscription[] = [];

  constructor(private _languageService: LanguageService, private _rbService: RadioButtonService) { }

  ngOnInit() {
    const languageSubscription = this._languageService.directionUpdate$.subscribe(data => {
      if (data) {
        this.direction = data;
      }
    });

    const rbSubscription = this._rbService.selectPaymentOption$.subscribe(option => {
      if (option) {
        this.selectedChoice = option;
      } else {
        this.selectedChoice = null;
      }
    });

    if (!this.direction) {
      this.direction = this._languageService.getDir();
    }

    this.allSubs.push(languageSubscription);
    this.allSubs.push(rbSubscription);
  }

  onChange() {
    this.direction = this._languageService.getDir();
    this.emitselectedChoice();
    this.propagateChange(this.selectedChoice);
  }

  emitselectedChoice() {
    this.selectedChoiceEvent.emit(this.selectedChoice);
  }

  // ControlValueAccessor

  writeValue(value: any) {
    if (value) {
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

  ngOnDestroy () {
    for (const sub of this.allSubs) {
      sub.unsubscribe();
    }
  }

}
