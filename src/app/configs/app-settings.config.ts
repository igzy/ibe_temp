// Guide to create a new environment url
/*
1.- Add new entrie to the environments field in the .angular-cli.json file.

    "environments": {
      "dev": "environments/environment.ts",
      "prod": "environments/environment.prod.ts",
    }
2.- Create the corresponding file in the envirnments folder
    - environment.prod.ts
3.- The command to build will be "ng build --env=prod" (or --env=dev)


*/
import { environment } from '../../environments/environment';
import { IAppConfigModel } from '../shared/models/i-app-config.model';
import { ResponseCodesModel } from '../shared/models/response-codes.model';

console.log('ENDPOINT', environment.api_url);
console.log('PATH', window.location.protocol  + '//' + window.location.host);

export const AppConfig: IAppConfigModel = {
  API_ENDPOINT_BFM: environment.api_url,
  API_ENDPOINT_IBE_ADMIN: 'http://10.29.65.53/',
  LANGUAGE_MOCKS: window.location.protocol  + '//' + window.location.host + '/app/core/mocks/languages',
  PAYMENT_MOCKS: './app/core/mocks/payment',
  BOOKING_MOCKS: './app/core/mocks/booking',
  RETRIEVE_PNR_MOCKS: './app/core/mocks/mmb',
  SHOPPING_BASKET_MOCKS: './app/core/mocks/shopping',
  SET_CONTACT_DATA_MOCKS: './app/core/mocks/mmb',
  CREATE_SESSION_BFM_MOCKS: './app/core/mocks/mmb',
  CREATE_SESSION_BFMADMIN_MOCKS: './app/core/mocks/mmb',
  CREATE_MARKETS_MOCKS: './app/core/mocks/markets',
  CREATE_LOCALES_MOCKS: './app/core/mocks/locales',
  FLIGHT_INFO_MOCKS: './app/core/mocks/flight-info',
  AVAILABILITY_MOCK: false,
  ORIGINS_MOCK: false,
  DESTINATIONS_MOCK: false,
  PNR_MOCK: false,
  BASKET_MOCK: false,
  CONTACT_MOCK: false,
  SESSION_BFM_MOCK: false,
  SESSION_BFMADMIN_MOCK: false,
  SAVE_PASSENGER_MOCK: false,
  TERMS_CONDITIONS_MOCK: false,
  BOOKING_FARE_MOCK: false,
  GET_PAX_INFO: false,
  GET_PREFIX: false,
  MARKETS_MOCK: false,
  LOCALES_MOCK: false,
  GET_FLIGHT_MOCK: false,
  PRICES_CALENDAR_MOCK: false,
  FLIGHT_STATUS_MOCK: false,
  PAX_MOCK: false,
  SESSION_EPRICING_MOCK: false,
  DATES_CALENDAR_PRICE_MOCK: false,
  DEPARTURE_CALENDAR_PRICE_MOCK: false
};

// Liferay
export const DELAY_LIFERAY_VARIABLES = 5;

// E-Retail

export const E_RETAIL_ACTIVATED = true;
export const E_RETAIL_APPLICATION = 'B2C_PORTAL';

// Multicity

export const MULTICITY_MAX_ROWS = 6; // If is over 6 the flight-seacrh component must be changed.
export const MULTICITY_MIN_ROWS = 2;

// Enhanced Shopper

export const ENHANCED_SHOPPER_URL = 'https://dealfinder.lot.com/ENHANCED_SHOPPER/#/main?';

export const ResponseCodes: ResponseCodesModel = {
  SUCCESSFULL: '200',
  ERROR: '400'
};

// default language and market
export const DEFAULT_LANGUAGE = 'fr';
export const DEFAULT_LANGUAGE_NAME = 'French';
export const DEFAULT_MARKET = 'Belgium';
export const DEFAULT_MARKET_CODE = 'BE';
export const DEFAULT_TRIP_TYPE = 'R';
export const DEFAULT_AIRLINE_ID = 'AT';

export const LANGUAGE_KEY = 'language';
export const LANGUAGE_NAME_KEY = 'language_name';
export const MARKET_KEY = 'market';
export const MARKET_CODE_KEY = 'marketcode';
export const PROMO_CODE_KEY = 'promocode';
export const TRIP_TYPE_KEY = 'tripType';
export const AIRLINE_ID_KEY = 'airlineId';
export const TOKEN_BFM_KEY = 'token_bfm';
export const TOKEN_EPRICING_KEY = 'token_epricing';
export const OPE_EXT = 'extat';

export const LOGIN_URL = '/login';
export const FLIGHT_STATUS_URL_FR = '/reservation/statut-vol';
export const FLIGHT_STATUS_URL_EN = '/booking/flight-info';
export const USER_LOGGED_INDICATOR_KEY = 'isUserLogged';
export const USER_LOGGED_DATA_KEY = 'isUserLogged';
export const LOGIN_URL_SESSION_KEY = 'loginUrl';


