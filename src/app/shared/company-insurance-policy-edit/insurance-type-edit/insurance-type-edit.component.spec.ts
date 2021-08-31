import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceTypeEditComponent } from './insurance-type-edit.component';

describe('InsuranceTypeEditComponent', () => {
  let component: InsuranceTypeEditComponent;
  let fixture: ComponentFixture<InsuranceTypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
