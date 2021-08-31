import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistActionStackComponent } from './truckassist-action-stack.component';

describe('TruckassistActionStackComponent', () => {
  let component: TruckassistActionStackComponent;
  let fixture: ComponentFixture<TruckassistActionStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckassistActionStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistActionStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
