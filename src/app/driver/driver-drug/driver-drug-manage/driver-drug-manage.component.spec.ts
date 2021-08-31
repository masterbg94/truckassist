import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDrugManageComponent } from './driver-drug-manage.component';

describe('DriverDrugManageComponent', () => {
  let component: DriverDrugManageComponent;
  let fixture: ComponentFixture<DriverDrugManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverDrugManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDrugManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
