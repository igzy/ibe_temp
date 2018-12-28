import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  dropdownLabel;

  @Input()
  leftIcon;

  @Input()
  rightIcon = 'fas fa-angle-down';

  @Input()
  dropdownBodyClass;

  @Output()
  dropdownClicked = new EventEmitter();

  @Output()
  dropdownClose = new EventEmitter();

  @Input()
  customFocus = false;

  showContent: boolean;

  _disableClick;

  get disableClick(): boolean {
    return this._disableClick;
  }

  @Input()
  set disableClick(value: boolean) {
    this._disableClick = value;
  }

  allSubs: Subscription[] = [];
  direction: string;

  constructor(private _languageService: LanguageService ) { }

  ngOnInit() {
    const languageSubscription = this._languageService.directionUpdate$.subscribe(data => {
      if (data){
        this.direction = data;
      }
  });

    this.allSubs.push(languageSubscription);
  }

  expandContent() {
    if (!this.disableClick) {
      // this.showContent = !this.showContent;
      this.dropdownClicked.emit();
    }
  }

  ngOnDestroy () {
    for (const sub of this.allSubs) {
      sub.unsubscribe();
    }
  }

  ngOnChanges() {
    this.direction = this._languageService.getDir();
    setTimeout( () => {
      if (this.customFocus) {
        this.expandContent();
      }
    }, 0);
  }

}
