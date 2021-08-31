import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredModalComponent } from './expired-modal.component';

describe('ExpiredModalComponent', () => {
  let component: ExpiredModalComponent;
  let fixture: ComponentFixture<ExpiredModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
