import { MARKET_CODE_KEY } from "../../configs/app-settings.config";

export interface CalendarPriceRequestModel{
    market: string;
    language: string;
    airlineId: string;
    departureDate: any;
    returnDate: any;
    origin: any;
    destination: any;
    passengers: any;
    tripType: string;
    cabinClass: any;    
}

export class CalendarPriceInputModel {
    market: string;
    language: string;
    airlineId: string;
    departureDate: any;
    returnDate: any;
    origin: any;
    destination: any;
    passengers: any;
    tripType: string;
    cabinClass: any;  
    constructor(data, position: number) {
        this.market = sessionStorage.getItem(MARKET_CODE_KEY);
        this.language =  data.language ? data.language : null;
        this.airlineId = data.airlineId ?  data.airlineId  : null;
        this.departureDate = null;
        this.returnDate = null;
        // if no passenger type is selected yet by the user price basis will be defaulted to 1 adult
        this.passengers = data.passengers ? data.passengers : {"ADT": 1,"CHD": 0,"INF": 0}; 
        this.tripType = data.tripType ? data.tripType : null;
        this.cabinClass = data.cabinClass ?  [data.cabinClass] : ['E'];

        if (data.tripType !== 'M') {
            this.origin = data.origin ? data.origin : null;
            this.destination = data.destination ? data.destination : null;
        }
    }
}

export interface CalendarPriceDateInputModel{
    entityId : number;
    market: string;
    origin: any;
    destination: any;
    tripType: string;
    cabinClass: any;  
    directFlight: boolean; 
}

export class CalendarPriceDateModel {
    entityId : number;
    market: string;
    origin: any;
    destination: any;
    tripType: string;
    cabinClass: any;  
    directFlight: boolean;
    constructor(data: any) {
        this.entityId = 1;
        this.market = sessionStorage.getItem(MARKET_CODE_KEY);
        this.tripType = data.tripType ? data.tripType : null;
        this.cabinClass = data.cabinClass ?  data.cabinClass : 'E';
        this.directFlight = true;
        if (data.tripType !== 'M') {
            this.origin = data.origin ? data.origin[0] : null;
            this.destination = data.destination ? data.destination[0] : null;
        }
    }
}