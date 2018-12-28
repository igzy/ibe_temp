import { Component, OnInit, ViewEncapsulation, Input, OnChanges, ElementRef, OnDestroy } from '@angular/core';
import { CommonsBfmService } from './core/services/commons-bfm.service';
import { BfmSessionResponseModel } from './shared/models/bfm-session-response.model';
import { ResponseCodes,
  DEFAULT_MARKET_CODE,
  DEFAULT_MARKET,
  MARKET_KEY,
  DEFAULT_LANGUAGE,
  PAYMENT_METHOD,
  LANGUAGE_KEY,
  TRIP_TYPE_KEY,
  MARKET_CODE_KEY,
  DEFAULT_TRIP_TYPE,
  AIRLINE_ID_KEY,
  DEFAULT_AIRLINE_ID,
  BOOKING_APP,
  DELAY_LIFERAY_VARIABLES,
  CHANNEL,
  DEFAULT_CHANNEL,
  TIER,
  DEFAULT_TIER,
  TOKEN_BFM_KEY,
  USER_LOGGED_DATA_KEY,
  CURRENT_POINTS_KEY,
  FF_CARRIER_KEY,
  FF_LEVEL_KEY,
  FF_NUMBER_KEY,
  FIRST_NAME__KEY,
  LAST_NAME_KEY,
  BIRTH_KEY,
  EMAIL_KEY,
  PHONE_NUMBER_KEY,
  PHONE_PREFIX_KEY,
  PHONE_TYPE,
  TITLE_PAX,
  TOKEN_EPRICING_KEY,
  COMMON_LANGUAGE_KEY,
  ALLIANCE_FF_LEVEL_KEY} from './configs/app-settings.config';
