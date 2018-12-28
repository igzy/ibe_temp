import { FieldErrorModel } from './field-error.model';

export interface ResponseErrorModel {
    code: string;
    type: string;
    desc: string;
    fieldErrors: FieldErrorModel[];
}
