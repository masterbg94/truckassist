import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistRadioButtonComponent } from './truckassist-radio-button.component';

describe('TruckassistRadioButtonComponent', () => {
  let component: TruckassistRadioButtonComponent;
  let fixture: ComponentFixture<TruckassistRadioButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckassistRadioButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
