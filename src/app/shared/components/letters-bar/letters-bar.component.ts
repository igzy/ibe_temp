import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-letters-bar',
  templateUrl: './letters-bar.component.html',
  styleUrls: ['./letters-bar.component.scss']
})
export class LettersBarComponent implements OnInit, OnChanges {
  options = [];
  selectedStack = [];
  @Output() emitSelected = new EventEmitter<Object>();
  @Input() availableOption;
  @Input() translations: any;

  constructor() { }

  ngOnInit() {
    for (let i = 65; i < 91; i++) {
    this.options.push(String.fromCharCode(i));
    }
    this.selectedStack = this.availableOption.slice();
  }

  checkIfLetterIsStacked(letter) {
    return this.selectedStack.includes(letter);
  }

  checkIfLetterIsAvailable(letter) {
    return this.availableOption.includes(letter);
  }

  updateSelectedLetters(letter) {
    if (letter === 'All') {
      this.selectedStack = this.availableOption.slice();
      this.emitSelected.emit(null);
    } else if (letter == null) {
      this.emitSelected.emit('disabled');
    } else {
      this.selectedStack.length = 0;
      this.selectedStack.push(letter);
      this.emitSelected.emit(this.selectedStack[0]);
    }
  }

  ngOnChanges() {

  }

}
