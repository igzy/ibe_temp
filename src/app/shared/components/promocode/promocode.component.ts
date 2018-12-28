import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { PromocodeBodyModel } from '../../models/promocode.model';
import { PromocodeService } from '../../../core/services/promocode.service';
import { MARKET_CODE_KEY, PROMO_CODE_KEY, PROMO_CODE_MIN_LENGTH } from '../../../configs/app-settings.config';
import { LanguageService } from '../../../core/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit, OnChanges, OnDestroy {

  displayPromoInput = false;
  isValidPromoCode = false;
  apiRespondedFlag = false;
  promocodeForm: FormGroup;

  @Input() promocodeBody: PromocodeBodyModel;
  @Input() formValidityFlag: boolean;
  @Input() searchFormGroup: FormGroup;
  @Input() translations;

  direction: string;
  allSubs: Subscription[] = [];

  minLengthReached = false;

  constructor(private _promocodeService: PromocodeService,
              private _languageService: LanguageService) { }

  ngOnInit() {
    this.promocodeForm = new FormGroup({
      'promocode': new FormControl(null)
    });

    const languageSubscription = this._languageService.directionUpdate$.subscribe(data => {
      if (data) {
        this.direction = data;
      }
    });

    this.allSubs.push(languageSubscription);
  }

  displayPromoField() {
      this.displayPromoInput = true;
  }

  clearPromoField() {
    this.isValidPromoCode = false;
    this.displayPromoInput = false;
    this.minLengthReached = false;
    this.apiRespondedFlag = false;
    sessionStorage.removeItem(PROMO_CODE_KEY);
    this.promocodeForm.get('promocode').setValue(undefined);
  }

  validatePromocode() {
    if (this.formValidityFlag) {
      const promocode: string = this.promocodeForm.controls.promocode.value;
      if (!promocode) {
        this.isValidPromoCode = false;
        this.displayPromoInput = false;
        this.apiRespondedFlag = false;
        sessionStorage.removeItem(PROMO_CODE_KEY);
        this.minLengthReached = false;
      } else if (promocode.length >= PROMO_CODE_MIN_LENGTH) {
        this.minLengthReached = true;
        const promocodeObject = {
          // 'channel': 'null',
          'entityId': 2,
          'ffCard': 'Gold',
          'flightConditions': {
            'cabinClass':  this.promocodeBody.cabinClass,
            'destination': this.promocodeBody.destination,
            'flightType': this.promocodeBody.tripType,
            'inboundDate': this.promocodeBody.inboundDate,
            'origin': this.promocodeBody.origin,
            'originDestinationList': [
              {
                'destination': this.promocodeBody.destination,
                'origin': this.promocodeBody.origin
              }
            ],
            'outboundDate': this.promocodeBody.outboundDate,
            'passengerTypeAmountList':
              this.promocodeBody.passengers
          },
          'market': sessionStorage.getItem(MARKET_CODE_KEY),
          'office': 'string',
          'promocodeCode': this.promocodeForm.controls.promocode.value,
          'promocodeUsageId': null,
          'relatedIdentificators': [
            'string'
          ],
          'sessionId': '2dkq3h423642896432894233e213',
          'variableDays': 0
        };
        this._promocodeService.validatePromocode(promocodeObject).subscribe(result => {
          this.apiRespondedFlag = true;
          if (result.status === '200') {
            this.isValidPromoCode = true;
            this.displayPromoInput = false;
            this._promocodeService.usagePromocode();
            sessionStorage.setItem(PROMO_CODE_KEY, JSON.stringify(promocodeObject));
          } else {
            this.isValidPromoCode = false;
            this.displayPromoInput = true;
            sessionStorage.removeItem(PROMO_CODE_KEY);
          }
        });
      } else {
        this.minLengthReached = false;
      }
    }
  }

  ngOnChanges() {
    this.direction = this._languageService.getDir();
    if (this.formValidityFlag) {
      this.validatePromocode();
    } else {
      this.isValidPromoCode = false;
      this.apiRespondedFlag = false;
      sessionStorage.removeItem(PROMO_CODE_KEY);
      if (this.promocodeForm && this.promocodeForm.value.promocode) {
        this.displayPromoInput = true;
      }
    }
  }

  ngOnDestroy () {
    for (const sub of this.allSubs) {
      sub.unsubscribe();
    }
  }
}
