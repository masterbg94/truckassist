import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMvrCardComponent } from './driver-mvr-card.component';

describe('DriverMvrCardComponent', () => {
  let component: DriverMvrCardComponent;
  let fixture: ComponentFixture<DriverMvrCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverMvrCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverMvrCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
