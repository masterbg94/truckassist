import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBankAddComponent } from './app-bank-add.component';

describe('AppBankAddComponent', () => {
  let component: AppBankAddComponent;
  let fixture: ComponentFixture<AppBankAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppBankAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBankAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
