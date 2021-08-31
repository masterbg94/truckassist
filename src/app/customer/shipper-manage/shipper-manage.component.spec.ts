import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperManageComponent } from './shipper-manage.component';

describe('ShipperManageComponent', () => {
  let component: ShipperManageComponent;
  let fixture: ComponentFixture<ShipperManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipperManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipperManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
