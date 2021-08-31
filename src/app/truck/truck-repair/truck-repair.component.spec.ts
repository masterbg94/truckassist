import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckRepairComponent } from './truck-repair.component';

describe('TruckRepairComponent', () => {
  let component: TruckRepairComponent;
  let fixture: ComponentFixture<TruckRepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckRepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