import { MarketService } from './core/services/market-service';
import { LanguageService } from './core/services/language.service';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { CommonsEPricingService } from './core/services/commons-epricing.service';
import { AuthorizationService } from './core/services/authorization.service';
import { Subscription } from '../../node_modules/rxjs';
// import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
// import { NgbDateFRParserFormatter } from './shared/formatters/ngb-date-fr-parser-formatter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
  //encapsulation: ViewEncapsulation.Native
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {

  data: any;
  direction: string;
  language: string;
  htmlStr: string;
  timeLeft: number = DELAY_LIFERAY_VARIABLES;
  interval;
  translations: any;
  midata:any;
  tab: string;
  redemption: boolean = false;
  authorized: boolean = true;
  allSubscription: Subscription[] =[];

  constructor(private _commonsBfmService: CommonsBfmService,
              private _marketService: MarketService,
              private _languageService: LanguageService,
              private _commonsEpricingService: CommonsEPricingService,
              private elementRef:ElementRef,
              private _authorizationService: AuthorizationService) {
      
  }

  ngOnInit() {

    // sessionStorage.setItem(MARKET_CODE_KEY, DEFAULT_MARKET_CODE);
    // sessionStorage.setItem(MARKET_KEY, DEFAULT_MARKET); 
    if (this.elementRef.nativeElement.getAttribute('tab')) {
      this.tab =  this.elementRef.nativeElement.getAttribute('tab');
    } else {
      this.tab = '';
    }

    if (this.elementRef.nativeElement.getAttribute('redemption') 
      && this.elementRef.nativeElement.getAttribute('redemption') === "true") {
      this.redemption = true;
    } else {
      this.redemption = false;
    }
    sessionStorage.setItem(TRIP_TYPE_KEY, DEFAULT_TRIP_TYPE);
    sessionStorage.setItem(AIRLINE_ID_KEY, DEFAULT_AIRLINE_ID);
    sessionStorage.setItem(TIER, DEFAULT_TIER);
    sessionStorage.setItem(CHANNEL, DEFAULT_CHANNEL);
   
    sessionStorage.removeItem(TOKEN_BFM_KEY);
    this.removeUserProfileSessionVariables();
    
    this.startTimerLiferayVariables();

    this.updateTranslation();

    window.addEventListener('marketSelectedEvent', this.broadcastMarketUpdate.bind(this));
    window.addEventListener('languageSelectedEvent', this.updateLanguage.bind(this));
    let authorizationSubscription = this._authorizationService.authorized.subscribe(isAuthorized => {
      this.authorized = isAuthorized;
    });
    this.allSubscription.push(authorizationSubscription);
  }

  ngOnChanges() {
    console.log(this.tab);
  }

  removeUserProfileSessionVariables()
  {
    if(sessionStorage.getItem(USER_LOGGED_DATA_KEY) == null || sessionStorage.getItem(USER_LOGGED_DATA_KEY) === "false") 
    {
      localStorage.removeItem(ALLIANCE_FF_LEVEL_KEY);
      localStorage.removeItem(FF_CARRIER_KEY);
      localStorage.removeItem(FF_LEVEL_KEY);
      localStorage.removeItem(FF_NUMBER_KEY);
      localStorage.removeItem(FIRST_NAME__KEY);
      localStorage.removeItem(LAST_NAME_KEY);
      localStorage.removeItem(BIRTH_KEY);
      localStorage.removeItem(EMAIL_KEY);
      localStorage.removeItem(PHONE_NUMBER_KEY);
      localStorage.removeItem(PHONE_PREFIX_KEY);
      localStorage.removeItem(PHONE_TYPE);
      localStorage.removeItem(TITLE_PAX);
      localStorage.removeItem(COMMON_LANGUAGE_KEY);

    }
  }

  startTimerLiferayVariables() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        console.log(this.timeLeft+" seconds left");
        if(sessionStorage.getItem(MARKET_CODE_KEY) != null) 
        {
          console.log("session values are NOT null, create session");
          this.createBFMsessionOnInit();
          this.createEPricingSessionOnInit(); 
          clearInterval(this.interval);
        }
      } else {
        clearInterval(this.interval);
        console.log("after "+this.timeLeft+" session variables are NULL. Set default values and create session");
        sessionStorage.setItem(LANGUAGE_KEY, DEFAULT_LANGUAGE);
        sessionStorage.setItem(MARKET_CODE_KEY, DEFAULT_MARKET_CODE);
        this.broadcastMarketUpdate();
        this.createBFMsessionOnInit();
        this.createEPricingSessionOnInit(); 
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  createBFMsessionOnInit()
  {
  
       

    console.log("trying to  create BFM session");
    let createSessionSubscription = this._commonsBfmService.createSessionBfm().subscribe((response: BfmSessionResponseModel) => {
      this.data = response;
      if (this.data.status === ResponseCodes.SUCCESSFULL) {
        console.log('BFM Session created successfully');
        sessionStorage.setItem('token_bfm', this.data.id);
      }
    }, err => {
        console.error(err);
        console.log('Error creating BFM session');
      }
    );
    this.allSubscription.push(createSessionSubscription);
  }

  broadcastMarketUpdate() {
    const market = sessionStorage.getItem(MARKET_CODE_KEY);
    console.log('New market selected: ' + market);
    this._marketService.updateMarket();
  }

  updateLanguage() {
    this.language = this._languageService.getLanguage();
    this._languageService.setLanguage(this.language);
    this.updateTranslation();
    this.broadcastDirUpdate();
  }

  updateTranslation() {
    const translationsSubscription = this._languageService.getTranslations(BOOKING_APP).subscribe(
      translations => {
        this.translations = translations;
      }, err => {
        console.error(err);
      }
    );
    this.allSubscription.push(translationsSubscription);
  }

  broadcastDirUpdate() {
    this.direction = this._languageService.getDir();
    this._languageService.dirUpdate(this.direction);
  }

  createEPricingSessionOnInit() {
    console.log("creating epricing session");
    let epricingSubscription = this._commonsEpricingService.createSessionEPricing().subscribe((response: any) => {
      this.data = response;
      if (this.data.token) {
        console.log('E-Pricing Session created successfully');
        sessionStorage.setItem(TOKEN_EPRICING_KEY, this.data.token);
      }
    }, err => {
        console.error(err);
        console.error('Error creating BFM session');
      }
    );
    this.allSubscription.push(epricingSubscription);
  }

  ngOnDestroy() {
    for(let sub of this.allSubscription) {
      sub.unsubscribe();
    }
  }
}
