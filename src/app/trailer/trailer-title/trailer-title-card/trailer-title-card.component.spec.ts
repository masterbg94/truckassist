import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerTitleCardComponent } from './trailer-title-card.component';

describe('TrailerTitleCardComponent', () => {
  let component: TrailerTitleCardComponent;
  let fixture: ComponentFixture<TrailerTitleCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerTitleCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerTitleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
