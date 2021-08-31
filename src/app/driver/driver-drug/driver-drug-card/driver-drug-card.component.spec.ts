import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDrugCardComponent } from './driver-drug-card.component';

describe('DriverDrugCardComponent', () => {
  let component: DriverDrugCardComponent;
  let fixture: ComponentFixture<DriverDrugCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverDrugCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDrugCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
