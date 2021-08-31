import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticInvoiceAgeingComponent } from './statistic-invoice-ageing.component';

describe('StatisticInvoiceAgeingComponent', () => {
  let component: StatisticInvoiceAgeingComponent;
  let fixture: ComponentFixture<StatisticInvoiceAgeingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticInvoiceAgeingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticInvoiceAgeingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
