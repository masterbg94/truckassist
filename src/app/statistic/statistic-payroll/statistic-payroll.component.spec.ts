import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticPayrollComponent } from './statistic-payroll.component';

describe('StatisticPayrollComponent', () => {
  let component: StatisticPayrollComponent;
  let fixture: ComponentFixture<StatisticPayrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticPayrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
