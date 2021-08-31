import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290IrsPaymentComponent } from './tax2290-irs-payment.component';

describe('Tax2290IrsPaymentComponent', () => {
  let component: Tax2290IrsPaymentComponent;
  let fixture: ComponentFixture<Tax2290IrsPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290IrsPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290IrsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
