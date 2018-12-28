import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOMAIN_BFM, BEARER_BFM } from '../../configs/app-settings.config';

@Injectable()
export class PromocodeService {

  constructor(private http: HttpClient) { }


  validatePromocode(promocodeObject: any): Observable<any> {
    const _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    const promocodeParams = promocodeObject;
    console.log('Hemos llegado aqui', promocodeObject);
    return this.http.post(`${DOMAIN_BFM}${BEARER_BFM}promocode/v3/validate`, promocodeParams, _options);
  }

  usagePromocode() {
    console.log('Generating promocode');
  }

  usePromocode(promocodeObject: any): Observable<any> {
    const _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    const promocodeParams = promocodeObject;
    return this.http.post(`${DOMAIN_BFM}${BEARER_BFM}promocode/v3/usage`, promocodeParams, _options);
  }
}
