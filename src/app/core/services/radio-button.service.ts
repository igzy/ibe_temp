import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RadioButtonService {

    resetPaymentOption = new Subject;
    resetPaymentOption$ = this.resetPaymentOption.asObservable();

    selectPaymentOption = new Subject;
    selectPaymentOption$ = this.selectPaymentOption.asObservable();

    resetPaymentMethod() {
        this.resetPaymentOption.next(true);
    }

    setSelectedPaymentMethod(selectedPaymentMethod: string) {
        this.selectPaymentOption.next(selectedPaymentMethod);
    }
}
