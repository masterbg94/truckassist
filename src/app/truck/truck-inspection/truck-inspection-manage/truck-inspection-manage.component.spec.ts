import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckInspectionManageComponent } from './truck-inspection-manage.component';

describe('TruckInspectionManageComponent', () => {
  let component: TruckInspectionManageComponent;
  let fixture: ComponentFixture<TruckInspectionManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckInspectionManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckInspectionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
