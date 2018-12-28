import { DateService } from '../../core/services/date.service';
import { MARKET_CODE_KEY, PROMO_CODE_KEY, PAYMENT_METHOD, LANGUAGE_KEY, USER_LOGGED_DATA_KEY,
    CURRENT_POINTS_KEY, FF_CARRIER_KEY, FF_LEVEL_KEY, FF_NUMBER_KEY ,
    FIRST_NAME__KEY, LAST_NAME_KEY, BIRTH_KEY, EMAIL_KEY, PHONE_NUMBER_KEY, PHONE_PREFIX_KEY,
    DEFAULT_PAYMENT_MILES_METHOD, PHONE_TYPE, TITLE_PAX, ALLIANCE_FF_LEVEL_KEY, COMMON_LANGUAGE_KEY, E_RETAIL_APPLICATION, BOOKING_DEFAULT
    } from '../../configs/app-settings.config';

export interface AditionalParams {
    application ?: string;
    module ?: string;
    group ?: string;
    device ?: string;
}

export interface UserProfile {
    allianceFfLevel: string;
    currentPoints?: string;
    ffCarrier?: string;
    ffLevel?: string;
    ffNumber?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    email ?: string;
    phones ?: [Phones];
    title ?: string;
}

export interface Phones {
    number ?: string;
    prefix ?: string;
    typePhone ?: string;
}

export class ERetailSearchRequest {
    aditionalParams?:  AditionalParams;
    adt?: number;
    airlineId?: any;
    cabinClass ?: any;
    changeReturn ?: boolean;
    channelDetectionName ?: any;
    chd?: number;
    communities?: any;
    departureDate?: any;
    destination?: any;
    groups?: any;
    inf?: number;
    language?: string;
    market?: string;
    origin?: any;
    passengers?: any;
    permittedCabins?: any;
    preferredCarrier?: any;
    promocode?: string;
    promotionId?: string;
    returnDate?: any;
    tripType?: string;
    userProfile?: UserProfile;
    constructor(data: any, deviceType: string, _dateService: DateService) {
        let moduleValue: string;

        if (!data.paymentMethod) {moduleValue = BOOKING_DEFAULT; } else {moduleValue = data.paymentMethod; }

        this.aditionalParams = { module: moduleValue, device: deviceType, application: E_RETAIL_APPLICATION};
        this.adt = data.passengers.ADT ?  data.passengers.ADT  : 0;
        this.airlineId = data.airlineId ?  data.airlineId : null;
        this.cabinClass = data.cabinClass ?  data.cabinClass : null;
        this.changeReturn = true;
        this.channelDetectionName = '';
        this.chd = data.passengers.CHD ?  data.passengers.CHD  : 0;
        this.communities = [];
        this.groups = [];
        this.inf = data.passengers.INF ?  data.passengers.INF  : 0;
        this.language =  sessionStorage.getItem(LANGUAGE_KEY) ;
        this.market = sessionStorage.getItem(MARKET_CODE_KEY);
        this.passengers = data.passengers ? data.passengers : null;
        this.permittedCabins = [];
        this.preferredCarrier = [];
        const promoCodeObject = JSON.parse(sessionStorage.getItem(PROMO_CODE_KEY));
        this.promocode = promoCodeObject ? promoCodeObject.promocodeCode : null;
        this.promotionId = '';
        this.tripType = data.tripType ? data.tripType : null;
        this.departureDate = [];
        this.destination = [];
        this.origin = [];
        if (data.tripType === 'M') {
            for ( let i = 0 ; i < data.departureDates.length; i++ ) {
                const destDate = _dateService.formatDate(data.departureDates[i]);
                this.departureDate.push(destDate);

                const dest = data.destinations[i];
                this.destination.push(dest[0]);

                const orig = data.origins[i];
                this.origin.push(orig[0]);
            }
        } else {
            this.departureDate = data.departureDate ?  [_dateService.formatDate(data.departureDate)] : null;
            this.destination = data.destination ?  data.destination : null;
            this.origin = data.origin ?  data.origin : null;
            this.returnDate = data.returnDate ? _dateService.formatDate(data.returnDate) : null;
        }
        if (localStorage.getItem(FF_NUMBER_KEY) != null) {
            this.userProfile = {
                allianceFfLevel: localStorage.getItem(ALLIANCE_FF_LEVEL_KEY),
                currentPoints: localStorage.getItem(CURRENT_POINTS_KEY),
                ffCarrier: localStorage.getItem(FF_CARRIER_KEY),
                ffLevel: localStorage.getItem(FF_LEVEL_KEY),
                ffNumber: localStorage.getItem(FF_NUMBER_KEY),
                firstName: localStorage.getItem(FIRST_NAME__KEY),
                lastName: localStorage.getItem(LAST_NAME_KEY),
                dateOfBirth: localStorage.getItem(BIRTH_KEY),
                email : localStorage.getItem(EMAIL_KEY),
                phones:  [{ number : localStorage.getItem(PHONE_NUMBER_KEY),
                                 prefix : localStorage.getItem(PHONE_PREFIX_KEY),
                                 typePhone : localStorage.getItem(PHONE_TYPE)}],
                title : localStorage.getItem(TITLE_PAX)
            };
        } else {
            this.userProfile = null;
        }
    }
}

