import { DestinationResultModel } from "./destination-result.model";
import { OriginResultModel } from "./origins-result.model";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export interface HistorySearchModel {
  origin: OriginResultModel;
  destination: DestinationResultModel;
  originDate: NgbDate;
  destinationDate: NgbDate;
  tripType: string;
  cabinClass: string;
  passengers: any;
}

export class SearchHistoryObject {
  origin: OriginResultModel;
  destination: DestinationResultModel;
  originDate: NgbDate;
  destinationDate: NgbDate;
  tripType: string;
  cabinClass: string;
  passengers: any;
  constructor(data: HistorySearchModel) {
    this.origin = data.origin;
    this.destination = data.destination;
    this.originDate = data.originDate;
    this.destinationDate = data.destinationDate;
    this.tripType = data.tripType;
    this.cabinClass = data.cabinClass;
    this.passengers = data.passengers;
  }
}

export interface HistorySearchListModel extends Array<HistorySearchModel> {}
