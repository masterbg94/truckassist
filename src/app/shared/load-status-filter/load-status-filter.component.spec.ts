import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadStatusFilterComponent } from './load-status-filter.component';

describe('LoadStatusFilterComponent', () => {
  let component: LoadStatusFilterComponent;
  let fixture: ComponentFixture<LoadStatusFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadStatusFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadStatusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
