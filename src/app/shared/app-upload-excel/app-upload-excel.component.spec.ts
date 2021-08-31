import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUploadExcelComponent } from './app-upload-excel.component';

describe('AppUploadExcelComponent', () => {
  let component: AppUploadExcelComponent;
  let fixture: ComponentFixture<AppUploadExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUploadExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUploadExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
