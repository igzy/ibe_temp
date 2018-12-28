import { CheckInTripModule } from './check-in-trip.module';

describe('CheckInTripModule', () => {
  let checkInTripModule: CheckInTripModule;

  beforeEach(() => {
    checkInTripModule = new CheckInTripModule();
  });

  it('should create an instance', () => {
    expect(checkInTripModule).toBeTruthy();
  });
});
