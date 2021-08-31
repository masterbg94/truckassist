import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290DetailsComponent } from './tax2290-details.component';

describe('Tax2290DetailsComponent', () => {
  let component: Tax2290DetailsComponent;
  let fixture: ComponentFixture<Tax2290DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290DetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
