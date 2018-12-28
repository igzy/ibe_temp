import { FlightInfoModule } from './flight-info.module';

describe('FlightInfoModule', () => {
  let flightInfoModule: FlightInfoModule;

  beforeEach(() => {
    flightInfoModule = new FlightInfoModule();
  });

  it('should create an instance', () => {
    expect(flightInfoModule).toBeTruthy();
  });
});
