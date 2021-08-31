import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290CompanyInfoComponent } from './tax2290-company-info.component';

describe('Tax2290CompanyInfoComponent', () => {
  let component: Tax2290CompanyInfoComponent;
  let fixture: ComponentFixture<Tax2290CompanyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290CompanyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290CompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
