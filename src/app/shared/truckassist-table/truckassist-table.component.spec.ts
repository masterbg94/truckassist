import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistTableComponent } from './truckassist-table.component';

describe('TruckassistTableComponent', () => {
  let component: TruckassistTableComponent;
  let fixture: ComponentFixture<TruckassistTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckassistTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
