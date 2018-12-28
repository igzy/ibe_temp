import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightInfoContentComponent } from './flight-info-content.component';

describe('FlightInfoContentComponent', () => {
  let component: FlightInfoContentComponent;
  let fixture: ComponentFixture<FlightInfoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightInfoContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightInfoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
