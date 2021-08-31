import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticViolationComponent } from './statistic-violation.component';

describe('StatisticViolationComponent', () => {
  let component: StatisticViolationComponent;
  let fixture: ComponentFixture<StatisticViolationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticViolationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
