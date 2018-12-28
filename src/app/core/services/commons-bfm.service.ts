import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BFM, SESSION_CREATE, BFM_CREDENTIALS,
  MARKETS, API_BFM_ADM,
  SESSION_BFM_ADM_CREATE,
  BFM_ADM_CREDENTIALS,
  LOCALES,
  AppConfig,
  DOMAIN_BFM,
  PAX_TYPES,
  BOOKING_SHOPPING_BASKET, 
  MARKET_CODE_KEY,
  LANGUAGE_KEY} from '../../configs/app-settings.config';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class CommonsBfmService {

  session: any;
  sessionSource = new BehaviorSubject<any>(null);
  storage: any;
  pnrData: any;
  pnrDataSource = new BehaviorSubject<any>(null);
  bookingInfo = new BehaviorSubject<any>(null);
  hasSelectedFare = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  // create session in bfm
  createSessionBfm(): Observable<any> {
    if (!AppConfig.SESSION_BFM_MOCK) {
      BFM_CREDENTIALS.market = sessionStorage.getItem(MARKET_CODE_KEY);
      BFM_CREDENTIALS.language = sessionStorage.getItem(LANGUAGE_KEY);
      console.log(`invoking ${API_BFM}${SESSION_CREATE}`);
      return this.http.post(`${API_BFM}${SESSION_CREATE}`, BFM_CREDENTIALS);
    } else {
      return this.http.get(`${AppConfig.CREATE_SESSION_BFM_MOCKS}/createSessionBFM.json`);
    }
  }

  // create session in bfm_adm
  createSessionBfmAdm(): Observable<any> {
    if (!AppConfig.SESSION_BFMADMIN_MOCK) {
      console.log(`invoking ${API_BFM_ADM}${SESSION_BFM_ADM_CREATE}`);
      return this.http.post(`${API_BFM_ADM}${SESSION_BFM_ADM_CREATE}`, BFM_ADM_CREDENTIALS);
    } else {
      return this.http.get(`${AppConfig.CREATE_SESSION_BFMADMIN_MOCKS}/createSessionBFMAdmin.json`);
    }
  }

  // get markets
 getmarkets(token: string): Observable<any> {
    if (!AppConfig.MARKETS_MOCK) {
      const _options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      };
      console.log(`invoking ${API_BFM_ADM}${MARKETS}`);
      return this.http.get(`${API_BFM_ADM}${MARKETS}`, _options);
    } else {
      return this.http.get(`${AppConfig.CREATE_MARKETS_MOCKS}/markets.json`);
    }
  }

  // get all the languages
  getLocales(token: string): Observable<any> {
    if (!AppConfig.LOCALES_MOCK) {
    const _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    console.log(`invoking ${API_BFM_ADM}${LOCALES}`);
    return this.http.get(`${API_BFM_ADM}${LOCALES}`, _options);
    } else {
      return this.http.get(`${AppConfig.CREATE_LOCALES_MOCKS}/locales.json`);
    }
  }

  getPassengerTypes(market , origin, destination, tripType): Observable<any> {
    if (AppConfig.PAX_MOCK) {
      return this.http.get(`${AppConfig.BOOKING_MOCKS}/pax.json`);
    } else {
      const payload = {
        'market': market,
        'cityPairs': [{
          'outbound': origin,
          'inbound': destination
        }],
        'tripType': tripType
      };
      const _options = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm')
        }),
        params: new HttpParams ({
  
        })};
      return this.http.post( `${DOMAIN_BFM}${PAX_TYPES}`, payload , _options);
    }
  }

    // get shopping basket
    getShoppingBasket(): Observable<any> {
      if (!AppConfig.BASKET_MOCK) {
      const _options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm') }) };
      return this.http.get(`${API_BFM}${BOOKING_SHOPPING_BASKET}`, _options);
      } else {
        console.log(`${AppConfig.SHOPPING_BASKET_MOCKS}/shoppingBasket.json`);
        return this.http.get(`${AppConfig.SHOPPING_BASKET_MOCKS}/shoppingBasket.json`);
      }
    }

    setPnrData(pnrData: any) {
      this.pnrData = pnrData;
      this.pnrDataSource.next(this.pnrData);
    }
}
