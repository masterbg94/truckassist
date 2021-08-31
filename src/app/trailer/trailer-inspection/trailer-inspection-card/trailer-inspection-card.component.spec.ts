import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerInspectionCardComponent } from './trailer-inspection-card.component';

describe('TrailerInspectionCardComponent', () => {
  let component: TrailerInspectionCardComponent;
  let fixture: ComponentFixture<TrailerInspectionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerInspectionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerInspectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
