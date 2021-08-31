import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerLicenseCardComponent } from './trailer-license-card.component';

describe('TrailerLicenseCardComponent', () => {
  let component: TrailerLicenseCardComponent;
  let fixture: ComponentFixture<TrailerLicenseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerLicenseCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerLicenseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
