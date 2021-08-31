import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTenComponent } from './step-ten.component';

describe('StepTenComponent', () => {
  let component: StepTenComponent;
  let fixture: ComponentFixture<StepTenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepTenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepTenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
