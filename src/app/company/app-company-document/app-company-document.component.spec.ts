import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppCompanyDocumentComponent } from './app-company-document.component';

describe('AppCompanyDocumentComponent', () => {
  let component: AppCompanyDocumentComponent;
  let fixture: ComponentFixture<AppCompanyDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppCompanyDocumentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCompanyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
