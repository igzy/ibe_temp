import { Component, OnInit, Input, isDevMode, EventEmitter, Output, OnDestroy } from "@angular/core";
import { MobileService } from "../../../core/services/mobile.service";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../core/services/language.service";


@Component({
	selector: "app-mobile-header",
	templateUrl: "./mobile-header.component.html",
	styleUrls: ["./mobile-header.component.scss"]
})
export class MobileHeaderComponent implements OnInit, OnDestroy {

	@Input() title: string = null;
	@Input() rightIcon?: string = null;
	@Input() leftIcon?: string = null;
	@Output() closeEvent?: EventEmitter<any> = new EventEmitter<any>();

	header = {
		rightIcon: null,
		leftIcon: null,
		title : null,
	}

	direction: string;
	allSubs: Subscription[] = [];

	constructor(private mobileService: MobileService, 
				private _languageService: LanguageService) {}

	ngOnInit() {
		this.header.leftIcon = this.leftIcon;
		this.header.rightIcon = this.rightIcon;
		this.header.title = this.title;

		const languageSubscription = this._languageService.directionUpdate$.subscribe(data => {
			if (data){
			  this.direction = data;
			}
		});
	
		this.allSubs.push(languageSubscription); 
	}

	hideTab(){
		if(this.closeEvent.observers.length > 0 ){
			this.closeEvent.emit();
		}else{
			this.mobileService.toggleShowTab();
		}
	}

	ngOnDestroy () {
		for (const sub of this.allSubs) {
		  sub.unsubscribe();
		}
	}
}
