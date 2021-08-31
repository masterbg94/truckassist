import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistHistoryDataComponent } from './truckassist-history-data.component';

describe('TruckassistHistoryDataComponent', () => {
  let component: TruckassistHistoryDataComponent;
  let fixture: ComponentFixture<TruckassistHistoryDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckassistHistoryDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistHistoryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
