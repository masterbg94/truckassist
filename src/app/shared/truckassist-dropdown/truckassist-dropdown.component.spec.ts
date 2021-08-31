import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistDropdownComponent } from './truckassist-dropdown.component';

describe('TruckassistDropdownComponent', () => {
  let component: TruckassistDropdownComponent;
  let fixture: ComponentFixture<TruckassistDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckassistDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
