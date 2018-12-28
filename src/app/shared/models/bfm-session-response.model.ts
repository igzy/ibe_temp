import { ResponseErrorModel } from './response-error.model';

export interface BfmSessionResponseModel {
    id: string;
    status: string;
    token: string;
    timeBackend: any;
    timeService: any;
    errors: ResponseErrorModel[];
}
