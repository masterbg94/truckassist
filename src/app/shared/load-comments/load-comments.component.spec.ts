import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCommentsComponent } from './load-comments.component';

describe('LoadCommentsComponent', () => {
  let component: LoadCommentsComponent;
  let fixture: ComponentFixture<LoadCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
