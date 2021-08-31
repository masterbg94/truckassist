import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckTitleCardComponent } from './truck-title-card.component';

describe('TruckTitleCardComponent', () => {
  let component: TruckTitleCardComponent;
  let fixture: ComponentFixture<TruckTitleCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckTitleCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckTitleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
