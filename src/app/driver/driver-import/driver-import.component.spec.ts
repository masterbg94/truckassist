import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverImportComponent } from './driver-import.component';

describe('DriverImportComponent', () => {
  let component: DriverImportComponent;
  let fixture: ComponentFixture<DriverImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
