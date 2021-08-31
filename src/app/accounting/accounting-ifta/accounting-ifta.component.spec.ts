import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingIftaComponent } from './accounting-ifta.component';

describe('AccountingIftaComponent', () => {
  let component: AccountingIftaComponent;
  let fixture: ComponentFixture<AccountingIftaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingIftaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingIftaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
