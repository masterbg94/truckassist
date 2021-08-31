import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSwitcherComponent } from './driver-switcher.component';

describe('DriverSwitcherComponent', () => {
  let component: DriverSwitcherComponent;
  let fixture: ComponentFixture<DriverSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
