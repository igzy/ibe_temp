import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flight-info-content',
  templateUrl: './flight-info-content.component.html',
  styleUrls: ['./flight-info-content.component.scss']
})
export class FlightInfoContentComponent implements OnInit {
  @Input() infoContent: any;
  constructor() { }

  ngOnInit() {
  }

}
