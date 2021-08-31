import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomWysiwygEditorComponent } from './custom-wysiwyg-editor.component';

describe('CustomWysiwygEditorComponent', () => {
  let component: CustomWysiwygEditorComponent;
  let fixture: ComponentFixture<CustomWysiwygEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomWysiwygEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomWysiwygEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
