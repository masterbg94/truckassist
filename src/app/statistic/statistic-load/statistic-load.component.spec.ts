import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticLoadComponent } from './statistic-load.component';

describe('StatisticLoadComponent', () => {
  let component: StatisticLoadComponent;
  let fixture: ComponentFixture<StatisticLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
