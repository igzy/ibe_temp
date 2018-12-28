import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { SearchHistoryService } from '../../../../core/services/search-history.service';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../../core/services/language.service';
import { BOOKING_APP} from '../../../../configs/app-settings.config';


@Component({
  selector: 'app-booking-menu',
  templateUrl: './booking-menu.component.html',
  styleUrls: ['./booking-menu.component.scss']
})
export class BookingMenuComponent implements OnInit, OnDestroy, OnChanges {

  title = 'app';

  headers  = [] ;

  bookingChoice: string;
  hideSearchHistory: boolean = false;

  allSubs: Subscription[] = [];
  
  constructor(private _searchHistoryService: SearchHistoryService,
              private _languageService: LanguageService) {
  }
 direction: string;
 @Input() translations: any;
 @Input() redemption: boolean = false;

  ngOnInit() {
    // const translationsSubscription = this._languageService.getTranslations(BOOKING_APP).subscribe(
    //   translations => {
    //     this.translations = translations;
    //     this.fetchFromTranslation();
    //   }, err => {
    //     console.error(err);
    //   }
    // );

    this.fetchFromTranslation();
    
    const showSearchHistorySubsription = this._searchHistoryService.hideHistoryFlag$.subscribe(flag => {
      if (flag){
        this.hideSearchHistory = false;
      }
    });

    this.direction = this._languageService.getDir();
    const dirSubscription = this._languageService.directionUpdate$.subscribe(data => {
      if (data){
        this.direction = data;
      }
    });

    

    //this.allSubs.push(translationsSubscription);
    this.allSubs.push(showSearchHistorySubsription);
    this.allSubs.push(dirSubscription);
  }

  selectionChange(value) {
    this.bookingChoice = value;
    if (value === this.headers[0]) {
      this.hideSearchHistory = false;
    } else{
      this.hideSearchHistory = true;
    }
  }
  
  onShowSearchHistory(){
    this.hideSearchHistory = true;
    this._searchHistoryService.showSearchHistory();
  }

  ngOnDestroy () {
    for (const sub of this.allSubs) {
      sub.unsubscribe();
    }
  }

  ngOnChanges(){
    this.fetchFromTranslation();
  }

  fetchFromTranslation() {
    if (this.translations) {
      this.headers = this.translations.BOOKING_APP.HEADERS;
      this.bookingChoice = this.headers[0];
    }
  }

}
