import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopManageComponent } from './repair-shop-manage.component';

describe('RepairShopManageComponent', () => {
  let component: RepairShopManageComponent;
  let fixture: ComponentFixture<RepairShopManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairShopManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairShopManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
