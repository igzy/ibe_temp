import { DateService } from '../../core/services/date.service';
import { MARKET_CODE_KEY } from '../../configs/app-settings.config';

export class BookingSearchRequest {
    airlineId?: string;
    cabinClass?: any;
    departureDate ?: any;
    departureDate1 ?: any;
    departureDate2 ?: any;
    departureDate3?: any;
    departureDate4?: any;
    departureDate5?: any;
    destination?: any;
    destination1?: any;
    destination2?: any;
    destination3?: any;
    destination4?: any;
    destination5?: any;
    language?: string;
    market?: string;
    origin?: any;
    origin1?: any;
    origin2?: any;
    origin3?: any;
    origin4?: any;
    origin5?: any;
    passengers?: any;
    payment?: string;
    returnDate?: string;
    tripType?: string;
    constructor(data, _dateService: DateService) {

        this.airlineId = data.airlineId ?  data.airlineId  : null;
        this.cabinClass = data.cabinClass ?  [data.cabinClass] : null;
        this.language =  data.language ? data.language : null;
        this.market = sessionStorage.getItem(MARKET_CODE_KEY);
        this.passengers = data.passengers ? data.passengers : null;
        this.payment = data.payment ? 'cash' : 'cash';
        this.tripType = data.tripType ? data.tripType : null;

        if (data.tripType === 'M') {
            this.departureDate = [];
            this.destination = [];
            this.origin = [];
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
            this.departureDate1 = null;
            this.departureDate2 =  null;
            this.departureDate3 = null;
            this.departureDate4 = null;
            this.departureDate5 = null;
            this.destination = data.destination ?  data.destination : null;
            this.destination1 = null;
            this.destination2 = null;
            this.destination3 = null;
            this.destination4 = null;
            this.destination5 = null;
            this.origin = data.origin ?  data.origin : null;
            this.origin1 = null;
            this.origin2 = null;
            this.origin3 = null;
            this.origin4 = null;
            this.origin5 = null;
            this.returnDate = data.returnDate ? _dateService.formatDate(data.returnDate) : null;
        }
    }
}
