import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistDateFilterComponent } from './truckassist-date-filter.component';

describe('TruckassistDateFilterComponent', () => {
  let component: TruckassistDateFilterComponent;
  let fixture: ComponentFixture<TruckassistDateFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckassistDateFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
