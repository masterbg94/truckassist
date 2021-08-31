import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentUnsuccesfulModalComponent } from './payment-unsuccesful-modal.component';

describe('PaymentUnsuccesfulModalComponent', () => {
  let component: PaymentUnsuccesfulModalComponent;
  let fixture: ComponentFixture<PaymentUnsuccesfulModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentUnsuccesfulModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentUnsuccesfulModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
