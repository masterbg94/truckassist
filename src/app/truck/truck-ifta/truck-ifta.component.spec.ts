import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckIftaComponent } from './truck-ifta.component';

describe('TruckIftaComponent', () => {
  let component: TruckIftaComponent;
  let fixture: ComponentFixture<TruckIftaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckIftaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckIftaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
