import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCartComponent } from './medical-cart.component';

describe('MedicalCartComponent', () => {
  let component: MedicalCartComponent;
  let fixture: ComponentFixture<MedicalCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
