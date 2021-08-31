import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFaliModalComponent } from './payment-fali-modal.component';

describe('PaymentFaliModalComponent', () => {
  let component: PaymentFaliModalComponent;
  let fixture: ComponentFixture<PaymentFaliModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentFaliModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFaliModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
