import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppCompanyInfoComponent } from './app-company-info.component';

describe('AppCompanyInfoComponent', () => {
  let component: AppCompanyInfoComponent;
  let fixture: ComponentFixture<AppCompanyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppCompanyInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
