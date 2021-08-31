import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290MaintenanceComponent } from './tax2290-maintenance.component';

describe('Tax2290MaintenanceComponent', () => {
  let component: Tax2290MaintenanceComponent;
  let fixture: ComponentFixture<Tax2290MaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290MaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290MaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
