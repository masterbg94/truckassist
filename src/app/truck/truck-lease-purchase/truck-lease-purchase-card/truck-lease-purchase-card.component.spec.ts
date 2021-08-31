import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckLeasePurchaseCardComponent } from './truck-lease-purchase-card.component';

describe('TruckLeasePurchaseCardComponent', () => {
  let component: TruckLeasePurchaseCardComponent;
  let fixture: ComponentFixture<TruckLeasePurchaseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckLeasePurchaseCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckLeasePurchaseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
