import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerLeasePurchaseCardComponent } from './trailer-lease-purchase-card.component';

describe('TrailerLeasePurchaseCardComponent', () => {
  let component: TrailerLeasePurchaseCardComponent;
  let fixture: ComponentFixture<TrailerLeasePurchaseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerLeasePurchaseCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerLeasePurchaseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
