import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290VehiclesComponent } from './tax2290-vehicles.component';

describe('Tax2290VehiclesComponent', () => {
  let component: Tax2290VehiclesComponent;
  let fixture: ComponentFixture<Tax2290VehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290VehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290VehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
