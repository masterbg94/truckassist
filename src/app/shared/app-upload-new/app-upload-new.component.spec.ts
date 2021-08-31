import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUploadNewComponent } from './app-upload-new.component';

describe('AppUploadNewComponent', () => {
  let component: AppUploadNewComponent;
  let fixture: ComponentFixture<AppUploadNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUploadNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUploadNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
