import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerLeasePurchaseManageComponent } from './trailer-lease-purchase-manage.component';

describe('TrailerLeasePurchaseManageComponent', () => {
  let component: TrailerLeasePurchaseManageComponent;
  let fixture: ComponentFixture<TrailerLeasePurchaseManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerLeasePurchaseManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerLeasePurchaseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
