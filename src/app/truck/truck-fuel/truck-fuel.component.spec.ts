import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckFuelComponent } from './truck-fuel.component';

describe('TruckFuelComponent', () => {
  let component: TruckFuelComponent;
  let fixture: ComponentFixture<TruckFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckFuelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