export class ERetailPayWithMilesSearchRequest {
    aditionalParams?: AditionalParams;
    airlineId?: string;
    cabinClass ?: string;
    channelDetectionName ?: string;
    cmsId?: string;
    communities?: any;
    departureDate?: any;
    destination?: any;
    groups?: any;
    language?: string;
    market?: string;
    numSeat: number;
    numSeats: number;
    origin?: any;
    passengers?: any;
    permittedCabins?: any;
    preferredCarrier?: any;
    promocode?: string;
    promotionId?: string;
    returnDate?: string;
    tripType?: string;
    userProfile?: UserProfile;
    constructor(data: any, deviceType: string, _dateService: DateService) {
        let miles_language = '';
        if (sessionStorage.getItem(LANGUAGE_KEY) === 'en' || sessionStorage.getItem(LANGUAGE_KEY) === 'gb') {
            miles_language = 'us';
        }
        else
        {
            miles_language = sessionStorage.getItem(LANGUAGE_KEY) ;
        }


        this.aditionalParams = { module: DEFAULT_PAYMENT_MILES_METHOD, device: deviceType, application: E_RETAIL_APPLICATION};
        let loggedUserData: any;
        if (sessionStorage.getItem(USER_LOGGED_DATA_KEY)) {
            loggedUserData = JSON.parse(sessionStorage.getItem(USER_LOGGED_DATA_KEY));
        }
        this.airlineId = data.airlineId ?  data.airlineId : null;
        this.cabinClass = data.cabinClass ?  data.cabinClass : null;
        this.channelDetectionName = '';
        this.cmsId = '';
        this.communities = [];
        this.groups = [];
        this.language = miles_language;
        this.market = sessionStorage.getItem(MARKET_CODE_KEY);
        this.numSeat = 0;
        this.numSeats = 0;
        this.passengers = data.passengers ? data.passengers : null;
        this.permittedCabins = [];
        this.preferredCarrier = [];
        const promoCodeObject = JSON.parse(sessionStorage.getItem(PROMO_CODE_KEY));
        this.promocode = promoCodeObject ? promoCodeObject.promocodeCode : null;
        this.promotionId = '';
        this.tripType = data.tripType ? data.tripType : null;

        this.departureDate = [];
        this.destination = [];
        this.origin = [];
        if (data.tripType === 'M') {
            for ( let i = 0 ; i < data.departureDates.length; i++ ) {
                const destDate = _dateService.formatDate(data.departureDates[i]);
                this.departureDate.push(destDate);

                const dest = data.destinations[i];
                this.destination.push(dest[0]);

                const orig = data.origins[i];
                this.origin.push(orig[0]);
            }
        } else {
            this.departureDate = data.departureDate ?  [_dateService.formatDate(data.departureDate)] : null;
            this.destination = data.destination ?  data.destination : null;
            this.origin = data.origin ?  data.origin : null;
            this.returnDate = data.returnDate ? _dateService.formatDate(data.returnDate) : null;
        }
        if (localStorage.getItem(FF_NUMBER_KEY) != null) {
            this.userProfile = {
                allianceFfLevel: localStorage.getItem(ALLIANCE_FF_LEVEL_KEY),
                currentPoints: localStorage.getItem(CURRENT_POINTS_KEY),
                ffCarrier: localStorage.getItem(FF_CARRIER_KEY),
                ffLevel: localStorage.getItem(FF_LEVEL_KEY),
                ffNumber: localStorage.getItem(FF_NUMBER_KEY),
                firstName: localStorage.getItem(FIRST_NAME__KEY),
                lastName: localStorage.getItem(LAST_NAME_KEY),
                dateOfBirth: localStorage.getItem(BIRTH_KEY),
                email : localStorage.getItem(EMAIL_KEY),
                phones:  [{ number : localStorage.getItem(PHONE_NUMBER_KEY),
                                 prefix : localStorage.getItem(PHONE_PREFIX_KEY),
                                 typePhone : localStorage.getItem(PHONE_TYPE)}],
                title : localStorage.getItem(TITLE_PAX)
            };
        } else {
            this.userProfile = null;
        }
    }
}
