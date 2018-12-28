import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-manage-your-booking',
  templateUrl: './manage-your-booking.component.html',
  styleUrls: ['./manage-your-booking.component.scss']
})
export class ManageYourBookingComponent implements OnInit, OnChanges {

  @Input() translations: any;
  
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    
  }

}
