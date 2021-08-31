import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCommentsComponent } from './app-comments.component';

describe('AppCommentsComponent', () => {
  let component: AppCommentsComponent;
  let fixture: ComponentFixture<AppCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
