import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckTableComponent } from '../truck-table/truck-table.component';

describe('TruckTableNewComponent', () => {
  let component: TruckTableComponent;
  let fixture: ComponentFixture<TruckTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
