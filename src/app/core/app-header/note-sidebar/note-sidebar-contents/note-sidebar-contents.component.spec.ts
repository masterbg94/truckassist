import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSidebarContentsComponent } from './note-sidebar-contents.component';

describe('NoteSidebarContentsComponent', () => {
  let component: NoteSidebarContentsComponent;
  let fixture: ComponentFixture<NoteSidebarContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteSidebarContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteSidebarContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
