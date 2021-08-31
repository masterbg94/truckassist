import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderActivityComponent } from './header-activity.component';

describe('HeaderActivityComponent', () => {
  let component: HeaderActivityComponent;
  let fixture: ComponentFixture<HeaderActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
