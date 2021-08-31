import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationSummaryFilterGroupComponent } from './violation-summary-filter-group.component';

describe('ViolationSummaryFilterGroupComponent', () => {
  let component: ViolationSummaryFilterGroupComponent;
  let fixture: ComponentFixture<ViolationSummaryFilterGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolationSummaryFilterGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationSummaryFilterGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
