import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersBarComponent } from './letters-bar.component';

describe('LettersBarComponent', () => {
  let component: LettersBarComponent;
  let fixture: ComponentFixture<LettersBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LettersBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
