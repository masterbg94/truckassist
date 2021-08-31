import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCompanyFactoringEditComponent } from './app-company-factoring-edit.component';

describe('AppCompanyFactoringEditComponent', () => {
  let component: AppCompanyFactoringEditComponent;
  let fixture: ComponentFixture<AppCompanyFactoringEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCompanyFactoringEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCompanyFactoringEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
