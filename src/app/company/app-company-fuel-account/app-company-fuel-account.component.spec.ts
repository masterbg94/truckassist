import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppCompanyFuelAccountComponent } from './app-company-fuel-account.component';

describe('AppCompanyFuelAccountComponent', () => {
  let component: AppCompanyFuelAccountComponent;
  let fixture: ComponentFixture<AppCompanyFuelAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppCompanyFuelAccountComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCompanyFuelAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
