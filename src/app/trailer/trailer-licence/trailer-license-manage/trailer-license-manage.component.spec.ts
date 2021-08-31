import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerLicenseManageComponent } from './trailer-license-manage.component';

describe('TrailerLicenseManageComponent', () => {
  let component: TrailerLicenseManageComponent;
  let fixture: ComponentFixture<TrailerLicenseManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerLicenseManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerLicenseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
