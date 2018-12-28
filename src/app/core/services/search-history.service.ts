import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class SearchHistoryService {

    showHistoryFlag = new Subject;
    showHistoryFlag$ = this.showHistoryFlag.asObservable();

    hideHistoryFlag = new Subject;
    hideHistoryFlag$ = this.hideHistoryFlag.asObservable();

	constructor() {
	}

    showSearchHistory(){
        this.showHistoryFlag.next(true);
    }

    hideSearchHistory(){
        this.hideHistoryFlag.next(true);
    }
}
