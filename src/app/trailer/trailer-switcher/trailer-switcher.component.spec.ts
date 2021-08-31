import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerSwitcherComponent } from './trailer-switcher.component';

describe('TrailerSwitcherComponent', () => {
  let component: TrailerSwitcherComponent;
  let fixture: ComponentFixture<TrailerSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
