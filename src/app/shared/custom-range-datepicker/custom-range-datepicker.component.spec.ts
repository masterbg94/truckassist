import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRangeDatepickerComponent } from './custom-range-datepicker.component';

describe('CustomRangeDatepickerComponent', () => {
  let component: CustomRangeDatepickerComponent;
  let fixture: ComponentFixture<CustomRangeDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRangeDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRangeDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
