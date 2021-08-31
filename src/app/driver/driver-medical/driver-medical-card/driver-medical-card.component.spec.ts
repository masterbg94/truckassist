import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMedicalCardComponent } from './driver-medical-card.component';

describe('DriverMedicalCardComponent', () => {
  let component: DriverMedicalCardComponent;
  let fixture: ComponentFixture<DriverMedicalCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverMedicalCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverMedicalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
