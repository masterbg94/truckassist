import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticMilesComponent } from './statistic-miles.component';

describe('StatisticMilesComponent', () => {
  let component: StatisticMilesComponent;
  let fixture: ComponentFixture<StatisticMilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticMilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticMilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
