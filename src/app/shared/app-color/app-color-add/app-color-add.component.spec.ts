import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppColorAddComponent } from './app-color-add.component';

describe('AppColorAddComponent', () => {
  let component: AppColorAddComponent;
  let fixture: ComponentFixture<AppColorAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppColorAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppColorAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
