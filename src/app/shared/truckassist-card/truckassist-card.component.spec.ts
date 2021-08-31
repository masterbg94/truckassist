import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistCardComponent } from './truckassist-card.component';

describe('TruckassistCardComponent', () => {
  let component: TruckassistCardComponent;
  let fixture: ComponentFixture<TruckassistCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckassistCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
