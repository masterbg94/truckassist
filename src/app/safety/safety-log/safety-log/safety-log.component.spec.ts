import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyLogComponent } from './safety-log.component';

describe('SafetyLogComponent', () => {
  let component: SafetyLogComponent;
  let fixture: ComponentFixture<SafetyLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
