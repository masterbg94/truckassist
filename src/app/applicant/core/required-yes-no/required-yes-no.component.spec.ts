import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredYesNoComponent } from './required-yes-no.component';

describe('RequiredYesNoComponent', () => {
  let component: RequiredYesNoComponent;
  let fixture: ComponentFixture<RequiredYesNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequiredYesNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredYesNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
