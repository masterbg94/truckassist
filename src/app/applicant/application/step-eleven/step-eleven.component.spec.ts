import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepElevenComponent } from './step-eleven.component';

describe('StepElevenComponent', () => {
  let component: StepElevenComponent;
  let fixture: ComponentFixture<StepElevenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepElevenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepElevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
