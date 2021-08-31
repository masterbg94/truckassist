import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverLicenseCardComponent } from './driver-license-card.component';

describe('DriverLicenseCardComponent', () => {
  let component: DriverLicenseCardComponent;
  let fixture: ComponentFixture<DriverLicenseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverLicenseCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverLicenseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
