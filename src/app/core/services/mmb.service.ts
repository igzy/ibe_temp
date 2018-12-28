import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BFM, AppConfig, RETRIEVE_PNR, DOMAIN_BFM, BEARER_BFM_REST, MANAGEBOOKING_URL, BEARER_BFM, MANAGEBOOKING_URL_MOBILE } from '../../configs/app-settings.config';
import { RetrievePnrInputModel } from '../../shared/models/retrieve-pnr.model';
import { map } from 'rxjs/operators';
import { MobileService } from './mobile.service';

@Injectable()
export class MmbService {
  isMobile: boolean = false;

  constructor(private http: HttpClient,  private mobileService: MobileService) {
    this.mobileService
    .getIsMobile()
    .subscribe(value => (this.isMobile = value));
  }

  // retieve PNR with locator/surname
  retrievePnr(_retrievePnrInput: RetrievePnrInputModel): Observable<any> {
    if (!AppConfig.PNR_MOCK) {
      console.log(`Invoking service ${API_BFM}${RETRIEVE_PNR}`);
      const _options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm') }) };
      return this.http.post(`${API_BFM}${RETRIEVE_PNR}`, _retrievePnrInput, _options);
    } else {
      console.log(`${AppConfig.RETRIEVE_PNR_MOCKS}/retrievePNR.json`);
      return this.http.get(`${AppConfig.RETRIEVE_PNR_MOCKS}/retrievePNR.json`);
    }
  }

  	sendRequest(param: any): Observable<any> {
		const _options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm') }) };
		return this.http.post(`${DOMAIN_BFM}${BEARER_BFM}${MANAGEBOOKING_URL }`, param, _options);

	}

}
