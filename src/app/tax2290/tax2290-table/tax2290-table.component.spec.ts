import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290TableComponent } from './tax2290-table.component';

describe('Tax2290TableComponent', () => {
  let component: Tax2290TableComponent;
  let fixture: ComponentFixture<Tax2290TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290TableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
