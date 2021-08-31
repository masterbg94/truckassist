import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyAccidentComponent } from './safety-accident.component';

describe('SafetyAccidentComponent', () => {
  let component: SafetyAccidentComponent;
  let fixture: ComponentFixture<SafetyAccidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyAccidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
