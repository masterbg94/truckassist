import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEmptyComponent } from './app-empty.component';

describe('AppEmptyComponent', () => {
  let component: AppEmptyComponent;
  let fixture: ComponentFixture<AppEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppEmptyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
