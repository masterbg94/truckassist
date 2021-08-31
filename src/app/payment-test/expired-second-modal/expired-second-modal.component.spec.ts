import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredSecondModalComponent } from './expired-second-modal.component';

describe('ExpiredSecondModalComponent', () => {
  let component: ExpiredSecondModalComponent;
  let fixture: ComponentFixture<ExpiredSecondModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredSecondModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredSecondModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
