import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from "@angular/core";
import { MobileService } from "../../../core/services/mobile.service";
import { MOBILE_WIDTH } from "../../../configs/app-settings.config";

@Component({
	selector: "app-tabs",
	templateUrl: "./tabs.component.html",
	styleUrls: ["./tabs.component.scss"]
})
export class TabsComponent implements OnInit, OnChanges {
	isMobile: boolean;
	showTab: boolean;
	
	@Input()
	tabHeaders = [];

	@Input()
	preSelectTabHeaderIndex: number = 0;

	@Input()
	tabHeaderListClass = "";

	@Input()
	tabHeadClass = "";

	@Input()
	tabBodyClass = "";

	@Output()
	selectionChange: EventEmitter<string> = new EventEmitter<string>();

	active: string;
	activeIndex: number = 0;
	
	constructor(private mobileService: MobileService) {}

	ngOnInit() {
		//console.log(this.tabHeaders);
		this.active = this.tabHeaders[0];
		this.selectionChange.emit(this.active);
		this.checkIfMobileView();

		this.mobileService
			.getIsMobile()
			.subscribe(value => (this.isMobile = value));
		this.mobileService
			.getShowTab()
			.subscribe(value => (this.showTab = value));
	}
	
	changeActive(val) {
		this.active = val;
		this.activeIndex = this.tabHeaders.indexOf(val);
		this.selectionChange.emit(this.active);
		if (this.tabBodyClass === "multitab-body") {
			this.mobileService.toggleShowTab();
		}
		
	}

	checkIfMobileView(){
		if(window.innerWidth <= MOBILE_WIDTH){
			this.mobileService.setIsMobile(true);
		}else{
			this.mobileService.setIsMobile(false);
		}
	}

	ngOnChanges(){
		if (this.tabHeaders) {
			this.active = this.tabHeaders[this.activeIndex];
		}
		if (this.preSelectTabHeaderIndex >= 0) {
			this.activeIndex = this.preSelectTabHeaderIndex;
			this.active = this.tabHeaders[this.preSelectTabHeaderIndex];
		}
	}
}
