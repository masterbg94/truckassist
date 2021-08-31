import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortPopupComponent } from './sort-popup.component';

describe('SortPopupComponent', () => {
  let component: SortPopupComponent;
  let fixture: ComponentFixture<SortPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
