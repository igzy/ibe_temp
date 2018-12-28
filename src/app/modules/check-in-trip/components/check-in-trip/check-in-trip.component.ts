import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-check-in-trip',
  templateUrl: './check-in-trip.component.html',
  styleUrls: ['./check-in-trip.component.scss']
})
export class CheckInTripComponent implements OnInit, OnChanges {

  @Input() translations: any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

}
