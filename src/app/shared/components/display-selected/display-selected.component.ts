import { Component, OnInit, Input, OnChanges, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { LanguageService } from "../../../core/services/language.service";

@Component({
	selector: "app-display-selected",
	templateUrl: "./display-selected.component.html",
	styleUrls: ["./display-selected.component.scss"]
})
export class DisplaySelectedComponent implements OnInit, OnChanges, OnDestroy {
	@Input()selectedObject: any;
	@Input() displayFor: string;
	@Input() translations;

	// interface
	displayObject = {
		header: "",
		subHeader: "",
		bigShortHeader: "",
		mobileDisplayLabel: "",
		departureDate: {
			day: "",
			month: "",
			date: "",
			mobileDepartureLabel: ""

		},
		returnDate: {
			day: "",
			month: "",
			date: "",
			mobileReturnLabel: ""
		},

	};

	direction: string;

	allSubs: Subscription[] = [];

	constructor(private _languageService: LanguageService) {}

	ngOnInit() {
		const languageSubscription = this._languageService.directionUpdate$.subscribe(data => {
			if (data){
			  this.direction = data;
			}
		});
	
		this.allSubs.push(languageSubscription);
	}

	ngOnChanges() {
		this.direction = this._languageService.getDir();
		if (this.displayFor === "date") {
			this.loadDateObject();
		} else if (this.displayFor === "traveler") {
			this.loadTravelerObject();
		} else if (this.displayFor === "city") {
			this.loadCityObject();
		} else if (this.displayFor === "paymentMethod"){
			this.loadPaymentMethod();
		}
	}

	loadDateObject() {
		const days = this.translations.BOOKING_APP.DAYS;
		const ordinals: string[] = ["th", "st", "nd", "rd"];
		const monthNames = this.translations.BOOKING_APP.MONTHS;

		const mobileMonthNames = this.translations.BOOKING_APP.MONTHS_ABBREVIATED;

		if (this.selectedObject.departureDate) {
			const departureDate = new Date(
				this.selectedObject.departureDate.year,
				this.selectedObject.departureDate.month - 1,
				this.selectedObject.departureDate.day
			);

			this.displayObject.departureDate.day = days[departureDate.getDay()];
			this.displayObject.departureDate.month = monthNames[departureDate.getMonth()];
			this.displayObject.departureDate.date = departureDate.getDate().toString().length === 1 ? 
													'0' + departureDate.getDate() : departureDate.getDate().toString();

			let departureDateOrdinal = (ordinals[(departureDate.getDate() - 20 ) % 10] || ordinals[departureDate.getDate() ] || ordinals[0]);

			this.displayObject.departureDate.mobileDepartureLabel = `${departureDate.getDate()}<sup>${departureDateOrdinal}</sup> ${mobileMonthNames[departureDate.getMonth()]}`;

		} else {
			this.displayObject.departureDate.day = "";
			this.displayObject.departureDate.mobileDepartureLabel = "";
		}

		if (this.selectedObject.returnDate) {
			const returnDate = new Date(
				this.selectedObject.returnDate.year,
				this.selectedObject.returnDate.month - 1,
				this.selectedObject.returnDate.day
			);

			this.displayObject.returnDate.day = days[returnDate.getDay()];
			this.displayObject.returnDate.month =
				monthNames[returnDate.getMonth()];
			this.displayObject.returnDate.date = returnDate.getDate().toString().length === 1 ? 
											'0' + returnDate.getDate() : returnDate.getDate().toString();

			let returnDateOrdinal = (ordinals[(returnDate.getDate() - 20 ) % 10] || ordinals[returnDate.getDate() ] || ordinals[0]);

			this.displayObject.returnDate.mobileReturnLabel = `${returnDate.getDate()}<sup>${returnDateOrdinal}</sup>  ${mobileMonthNames[returnDate.getMonth()]}`;

		} else {
			this.displayObject.returnDate.day = "";
			this.displayObject.returnDate.mobileReturnLabel = "";
		}
	}

	loadCityObject() {
		if (this.selectedObject != null) {
			this.displayObject.header = this.selectedObject.location.city;
			this.displayObject.subHeader = this.selectedObject.label;
			this.displayObject.bigShortHeader = this.selectedObject.code;
			this.displayObject.mobileDisplayLabel = `${
				this.selectedObject.location.city
			} (${this.selectedObject.code})`;
		}
	}

	loadTravelerObject() {
		if (this.selectedObject != null) {
			this.displayObject.header = this.selectedObject.chosenClass;
			this.displayObject.subHeader = "class";
			this.displayObject.bigShortHeader =
				this.selectedObject.getTotalPassengers < 10
					? "0" + this.selectedObject.getTotalPassengers
					: this.selectedObject.getTotalPassengers;
			this.displayObject.mobileDisplayLabel = `${this.selectedObject.getTotalPassengers} Adult-${this.selectedObject.chosenClass}`;
		}

	}

	loadPaymentMethod(){
		if (this.selectedObject != null) {
			this.displayObject.header = this.selectedObject;
			this.displayObject.mobileDisplayLabel = this.selectedObject;
		}
	}

	checkDateIsNan(date) {
		return isNaN(date);
	}

	ngOnDestroy () {
		for (const sub of this.allSubs) {
		  sub.unsubscribe();
		}
	  }
}
