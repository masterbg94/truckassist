import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationSummaryComponent } from './violation-summary.component';

describe('ViolationSummaryComponent', () => {
  let component: ViolationSummaryComponent;
  let fixture: ComponentFixture<ViolationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolationSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
