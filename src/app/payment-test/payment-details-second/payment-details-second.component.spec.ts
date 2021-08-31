import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsSecondComponent } from './payment-details-second.component';

describe('PaymentDetailsSecondComponent', () => {
  let component: PaymentDetailsSecondComponent;
  let fixture: ComponentFixture<PaymentDetailsSecondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDetailsSecondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
