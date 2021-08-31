import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationGroupFilterComponent } from './violation-group-filter.component';

describe('ViolationGroupFilterComponent', () => {
  let component: ViolationGroupFilterComponent;
  let fixture: ComponentFixture<ViolationGroupFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolationGroupFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationGroupFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
