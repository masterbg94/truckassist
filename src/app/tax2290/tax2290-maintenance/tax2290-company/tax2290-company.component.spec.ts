import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290CompanyComponent } from './tax2290-company.component';

describe('Tax2290CompanyComponent', () => {
  let component: Tax2290CompanyComponent;
  let fixture: ComponentFixture<Tax2290CompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290CompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290CompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
