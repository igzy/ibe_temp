import { PassengerModel } from './passenger.model';

export interface PromocodeBodyModel {
    destination: string;
    origin: string;
    passengers: PassengerModel[];
    outboundDate: any;
    inboundDate: any;
    cabinClass: string;
    tripType: string;
}
