import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInTripComponent } from './check-in-trip.component';

describe('CheckInTripComponent', () => {
  let component: CheckInTripComponent;
  let fixture: ComponentFixture<CheckInTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
