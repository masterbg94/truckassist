import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppCompanySideNavComponent } from './app-company-side-nav.component';

describe('AppCompanySideNavComponent', () => {
  let component: AppCompanySideNavComponent;
  let fixture: ComponentFixture<AppCompanySideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppCompanySideNavComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCompanySideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
