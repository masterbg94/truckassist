import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FilesUploadWrapperComponent } from './files-upload-wrapper.component';

describe('FilesUploadWrapperComponent', () => {
  let component: FilesUploadWrapperComponent;
  let fixture: ComponentFixture<FilesUploadWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilesUploadWrapperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesUploadWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
