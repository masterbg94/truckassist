import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290DetailsCardComponent } from './tax2290-details-card.component';

describe('Tax2290DetailsCardComponent', () => {
  let component: Tax2290DetailsCardComponent;
  let fixture: ComponentFixture<Tax2290DetailsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290DetailsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290DetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
