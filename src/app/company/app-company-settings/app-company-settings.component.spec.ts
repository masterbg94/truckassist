import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppCompanySettingsComponent } from './app-company-settings.component';

describe('AppCompanySettingsComponent', () => {
  let component: AppCompanySettingsComponent;
  let fixture: ComponentFixture<AppCompanySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppCompanySettingsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCompanySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
