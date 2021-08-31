import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290VehiclesAttachmentsComponent } from './tax2290-vehicles-attachments.component';

describe('Tax2290VehiclesAttachmentsComponent', () => {
  let component: Tax2290VehiclesAttachmentsComponent;
  let fixture: ComponentFixture<Tax2290VehiclesAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290VehiclesAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290VehiclesAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
