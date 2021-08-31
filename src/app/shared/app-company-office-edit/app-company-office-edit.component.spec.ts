import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCompanyOfficeEditComponent } from './app-company-office-edit.component';

describe('AppCompanyOfficeEditComponent', () => {
  let component: AppCompanyOfficeEditComponent;
  let fixture: ComponentFixture<AppCompanyOfficeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCompanyOfficeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCompanyOfficeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
