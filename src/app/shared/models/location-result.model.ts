export class LocationResulModel {
  cityName: string;
  city: string;
  stateName?: string;
  state?: string;
  country: string;
  countryName: string;
}

export interface LocationOutputModel{
  cityName: string;
  code: string;
  countryName: string;
}
