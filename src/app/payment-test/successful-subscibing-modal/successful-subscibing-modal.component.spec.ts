import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulSubscibingModalComponent } from './successful-subscibing-modal.component';

describe('SuccessfulSubscibingModalComponent', () => {
  let component: SuccessfulSubscibingModalComponent;
  let fixture: ComponentFixture<SuccessfulSubscibingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessfulSubscibingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfulSubscibingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
