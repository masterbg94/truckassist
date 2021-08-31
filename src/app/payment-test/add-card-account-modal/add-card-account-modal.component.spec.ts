import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardAccountModalComponent } from './add-card-account-modal.component';

describe('AddCardAccountModalComponent', () => {
  let component: AddCardAccountModalComponent;
  let fixture: ComponentFixture<AddCardAccountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCardAccountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCardAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
