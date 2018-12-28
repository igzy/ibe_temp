import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class MarketService {

    marketUpdate = new Subject;
    marketUpdate$ = this.marketUpdate.asObservable();

	constructor() {
	}

    updateMarket(){
        this.marketUpdate.next(true);
    }
}
