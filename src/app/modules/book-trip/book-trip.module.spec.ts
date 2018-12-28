import { BookTripModule } from './book-trip.module';

describe('BookTripModule', () => {
  let bookTripModule: BookTripModule;

  beforeEach(() => {
    bookTripModule = new BookTripModule();
  });

  it('should create an instance', () => {
    expect(bookTripModule).toBeTruthy();
  });
});
