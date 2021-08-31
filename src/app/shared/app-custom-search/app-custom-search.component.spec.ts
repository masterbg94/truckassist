import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCustomSearchComponent } from './app-custom-search.component';

describe('AppCustomSearchComponent', () => {
  let component: AppCustomSearchComponent;
  let fixture: ComponentFixture<AppCustomSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCustomSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCustomSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
