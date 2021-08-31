import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyViolationComponent } from './safety-violation.component';

describe('SafetyViolationComponent', () => {
  let component: SafetyViolationComponent;
  let fixture: ComponentFixture<SafetyViolationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyViolationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
