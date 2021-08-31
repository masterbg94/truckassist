import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckLicenseManageComponent } from './truck-license-manage.component';

describe('TruckLicenseManageComponent', () => {
  let component: TruckLicenseManageComponent;
  let fixture: ComponentFixture<TruckLicenseManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckLicenseManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckLicenseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
