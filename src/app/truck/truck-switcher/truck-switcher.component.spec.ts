import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckSwitcherComponent } from './truck-switcher.component';

describe('TruckSwitcherComponent', () => {
  let component: TruckSwitcherComponent;
  let fixture: ComponentFixture<TruckSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
