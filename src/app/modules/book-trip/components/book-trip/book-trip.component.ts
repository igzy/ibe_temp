import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { SearchHistoryService } from '../../../../core/services/search-history.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-trip',
  templateUrl: './book-trip.component.html',
  styleUrls: ['./book-trip.component.scss']
})
export class BookTripComponent implements OnInit, OnChanges {

  @Input() translations: any;
  @Input() redemption: boolean = false;
  hideSearchHistory: boolean = false;

  allSubs: Subscription[] = [];
  
  constructor(private _searchHistoryService: SearchHistoryService) { }

  ngOnInit() {
    const showSearchHistorySubsription = this._searchHistoryService.hideHistoryFlag$.subscribe(flag => {
      if (flag){
        this.hideSearchHistory = false;
      }
    });

    //this.allSubs.push(translationsSubscription);
    this.allSubs.push(showSearchHistorySubsription);
  }

  ngOnChanges() {

  }

  onShowSearchHistory(){
    this.hideSearchHistory = true;
    this._searchHistoryService.showSearchHistory();
  }

}
