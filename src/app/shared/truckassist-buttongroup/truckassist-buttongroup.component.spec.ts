import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistButtongroupComponent } from './truckassist-buttongroup.component';

describe('TruckassistButtongroupComponent', () => {
  let component: TruckassistButtongroupComponent;
  let fixture: ComponentFixture<TruckassistButtongroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckassistButtongroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckassistButtongroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
