import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290ReviewComponent } from './tax2290-review.component';

describe('Tax2290ReviewComponent', () => {
  let component: Tax2290ReviewComponent;
  let fixture: ComponentFixture<Tax2290ReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290ReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
