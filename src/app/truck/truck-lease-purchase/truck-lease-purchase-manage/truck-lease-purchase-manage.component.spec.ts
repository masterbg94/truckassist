import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckLeasePurchaseManageComponent } from './truck-lease-purchase-manage.component';

describe('TruckLeasePurchaseManageComponent', () => {
  let component: TruckLeasePurchaseManageComponent;
  let fixture: ComponentFixture<TruckLeasePurchaseManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckLeasePurchaseManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckLeasePurchaseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
