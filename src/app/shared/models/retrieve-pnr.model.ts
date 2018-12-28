export interface RetrievePnrInputModel {
    'locator': string;
    'surname': string;
}

export interface RetrievePnrResponseModel {
    status: string;
    errors: error[];
}

export interface error {
    code: string;
    type: string;
    desc: string;
    fieldErrors: fieldError[];
}

export interface fieldError {
    resource: any;
    field: any;
    rejectedValue: any;
    code: any;
    message: any;
}