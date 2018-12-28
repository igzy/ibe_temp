import { ManageYourBookingModule } from './manage-your-booking.module';

describe('ManageYourBookingModule', () => {
  let manageYourBookingModule: ManageYourBookingModule;

  beforeEach(() => {
    manageYourBookingModule = new ManageYourBookingModule();
  });

  it('should create an instance', () => {
    expect(manageYourBookingModule).toBeTruthy();
  });
});
