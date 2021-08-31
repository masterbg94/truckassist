import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsModalComponent } from './payment-details-modal.component';

describe('PaymentDetailsModalComponent', () => {
  let component: PaymentDetailsModalComponent;
  let fixture: ComponentFixture<PaymentDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
