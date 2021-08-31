import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckInspectionCardComponent } from './truck-inspection-card.component';

describe('TruckInspectionCardComponent', () => {
  let component: TruckInspectionCardComponent;
  let fixture: ComponentFixture<TruckInspectionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckInspectionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckInspectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
