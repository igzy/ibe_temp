// tslint:disable-next-line:max-line-length
import { TIER, AIRLINE_ID_KEY, LANGUAGE_KEY, DEVICE_TYPE_MOBILE, DEVICE_TYPE_WEB, E_RETAIL_APPLICATION,
     MMB_MODULES, MARKET_CODE_KEY } from '../../configs/app-settings.config';

export interface AditionalParams {
    TIER ?: string;
    device ?: string;
    application ?: string;
    module ?: string;
}

export class ManageBookingRequest {
    aditionalParams?: AditionalParams;
    airlineId?: string;
    language?: string;
    lastName?: string;
    recLoc?: string;
    market ?: string;
    constructor(data: any, isMobileFlag: boolean) {


        if (sessionStorage.getItem(LANGUAGE_KEY) === 'en') {
            sessionStorage.setItem(LANGUAGE_KEY, 'gb');
        }

        this.aditionalParams = {
            TIER: sessionStorage.getItem(TIER),
            device: isMobileFlag ? DEVICE_TYPE_MOBILE : DEVICE_TYPE_WEB,
            application: E_RETAIL_APPLICATION,
            module: MMB_MODULES
        };
        this.market = sessionStorage.getItem(MARKET_CODE_KEY);
        this.airlineId = sessionStorage.getItem(AIRLINE_ID_KEY);
        this.language = sessionStorage.getItem(LANGUAGE_KEY);
        this.lastName = data.lastName ?  data.lastName : null;
        this.recLoc = data.bookingNumber.toUpperCase() ?  data.bookingNumber.toUpperCase() : null;
    }
}
