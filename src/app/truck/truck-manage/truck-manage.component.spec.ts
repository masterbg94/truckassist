import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckManageComponent } from './truck-manage.component';

describe('TruckManageComponent', () => {
  let component: TruckManageComponent;
  let fixture: ComponentFixture<TruckManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
