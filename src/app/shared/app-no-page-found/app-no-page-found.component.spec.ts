import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNoPageFoundComponent } from './app-no-page-found.component';

describe('AppNoPageFoundComponent', () => {
  let component: AppNoPageFoundComponent;
  let fixture: ComponentFixture<AppNoPageFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppNoPageFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNoPageFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
