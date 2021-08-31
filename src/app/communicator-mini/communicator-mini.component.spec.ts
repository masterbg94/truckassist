import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicatorMiniComponent } from './communicator-mini.component';

describe('CommunicatorMiniComponent', () => {
  let component: CommunicatorMiniComponent;
  let fixture: ComponentFixture<CommunicatorMiniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicatorMiniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicatorMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
