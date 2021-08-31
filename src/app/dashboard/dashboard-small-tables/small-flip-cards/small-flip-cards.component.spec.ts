import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallFlipCardsComponent } from './small-flip-cards.component';

describe('SmallFlipCardsComponent', () => {
  let component: SmallFlipCardsComponent;
  let fixture: ComponentFixture<SmallFlipCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallFlipCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallFlipCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
