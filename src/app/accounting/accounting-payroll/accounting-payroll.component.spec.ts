import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingPayrollComponent } from './accounting-payroll.component';

describe('AccountingPayrollComponent', () => {
  let component: AccountingPayrollComponent;
  let fixture: ComponentFixture<AccountingPayrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingPayrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
