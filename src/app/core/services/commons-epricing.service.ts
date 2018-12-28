import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
//import { AppConfig, API_EPRICING, SESSION_EPRICING_CREATE, EPRICING_CREDENTIALS, BOOKING_DATES_CALENDAR_PRICE, BOOKING_DEPARTURE_CALENDAR_PRICE } from "../../configs/app-settings.config";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BOOKING_DATES_CALENDAR_PRICE, API_EPRICING, BOOKING_DEPARTURE_CALENDAR_PRICE, SESSION_EPRICING_CREATE, EPRICING_CREDENTIALS, AppConfig, TOKEN_EPRICING_KEY } from "../../configs/app-settings.config";

@Injectable()
export class CommonsEPricingService {
    
    constructor(private http: HttpClient) { }
    
    createSessionEPricing(): Observable<any> {
        if (AppConfig.SESSION_EPRICING_MOCK) {
          //return this.http.get(`${AppConfig.CREATE_SESSION_BFMADMIN_MOCKS}/createSessionBFMAdmin.json`);
        } else {
          console.log(`invoking ${API_EPRICING}${SESSION_EPRICING_CREATE}`);
          return this.http.post(`${API_EPRICING}${SESSION_EPRICING_CREATE}`, EPRICING_CREDENTIALS);
        }
    }

    getCalendarPricesForDates(param: any){
        if (AppConfig.DATES_CALENDAR_PRICE_MOCK) {
            return this.http.get(`${AppConfig.BOOKING_MOCKS}/best-price-for-dates.json`);
        } else {
            const _options = {
                headers: new HttpHeaders({
                  'Authorization': 'Bearer ' + sessionStorage.getItem(TOKEN_EPRICING_KEY)
                }),
                params: new HttpParams()
                  .set('startDate', param.startDate)
                  .set('endDate', param.endDate)
                  .set('directFlight', param.directFlight)
                  .set('entityId', param.entityId)
                  .set('market', param.market)
                  .set('origin', param.origin)
                  .set('destination', param.destination)
                  .set('tripType', param.tripType)
                  .set('cabinClass', param.cabinClass)
                  .set('maxDayNights', param.maxDayNights)
                };
            console.log(`invoking ${API_EPRICING}${BOOKING_DATES_CALENDAR_PRICE}`);
            return this.http.get(`${API_EPRICING}${BOOKING_DATES_CALENDAR_PRICE}`, _options);
        }
    }

    getCalendarPricesForDepartures(param: any){
        if (AppConfig.DEPARTURE_CALENDAR_PRICE_MOCK) {
            return this.http.get(`${AppConfig.BOOKING_MOCKS}/departure-date-price.json`);
        } else {
            const _options = {
                headers: new HttpHeaders({
                  'Authorization': 'Bearer ' + sessionStorage.getItem(TOKEN_EPRICING_KEY)
                }),
                params: new HttpParams()
                  .set('entityId', param.entityId)
                  .set('departureDate', param.departureDate)
                  .set('maxNights', param.maxNights)
                  .set('directFlight', param.directFlight)
                  .set('market', param.market)
                  .set('origin', param.origin)
                  .set('destination', param.destination)
                  .set('tripType', param.tripType)
                  .set('cabinClass', param.cabinClass)
                };
            console.log(`invoking ${API_EPRICING}${BOOKING_DEPARTURE_CALENDAR_PRICE}`);
            return this.http.get(`${API_EPRICING}${BOOKING_DEPARTURE_CALENDAR_PRICE}`, _options);
        }
    }
}