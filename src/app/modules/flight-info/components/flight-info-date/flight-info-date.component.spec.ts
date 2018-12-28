import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightInfoDateComponent } from './flight-info-date.component';

describe('FlightInfoDateComponent', () => {
  let component: FlightInfoDateComponent;
  let fixture: ComponentFixture<FlightInfoDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightInfoDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightInfoDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
