import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationTooltipComponent } from './violation-tooltip.component';

describe('ViolationTooltipComponent', () => {
  let component: ViolationTooltipComponent;
  let fixture: ComponentFixture<ViolationTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolationTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
