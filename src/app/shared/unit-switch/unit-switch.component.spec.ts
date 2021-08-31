import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSwitchComponent } from './unit-switch.component';

describe('UnitSwitchComponent', () => {
  let component: UnitSwitchComponent;
  let fixture: ComponentFixture<UnitSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
