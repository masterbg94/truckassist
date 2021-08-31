import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingFuelComponent } from './accounting-fuel.component';

describe('AccountingFuelComponent', () => {
  let component: AccountingFuelComponent;
  let fixture: ComponentFixture<AccountingFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingFuelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