export const CHANNEL = 'channel';
export const TIER = 'tier';
export const DEFAULT_CHANNEL = 'desktop';
export const DEFAULT_TIER = 'gold';

// export const OPE_EXT = 'extly';

// export const BFM_CREDENTIALS = {
//   'clientId': '-bqBinBiHz4Yg+87BN+PU3TaXUWyRrn1T/iV/LjxgeSU=',
//   'clientSecret': 'DxKLkFeWzANc4JSIIarjoPSr6M+cXv1rcqWry2QV2Azr5EutGYR/oJ79IT3fMR+qM5H/RArvIPtyquvjHebM1Q==',
//   'referralSessionId': 'asdasda213123',
//   'referralId': 'sadassdasdsa',
//   'market': 'ES',
//   'language': 'en'
// };

export const BFM_CREDENTIALS = {
  'clientId' : '-bqBinBiHz4Yg+87BN+PU3TaXUWyRrn1T/iV/LjxgeSU=',
  'clientSecret' : 'DxKLkFeWzANc4JSIIarjoPSr6M+cXv1rcqWry2QV2Azr5EutGYR/oJ79IT3fMR+qM5H/RArvIPtyquvjHebM1Q==',
  'referralId' : 'h7g+cmbKWJ3XmZajrMhyUpp9.cms35',
  'market' : 'BE',
  'language' : 'fr',
  'userProfile' : {
  'ffCarrier' : 'LO',
  'ffNumber' : null,
  'ffLevel' : null,
  'login' : null,
  'type' : null,
  'name' : null,
  'surname' : null,
  'pointsType' : null,
  'points' : null,
  'loyaltyProgramId' : null
  },
  'appModule' : '0'
  };

export const BFM_ADM_CREDENTIALS = {
  'username': 'admin',
  'password': 'admin'
};
/******************************************
** Based on IBE Services Guide.3.0.20.docx
******************************************/
export const DOMAIN_BFM = AppConfig.API_ENDPOINT_BFM;
export const BEARER_BFM = 'bfm/service/';
export const BEARER_BFM_REST = 'bfm/rest/';
export const BEARER_BFM_ADM = 'bfmadmin/';
export const API_BFM = DOMAIN_BFM + BEARER_BFM_REST;
export const API_BFM_ADM = DOMAIN_BFM + BEARER_BFM_ADM;
export const API_BEARER_BFM = DOMAIN_BFM + BEARER_BFM;
export const BEARER_EPRICING = 'EPRICING/';
export const API_EPRICING = DOMAIN_BFM + BEARER_EPRICING;


// (3) SESSION CONTROL SERVICES
export const SESSION_CREATE = 'session/create'; // 3.1
export const SESSION_BFM_ADM_CREATE = 'auth/login'; // 3.1
export const SESSION_EPRICING_CREATE = 'auth/login';

// (4) BOOKING SERVICES
export const BOOKING_AVAILABILITY = 'booking/availability'; // 4.1
export const BOOKING_FARE = 'booking/fare'; // 4.2
// export const BOOKING_PAX = 'booking/ext/pax'; // 4.3
export const BOOKING_PAX = 'booking/ext/pax'; // 4.3
export const BOOKING_BOOK = 'booking/book'; // 4.4
export const PRICES_CALENDAR = 'calendar/prices'; // 4.5
export const BOOKING_CONTACT_DATA = 'reservation/modify/contact';
export const BOOKING_SEARCH = 'booking/ext/search/fast'; // 4.4 GET /ext/locations/destination
export const BOOKING_ORIGINS = `${OPE_EXT}/search/locations/origin`;
export const BOOKING_DESTINATIONS = `${OPE_EXT}/search/locations/destination`;
export const BOOKING_PAX_INFO = 'booking/ext/paxInfo';
export const BOOKING_PREFIX = 'booking/ext/prefix';
export const BOOKING_CONDITIONS_OUTBOUND = 'termConditionSearch/ext/conditions/outbound  '; // New service
export const BOOKING_OUTBOUND = 'booking/ext/search/outbound'; // New service
export const BOOKING_CONDITIONS_INBOUND = 'termConditionSearch/ext/conditions/inbound'; // New service
export const BOOKING_INBOUND = 'booking/ext/search/inbound'; // New service
export const PAX_TYPES = `bfm/service/${OPE_EXT}/search/pax`;
export const E_RETAIL = 'eretail/v2/bookaflight';
export const E_RETAIL_PAY_WITH_MILES = 'eretail/v2/paywithmiles';
export const BOOKING_CALENDAR = `${OPE_EXT}/booking/search/calendar/prices`;
export const BOOKING_DATES_CALENDAR_PRICE = 'BfmCache/searchBestPriceForDates';
export const BOOKING_DEPARTURE_CALENDAR_PRICE = 'BfmCache/searchBestPricesForDepartures';

