import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationMapListComponent } from './violation-map-list.component';

describe('ViolationMapListComponent', () => {
  let component: ViolationMapListComponent;
  let fixture: ComponentFixture<ViolationMapListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolationMapListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationMapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
