import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwelveFinalComponent } from './step-twelve-final.component';

describe('StepTwelveFinalComponent', () => {
  let component: StepTwelveFinalComponent;
  let fixture: ComponentFixture<StepTwelveFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepTwelveFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepTwelveFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