// mobile services
export const E_RETAIL_MOBILE = 'eretail/mobile/bookaflight';
export const FLIGHT_TIME_TABLE_MOBILE = 'eretail/mobile/flighttimetable';
export const MANAGEBOOKING_URL_MOBILE = 'eretail/mobile/managebooking ';
export const E_RETAIL_PAY_WITH_MILES_MOBILE = 'eretail/mobile/paywithmiles';

// (4.6) PRICES CALENDARS BY MONTH
export const DEPARTURE_PRICES_BY_MONTH = 'calendar/prices/monthly/departure'; // 4.6.1
export const RETURN_PRICES_BY_MONTH = 'calendar/prices/monthly/return'; // 4.6.2

// (5) BOOKING MULTI-CITY SERVICES
export const BOOKING_MULTI_NEXT_AVAILABILITY = 'booking/availabilityMultiNext'; // 5.1

// (6) REDEMPTION BOOKING SERVICES
export const REDEMPTION_AVAILABILITY = 'redemption/availability'; // 6.1

// markets
export const MARKETS = 'market/list/entity/2';
export const LOCALES = 'service/locale/list/general/locale';


// MANAGMENT BOOKING FLOW
// export const RETRIEVE_PNR = 'reservation/retrievePNR';

export const MANAGEBOOKING_URL = 'eretail/v2/managebooking';
export const CHECKIN_URL =  'eretail/v2/checkinonline';
export const FLIGHTSTATUS_URL = OPE_EXT + '/booking/flightstatus';


// RECOVER ALL DATA RELATED WITH BOOKING
export const BOOKING_SHOPPING_BASKET = 'booking/shopping/basket';


// DATEPICKER
export const I18N_VALUES = {
  'en': {
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  },
  'gb': {
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  },
  'fr': {
    weekdays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  }
  // other languages you would support
};


// cookies here
export const SEARCH_LIST_COOKIE = 'searchList';
export const COOKIE_EXP_DAYS = 1;
export const SEARCH_LIST_COOKIE_COUNT = 5;

// MANAGMENT BOOKING FLOW
export const RETRIEVE_PNR = 'reservation/retrievePNR';

// mobile width based on _variables.scss
export const MOBILE_WIDTH = 720;
export const CALENDAR_DAYS = 7;

// market codes for Morocco and Senegal
export const MARKET_CODE_MOROCCO = 'MA';
export const MARKET_CODE_SENEGAL = 'SN';

// country name for Morocco
export const COUNTRY_NAME_CODE_MOROCCO = 'MA';
// language codes for Morocco and Senegal
export const LANGUAGE_CODE_ARABIC = 'Arabic';

// payment method key for session
export const PAYMENT_METHOD = 'payment_method';
export const DEFAULT_PAYMENT_METHOD = 'Booking';
export const DEFAULT_PAYMENT_MILES_METHOD = 'Booking_Miles';


// paymenth methods for marocco
export const BOOKING_MA_CARD = 'Booking_MA_Card';
export const BOOKING_INT_CARD = 'Booking_INT_Card';
export const BOOKING_CASH = 'Booking_Cash';
export const BOOKING_DEFAULT = 'Booking';

// modules
export const MMB_MODULES = 'Manage_Booking';
export const CHECKIN_MODULES = 'Check_In';


// default dir
export const DEFAULT_DIR = 'ltr';

export const BOOKING_APP = 'booking-app-page';

// E-pricing credentials
export const EPRICING_CREDENTIALS = {
  'username': 'guest',
  'password': 'guest'
};

// max night and day night config for e pricing
export const E_PRICING_MAX_NIGHTS = 30;
export const E_PRICING_MAX_DAY_NIGHTS = 30;

// minimum length allowed for promocode
export const PROMO_CODE_MIN_LENGTH = 3;

// loged user variables
export const CURRENT_POINTS_KEY = 'currentPoints';
export const FF_CARRIER_KEY = 'ffCarrier';
export const FF_LEVEL_KEY = 'ffLevel';
export const FF_NUMBER_KEY = 'ffNumber';
export const FIRST_NAME__KEY = 'firstName';
export const LAST_NAME_KEY = 'lastName';
export const BIRTH_KEY = 'dateOfBirth';
export const EMAIL_KEY = 'email';
export const PHONE_NUMBER_KEY = 'number';
export const PHONE_PREFIX_KEY = 'prefix';
export const PHONE_TYPE = 'typePhone';
export const TITLE_PAX = 'title';
export const ALLIANCE_FF_LEVEL_KEY = 'allianceFfLevel'; 
export const COMMON_LANGUAGE_KEY = 'commLanguage';


// device types
export const DEVICE_TYPE_WEB = 'DESKTOP';
export const DEVICE_TYPE_MOBILE = 'MOBILE';
