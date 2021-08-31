import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckLicenseCardComponent } from './truck-license-card.component';

describe('TruckLicenseCardComponent', () => {
  let component: TruckLicenseCardComponent;
  let fixture: ComponentFixture<TruckLicenseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckLicenseCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckLicenseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
