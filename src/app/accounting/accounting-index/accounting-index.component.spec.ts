import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingIndexComponent } from './accounting-index.component';

describe('AccountingIndexComponent', () => {
  let component: AccountingIndexComponent;
  let fixture: ComponentFixture<AccountingIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
