import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelManageComponent } from './fuel-manage.component';

describe('FuelManageComponent', () => {
  let component: FuelManageComponent;
  let fixture: ComponentFixture<FuelManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
