import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationMapComponent } from './violation-map.component';

describe('ViolationMapComponent', () => {
  let component: ViolationMapComponent;
  let fixture: ComponentFixture<ViolationMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolationMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
