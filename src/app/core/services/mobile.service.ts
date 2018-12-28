import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable()
export class MobileService {
	isMobile:  BehaviorSubject<boolean>;
	showTab:  BehaviorSubject<boolean>;


	constructor() {
		this.isMobile = new BehaviorSubject<boolean>(false);
		this.showTab = new BehaviorSubject<boolean>(false);
	}

	getIsMobile(){
		return this.isMobile.asObservable();
	}

	getShowTab(){
		return this.showTab.asObservable();
	}

	setIsMobile(flag: boolean){
		this.isMobile.next(flag);
	}

	setShowTab(flag: boolean){
		this.showTab.next(flag);
	}

	toggleShowTab(){
		this.setShowTab(!this.showTab.getValue());
	}

}
