import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistCheckboxComponent } from './truckassist-checkbox.component';

describe('TruckassistCheckboxComponent', () => {
  let component: TruckassistCheckboxComponent;
  let fixture: ComponentFixture<TruckassistCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckassistCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
