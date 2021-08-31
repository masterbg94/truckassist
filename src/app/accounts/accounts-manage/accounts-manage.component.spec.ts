import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountsManageComponent } from './accounts-manage.component';

describe('AccountsManageComponent', () => {
  let component: AccountsManageComponent;
  let fixture: ComponentFixture<AccountsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountsManageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
