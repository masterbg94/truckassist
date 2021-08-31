import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckLoadComponent } from './truck-load.component';

describe('TruckLoadComponent', () => {
  let component: TruckLoadComponent;
  let fixture: ComponentFixture<TruckLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
