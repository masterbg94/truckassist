import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyScheduledInsComponent } from './safety-scheduled-ins.component';

describe('SafetyScheduledInsComponent', () => {
  let component: SafetyScheduledInsComponent;
  let fixture: ComponentFixture<SafetyScheduledInsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyScheduledInsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyScheduledInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
