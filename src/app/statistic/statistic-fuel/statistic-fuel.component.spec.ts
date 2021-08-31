import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticFuelComponent } from './statistic-fuel.component';

describe('StatisticFuelComponent', () => {
  let component: StatisticFuelComponent;
  let fixture: ComponentFixture<StatisticFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticFuelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
