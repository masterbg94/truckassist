import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentMapListComponent } from './accident-map-list.component';

describe('AccidentMapListComponent', () => {
  let component: AccidentMapListComponent;
  let fixture: ComponentFixture<AccidentMapListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentMapListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentMapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
