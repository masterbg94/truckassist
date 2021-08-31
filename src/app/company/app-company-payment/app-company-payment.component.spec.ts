import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppCompanyPaymentComponent } from './app-company-payment.component';

describe('AppCompanyPaymentComponent', () => {
  let component: AppCompanyPaymentComponent;
  let fixture: ComponentFixture<AppCompanyPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppCompanyPaymentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCompanyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
