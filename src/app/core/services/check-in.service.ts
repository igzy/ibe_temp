import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BFM, AppConfig, RETRIEVE_PNR, DOMAIN_BFM, BEARER_BFM_REST, CHECKIN_URL, BEARER_BFM } from '../../configs/app-settings.config';
import { map } from 'rxjs/operators';

@Injectable()
export class CheckInService {

  constructor(private http: HttpClient) { }

	sendRequest(params: any): Observable<any> {
		const _options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token_bfm') }) };
		return this.http.post(`${DOMAIN_BFM}${BEARER_BFM}${CHECKIN_URL}`, params, _options);
	}

}
