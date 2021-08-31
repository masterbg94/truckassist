import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMedicalManageComponent } from './driver-medical-manage.component';

describe('DriverMedicalManageComponent', () => {
  let component: DriverMedicalManageComponent;
  let fixture: ComponentFixture<DriverMedicalManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverMedicalManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverMedicalManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
