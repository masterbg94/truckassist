import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticAccidentComponent } from './statistic-accident.component';

describe('StatisticAccidentComponent', () => {
  let component: StatisticAccidentComponent;
  let fixture: ComponentFixture<StatisticAccidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticAccidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
