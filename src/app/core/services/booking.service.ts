import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {
  AppConfig, E_RETAIL, API_BFM ,
  DOMAIN_BFM, BEARER_BFM, BOOKING_SEARCH,
  BOOKING_ORIGINS, BOOKING_DESTINATIONS, BEARER_BFM_REST, BOOKING_CALENDAR, API_BEARER_BFM, E_RETAIL_PAY_WITH_MILES, E_RETAIL_MOBILE, E_RETAIL_PAY_WITH_MILES_MOBILE} from '../../configs/app-settings.config';
import { Observable } from 'rxjs';
import { MobileService } from './mobile.service';

@Injectable()
export class BookingService {
  isMobile: boolean = false;

  constructor(private http: HttpClient, private mobileService: MobileService ) {
    this.mobileService
			.getIsMobile()
      .subscribe(value => (this.isMobile = value));
  }

  askIfRetail(searchParams: any): Observable<any> {
    const _options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm') }) };
    //console.log(`Invoking ${API_BFM }${E_RETAIL}`);
    return this.http.post(`${API_BEARER_BFM }${E_RETAIL}`, searchParams, _options);
  }

  getPayWithMilesRedirectionDetails(searchParams: any) {
    const _options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm') }) };
    //console.log(`Invoking ${API_BFM }${E_RETAIL}`);
    return this.http.post(`${API_BEARER_BFM }${E_RETAIL_PAY_WITH_MILES}`, searchParams, _options);
  }


  getOrigins(originParams: any): Observable<any> {
    if (!AppConfig.ORIGINS_MOCK) {
      const _options = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm')
        }),
        params: new HttpParams()
          .set('tripType', originParams.tripType)
          .set('market', originParams.market)
          .set('language', originParams.language)
          .set('airlineId', originParams.airlineId)
        };
      console.log(`Invoking ${DOMAIN_BFM}${BEARER_BFM}${BOOKING_ORIGINS}`);
      return this.http.get(`${DOMAIN_BFM}${BEARER_BFM}${BOOKING_ORIGINS}`, _options);

    } else {
      console.log(`${AppConfig.BOOKING_MOCKS}/origins.json`);
      return this.http.get(`${AppConfig.BOOKING_MOCKS}/origins.json`);
    }
  }

  getDestinations(destinationParams: any): Observable<any> {
    if (!AppConfig.DESTINATIONS_MOCK) {
      const _options = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm')
        }),
        params: new HttpParams()
          .set('tripType', destinationParams.tripType)
          .set('market', destinationParams.market)
          .set('language', destinationParams.language)
          .set('airlineId', destinationParams.airlineId)
          .set('origin', destinationParams.origin)
        };
      // this.setAirlineId(destinationParams.airlineId);
      console.log( `Invoking ${DOMAIN_BFM}${BEARER_BFM}${BOOKING_DESTINATIONS}`);
      return this.http.get(`${DOMAIN_BFM}${BEARER_BFM}${BOOKING_DESTINATIONS}`, _options);
    } else {
      console.log(`Invoking ${AppConfig.BOOKING_MOCKS}/destinations.json`);
      return this.http.get(`${AppConfig.BOOKING_MOCKS}/destinations.json`);
    }
  }

  getAvailability(searchParams: any): Observable<any> {
    if (!AppConfig.AVAILABILITY_MOCK) {
      const _options = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm')
        })
      };
      console.log(`Invoking ${DOMAIN_BFM}${BEARER_BFM_REST}${BOOKING_SEARCH}`);
      return this.http.post(`${DOMAIN_BFM}${BEARER_BFM_REST}${BOOKING_SEARCH}`, searchParams, _options);

    } else {
      console.log(`Invoking ${AppConfig.BOOKING_MOCKS}/availability.json`);
      return this.http.get(`${AppConfig.BOOKING_MOCKS}/availability.json`);
    }
  }

  setAirlineId(airlineId: string) {
    const airlineIdArr = [];
    const airlineIdStorage = JSON.parse(sessionStorage.getItem('airlineId'));
    if (sessionStorage.getItem('airlineId')) {
      airlineIdStorage.forEach(id => {
        airlineIdArr.push(id);
      });
    }
    airlineIdArr.push(airlineId);
    sessionStorage.setItem('airlineId', JSON.stringify(airlineIdArr));
  }

  getCalendarPrice(calendarParam: any): Observable<any> {
    if (!AppConfig.PRICES_CALENDAR_MOCK) {
      const _options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm'),
           'Content-Type': 'application/json'}) };
      console.log(`Invoking ${DOMAIN_BFM}${BEARER_BFM}${BOOKING_CALENDAR}`);
      return this.http.post(`${DOMAIN_BFM}${BEARER_BFM}${BOOKING_CALENDAR}`, calendarParam, _options);
    } else {
      console.log(`Invoking ${AppConfig.BOOKING_MOCKS}/calendar-price.json`);
      return this.http.get(`${AppConfig.BOOKING_MOCKS}/calendar-price.json`);
    }

  }
}
