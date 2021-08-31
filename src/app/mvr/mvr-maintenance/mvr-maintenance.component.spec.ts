import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvrMaintenanceComponent } from './mvr-maintenance.component';

describe('MvrMaintenanceComponent', () => {
  let component: MvrMaintenanceComponent;
  let fixture: ComponentFixture<MvrMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvrMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvrMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
