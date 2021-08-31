import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckTitleManageComponent } from './truck-title-manage.component';

describe('TruckTitleManageComponent', () => {
  let component: TruckTitleManageComponent;
  let fixture: ComponentFixture<TruckTitleManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckTitleManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckTitleManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
