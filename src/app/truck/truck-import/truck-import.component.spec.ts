import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckImportComponent } from './truck-import.component';

describe('TruckImportComponent', () => {
  let component: TruckImportComponent;
  let fixture: ComponentFixture<TruckImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
