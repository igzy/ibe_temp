import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputTextComponent)
    }
  ]
})
export class InputTextComponent implements OnInit , ControlValueAccessor {

  @Input() leftIcon;
  @Input() inputPlaceHolder;
  @Input() size = null;
  @Input() maxLength;
  @Input() control: FormControl;
  @Input() upperCase = false;
  @Input() prefixDisplay;
  inputText: any;
  constructor() { }

  ngOnInit() {
  }

  onChange() {
    this.propagateChange(this.inputText);
  }

  onTouched() {
    this.touchedCallback(null);
  }

  // ControlValueAccessor

  writeValue(value: any) {
    if (value) {
      this.inputText = value;
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

}
