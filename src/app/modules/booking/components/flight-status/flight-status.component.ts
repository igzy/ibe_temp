import { Component, OnInit, OnDestroy, Input, OnChanges, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { TOKEN_BFM_KEY, MARKET_CODE_KEY, LANGUAGE_KEY, AIRLINE_ID_KEY, TRIP_TYPE_KEY, 
		FLIGHT_STATUS_URL_FR, FLIGHT_STATUS_URL_EN } from "../../../../configs/app-settings.config";
import { BookingService } from '../../../../core/services/booking.service';
import { map } from 'rxjs/operators';
import { OriginResultModel } from '../../../../shared/models/origins-result.model';
import { Subscription } from 'rxjs';
import { LocationOutputModel } from '../../../../shared/models/location-result.model';
import { DestinationResultModel } from '../../../../shared/models/destination-result.model';
import { FlightInfoService } from '../../../../core/services/flight-status.service';

@Component({
	selector: 'app-flight-status',
	templateUrl: './flight-status.component.html',
	styleUrls: ['./flight-status.component.scss']
})
export class FlightStatusComponent implements OnInit, OnDestroy, OnChanges {
	@Output() flightStatusResult: EventEmitter<any> = new EventEmitter<any>();
	tabHeaders = [];
	flightRouteStatusForm: FormGroup;
	flightNumberStatusForm: FormGroup;
	activeTab: string;
	activeTabIndex: number = 0;
	allSubs: Subscription[] = [];
	bookingParams = {
		'tripType': 'O',
		'market': sessionStorage.getItem(MARKET_CODE_KEY),
		'language': sessionStorage.getItem(LANGUAGE_KEY),
		'airlineId': sessionStorage.getItem(AIRLINE_ID_KEY),
		'origin': ''
	};
	originSource: OriginResultModel[] = [];
	xml: any;
	destinationSource: DestinationResultModel[] = [];
	flightInfoData = [];

	flightNumberPrefix = 'AT';

	@Input() translations;
	constructor(private _fb: FormBuilder,
		private _bookingService: BookingService,
		private _flightInfoService: FlightInfoService) {
	}

	ngOnInit() {
		this.loadRouteForm();
		this.loadFlightNumberForm();
		this.fetchFromTranslation();
		if (this.tabHeaders) {
			this.activeTab = this.tabHeaders[0];
		}
	}




	loadRouteForm() {
		this.loadDeparture();
		this.flightRouteStatusForm = this._fb.group({
			departure: this._fb.control(null, Validators.required),
			arrival: this._fb.control(null, Validators.required),
		});
	}

	loadFlightNumberForm() {
		this.flightNumberStatusForm = this._fb.group({
			flightNumber: this._fb.control(null, Validators.required)
		});
	}

	loadDeparture() {
		const id = setInterval(() => {

			this.bookingParams = {
				'tripType': sessionStorage.getItem(TRIP_TYPE_KEY),
				'market': sessionStorage.getItem(MARKET_CODE_KEY),
				'language': sessionStorage.getItem(LANGUAGE_KEY),
				'airlineId': sessionStorage.getItem(AIRLINE_ID_KEY),
				'origin': ''
			};

			if (sessionStorage.getItem(TOKEN_BFM_KEY) !== null &&
				sessionStorage.getItem(MARKET_CODE_KEY) !== null) {

				// FETCHING ORIGINS
				const originSubscription = this._bookingService.getOrigins(this.bookingParams)
					.pipe(
						map(origin => {
							const origins = [];
							for (const o in origin) {
								if (origin.hasOwnProperty(o)) {
									origins.push(origin[o]);
								}
							}
							return origins;
						})
					)
					.subscribe(origins => {
						if (!origins) {
							return;
						}
						this.originSource = origins[0];
					}
					);
				this.allSubs.push(originSubscription);
				clearInterval(id);
			}

		}, 500);
	}

	changeTab(val: string) {
		if (val) {
			this.activeTab = val;
			this.activeTabIndex = this.tabHeaders.indexOf(val);
			if (this.activeTabIndex === 1) {
				this.flightRouteStatusForm.get('departure').setValue(undefined);
				this.flightRouteStatusForm.get('departure').markAsUntouched();
				this.flightRouteStatusForm.get('departure').updateValueAndValidity();
				this.flightRouteStatusForm.get('arrival').setValue(undefined);
				this.flightRouteStatusForm.get('arrival').markAsUntouched();
				this.flightRouteStatusForm.get('arrival').updateValueAndValidity();
			} else {
				this.flightNumberStatusForm.get('flightNumber').setValue(undefined);
				this.flightNumberStatusForm.get('flightNumber').markAsUntouched();
				this.flightNumberStatusForm.get('flightNumber').updateValueAndValidity();
			}
		}

	}


	ngOnDestroy() {
		for (const sub of this.allSubs) {
			sub.unsubscribe();
		}
	}

	fetchFromTranslation() {
		if (this.translations) {
			this.tabHeaders = this.translations.BOOKING_APP.FLIGHT_STATUS.TAB_HEADERS;
		}
	}

	ngOnChanges() {
		this.fetchFromTranslation();
		if (this.tabHeaders) {
			this.activeTab = this.tabHeaders[this.activeTabIndex];
		}
	}

	departureChanged(locationOutput: LocationOutputModel) {
		if (locationOutput) {
			this.bookingParams.origin = locationOutput.code;

			// GET DESTINATION
			//console.log('Petición de Destinations: ', this.bookingParams);
			const destinationSubscription = this._bookingService.getDestinations(this.bookingParams)
				.pipe(
					map(destination => {
						const destinations = [];
						for (const o in destination) {
							if (destination.hasOwnProperty(o)) {
								destinations.push(destination[o]);
							}
						}
						return destinations;
					})
				)
				.subscribe(
					(destination: any) => {
						if (!destination) {
							return;
						}
						const destinationStr = JSON.stringify(destination);
						const formattedDest = JSON.parse(destinationStr.replace('destinations', 'origins'));
						this.destinationSource = formattedDest[0];
					}
				);
			this.allSubs.push(destinationSubscription);
			this.destinationSource = [];
			this.flightRouteStatusForm.get('arrival').setValue(undefined);
			this.flightRouteStatusForm.get('arrival').markAsUntouched();
			this.flightRouteStatusForm.get('arrival').updateValueAndValidity();
		}
	}

	onCheckStatus() {
		let param = '';
		if (this.activeTabIndex === 0) {
			console.log(this.flightRouteStatusForm);
			this.checkStatusForRoute();
		} else {
			console.log(this.flightNumberStatusForm);
			this.checkStatusFoTicketNumber();
		}
	}


	onRedirectCheckStatus() {
		let param = '';
		let languageUrl = '';
		if(sessionStorage.getItem(LANGUAGE_KEY) === 'en')
		{
			languageUrl = FLIGHT_STATUS_URL_EN;
		}
		else{
			languageUrl = FLIGHT_STATUS_URL_FR;
		}
		if (this.activeTabIndex === 0) {
			window.location.href = `${window.location.protocol}//${window.location.host}${languageUrl}?departure=${this.flightRouteStatusForm.controls.departure.value}&arrival=${this.flightRouteStatusForm.controls.arrival.value}`;
		} else {
			window.location.href = `${window.location.protocol}//${window.location.host}${languageUrl}?flightnumer=${this.flightNumberStatusForm.controls.flightNumber.value}`;
		}

		
	}

	checkStatusForRoute() {
		if (this.flightRouteStatusForm.valid) {
			const departureCode = this.flightRouteStatusForm.value.departure;
			const arrivalCode = this.flightRouteStatusForm.value.arrival;
			this._flightInfoService.checkFlightStatus(departureCode, arrivalCode, null).subscribe(
				response => {
					if (response) {
						this.flightInfoData = response.WebsitegetFlightInfoByFlightNumberResponse.return;
						// console.log(this.flightInfoData);
						this.flightStatusResult.emit(this.flightInfoData);
					}
				},
				error => {
					if (error.status === 404) {
						console.log('error request', error);
					}
				}
			);
		} else {
			this.validateAllFormFields(this.flightRouteStatusForm);
		}
	}

	checkStatusFoTicketNumber() {
		if (this.flightNumberStatusForm.valid) {
			const flightNumber = this.flightNumberStatusForm.value.flightNumber;
			this._flightInfoService.checkFlightStatus(null, null, flightNumber).subscribe(
				response => {
					if (response) {
						this.flightInfoData = response.WebsitegetFlightInfoByFlightNumberResponse.return;
						this.flightStatusResult.emit(this.flightInfoData);
						console.log(this.flightInfoData);
					}
				},
				error => {
					if (error.status === 404) {
						console.log('error request', error);
					}
				}
			);
		} else {
			this.validateAllFormFields(this.flightNumberStatusForm);
		}
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormArray) {
				Object.keys(control.controls).forEach(subField => {
					const subControl = control.get(subField);
					subControl.markAsTouched({ onlySelf: true });
				});
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	numericOnly(event) {
		const k = event.charCode;
		return (k >= 48 && k <= 57);
	}

}
