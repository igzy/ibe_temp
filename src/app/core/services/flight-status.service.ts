import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOMAIN_BFM, BEARER_BFM, FLIGHTSTATUS_URL, AppConfig } from '../../configs/app-settings.config';

@Injectable()
export class FlightInfoService { 

    constructor(private http: HttpClient) { }

    checkFlightStatus(departureCode: string, arrivalCode: string, flightNumber: string): Observable<any> {

        let param: string = '';
        param = flightNumber ? flightNumber : (departureCode + '/' + arrivalCode);
        if (AppConfig.FLIGHT_STATUS_MOCK) { 
            console.log(`${AppConfig.FLIGHT_INFO_MOCKS}/flight-status.json`);
            return this.http.get(`${AppConfig.FLIGHT_INFO_MOCKS}/flight-status.json`);
        } else {
            const _options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm') }) };
            return this.http.get(`${DOMAIN_BFM}${BEARER_BFM}${FLIGHTSTATUS_URL}` + '/' + param, _options);
        }
    }
}
