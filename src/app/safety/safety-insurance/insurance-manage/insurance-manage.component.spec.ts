import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceManageComponent } from './insurance-manage.component';

describe('InsuranceManageComponent', () => {
  let component: InsuranceManageComponent;
  let fixture: ComponentFixture<InsuranceManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
