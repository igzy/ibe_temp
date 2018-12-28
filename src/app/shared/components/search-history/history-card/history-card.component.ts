import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { HistorySearchModel } from "../../../models/history-search-model";


@Component({
	selector: "app-history-card",
	templateUrl: "./history-card.component.html",
	styleUrls: ["./history-card.component.scss"]
})
export class HistoryCardComponent implements OnInit, OnChanges {
	@Input() searchObject: HistorySearchModel;
	@Input() translations: any;
	originCity: string;
	destinationCity: string;
	formattedOriginDate: string;
	formattedDestinationDate: string;
	constructor() {}

	ngOnInit() {
		this.originCity = this.searchObject.origin.location.city;
		this.destinationCity = this.searchObject.destination.location.city;
		this.formattedOriginDate = this.formatDate(this.searchObject.originDate);
		if (this.searchObject.destinationDate) {
			this.formattedDestinationDate = this.formatDate(this.searchObject.destinationDate); 
		}
		
	}

	formatDate(date) {
		const monthNames = this.translations.BOOKING_APP.MONTHS;
		return `${monthNames[date.month-1]} - ${date.day}`;
	}

	ngOnChanges() {
	}
}
