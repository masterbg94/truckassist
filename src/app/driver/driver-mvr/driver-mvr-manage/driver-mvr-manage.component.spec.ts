import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMvrManageComponent } from './driver-mvr-manage.component';

describe('DriverMvrManageComponent', () => {
  let component: DriverMvrManageComponent;
  let fixture: ComponentFixture<DriverMvrManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverMvrManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverMvrManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
