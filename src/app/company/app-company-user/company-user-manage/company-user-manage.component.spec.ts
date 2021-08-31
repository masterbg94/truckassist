import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyUserManageComponent } from './company-user-manage.component';

describe('CompanyUserManageComponent', () => {
  let component: CompanyUserManageComponent;
  let fixture: ComponentFixture<CompanyUserManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyUserManageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUserManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
