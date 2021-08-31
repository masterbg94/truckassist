import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollManageComponent } from './payroll-manage.component';

describe('PayrollManageComponent', () => {
  let component: PayrollManageComponent;
  let fixture: ComponentFixture<PayrollManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
