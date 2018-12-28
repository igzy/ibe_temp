import { Component, OnInit, Input } from '@angular/core';
import { DatePickerService } from '../../../../core/services/datepicker.service';


@Component({
  selector: 'app-flight-info-date',
  templateUrl: './flight-info-date.component.html',
  styleUrls: ['./flight-info-date.component.scss']
})
export class FlightInfoDateComponent implements OnInit {
  @Input() dates;
  day = [];
  month = [];

  constructor(
    private datePickerService: DatePickerService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(){
    console.log(this.dates);
    this.setDay();
    this.setMonth();
    
  }

  setDay(){
    this.dates.forEach(date =>{
      console.log(date);
      let dateParts = date.split("/");
      let tempDay = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      console.log(tempDay.getDay());
      this.day.push(this.datePickerService.getWeekdayShortName(tempDay.getDay()+1));
    })
    console.log(this.day);
  }

  setMonth(){
    this.dates.forEach(date =>{
      console.log(date);
      let dateParts = date.split("/");
      let tempDay = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      console.log(tempDay.getDay());
      this.month.push(this.datePickerService.getMonthShortName(tempDay.getMonth()+1));
    })
  }

}
