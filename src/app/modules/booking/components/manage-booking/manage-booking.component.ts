import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MmbService } from '../../../../core/services/mmb.service';
import { MobileService } from '../../../../core/services/mobile.service';
import { Subscription } from 'rxjs';
import { ManageBookingRequest } from '../../../../shared/models/manage-booking-request.model';

@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss']
})
export class ManageBookingComponent implements OnInit, OnChanges, OnDestroy {

  bookingSearchForm: FormGroup;

  hasError: boolean;
  errorMessage: string;
  isMobile = false;

  allSubs: Subscription[] = [];

  @Input() translations;

  constructor(private mmbSevice: MmbService, private mobileService: MobileService) { }

  ngOnInit() {
    this.bookingSearchForm = new FormGroup({
      'lastName': new FormControl (null, Validators.compose([
        Validators.required,
        Validators.pattern('^([a-zA-Z\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF\\s`-])+$') // English and non english
      ])),
      'bookingNumber': new FormControl(null, Validators.compose([
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern('^[a-zA-Z0-9]*'),
        Validators.required
      ]))
    });

    const mobileSubscription = this.mobileService.getIsMobile().subscribe(value => (this.isMobile = value));
    this.allSubs.push(mobileSubscription);
  }

  ngOnDestroy() {
    for (const sub of this.allSubs) {
      sub.unsubscribe();
    }
  }

  onSubmit() {
    if (this.bookingSearchForm.valid) {
      const params  = new ManageBookingRequest(this.bookingSearchForm.value, this.isMobile);
      this.mmbSevice.sendRequest(params).subscribe(
        (response: any) => {
          if (response.status === '302') {
            window.location.href = response.data.url + '?' + response.data.body;
          }
        },
        error => {
          if (error.status === 404) {
            console.log('error request', error);
          }
        },
      );
    } else {
      this.validateAllFormFields(this.bookingSearchForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  numericOnly(event) {
    const k = event.charCode;
    return ((k >= 48 && k <= 57) || (k >= 65 && k <= 90) || (k >= 97 && k <= 122));
  }

  alphaNumericOnly(event) {
    const k = event.charCode;
    return k < 48 || k > 57;
  }

  ngOnChanges() {
  }
}
