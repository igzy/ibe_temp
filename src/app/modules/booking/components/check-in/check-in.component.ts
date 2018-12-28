import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CheckInService } from '../../../../core/services/check-in.service';
import { MobileService } from '../../../../core/services/mobile.service';
import { Subscription } from 'rxjs';
import { CheckinBookingNumberRequest } from '../../../../shared/models/checkin-request.model';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit, OnChanges, OnDestroy {

  tabHeaders = [];
  activeTab: string;
  activeTabIndex = 0;

  @Input() translations;
  checkinBookingOnlineForm: FormGroup;
  checkinTicketForm: FormGroup;

  isMobile = false;

  allSubs: Subscription[] = [];

  constructor(private checkinService: CheckInService, private mobileService: MobileService) { }

  ngOnInit() {
    this.checkinBookingOnlineForm = new FormGroup({
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
    this.checkinTicketForm = new FormGroup({
      'ticketNumber': new FormControl(null, Validators.required),
    });
    this.fetchFromTranslation();
    if (this.tabHeaders) {
      this.activeTab = this.tabHeaders[0];
    }
    const mobileSubscription = this.mobileService.getIsMobile().subscribe(value => (this.isMobile = value));
    this.allSubs.push(mobileSubscription);
  }

  ngOnDestroy() {
    for (const sub of this.allSubs) {
      sub.unsubscribe();
    }
  }

  changeTab(val: string) {
    this.activeTab = val;
    this.activeTabIndex = this.tabHeaders.indexOf(val);
    if (this.activeTabIndex === -1) {
      this.activeTabIndex = 0;
    }
    if (this.activeTabIndex === 1) {
      this.checkinBookingOnlineForm.get('lastName').setValue(undefined);
      this.checkinBookingOnlineForm.get('lastName').markAsUntouched();
      this.checkinBookingOnlineForm.get('lastName').updateValueAndValidity();
      this.checkinBookingOnlineForm.get('bookingNumber').setValue(undefined);
      this.checkinBookingOnlineForm.get('bookingNumber').markAsUntouched();
      this.checkinBookingOnlineForm.get('bookingNumber').updateValueAndValidity();
    } else {
      this.checkinTicketForm.get('ticketNumber').setValue(undefined);
      this.checkinTicketForm.get('ticketNumber').markAsUntouched();
      this.checkinTicketForm.get('ticketNumber').updateValueAndValidity();
    }
  }

  alphaNumericOnly(event) {
    const k = event.charCode;
    return ((k >= 48 && k <= 57) || (k >= 65 && k <= 90) || (k >= 97 && k <= 122));
  }

  validateLastName(event) {
    const k = event.charCode;
    return k < 48 || k > 57;
  }

  ngOnChanges() {
    this.fetchFromTranslation();
    if (this.tabHeaders) {
      if (this.activeTabIndex === -1) {
        this.activeTabIndex = 0;
      }
      this.activeTab = this.tabHeaders[this.activeTabIndex];
    }
  }

  fetchFromTranslation() {
    if (this.translations) {
      this.tabHeaders = this.translations.BOOKING_APP.CHECK_IN.TAB_HEADERS;
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

  onCheckin() {
    if (this.activeTabIndex === 0) {
      this.checkinBookingNumber();
    } else {
      this.checkinTicketNumber();
    }
  }

  checkinBookingNumber() {
    if (this.checkinBookingOnlineForm.valid) {
      const params = new CheckinBookingNumberRequest(this.checkinBookingOnlineForm.value, this.isMobile);

        this.checkinService.sendRequest(params).subscribe(
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
      this.validateAllFormFields(this.checkinBookingOnlineForm);
    }
  }

  checkinTicketNumber() {
    if (this.checkinTicketForm.valid) {
      // let params = {
      //   'ticketNumber': this.checkinTicketForm.value.ticketNumber,
      // }
      // this.checkinService.sendRequest(params).subscribe(
      //   (response: any) => {
      //     if(response.status == "302"){
      //       window.location.href = response.data.url+'?'+ response.data.body;
      //     }
      //   },
      //   error => {
      //     if(error.status === 404){
      //       console.log('error request', error);
      //     }
      //   },
      // )
    } else {
      this.validateAllFormFields(this.checkinTicketForm);
    }
  }

}
