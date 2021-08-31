import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticGPSStatusComponent } from './statistic-gps-status.component';

describe('StatisticGPSStatusComponent', () => {
  let component: StatisticGPSStatusComponent;
  let fixture: ComponentFixture<StatisticGPSStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticGPSStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticGPSStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
