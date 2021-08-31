import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverLicenseManageComponent } from './driver-license-manage.component';

describe('DriverLicenseManageComponent', () => {
  let component: DriverLicenseManageComponent;
  let fixture: ComponentFixture<DriverLicenseManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverLicenseManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverLicenseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
