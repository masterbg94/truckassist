import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerRepairComponent } from './trailer-repair.component';

describe('TrailerRepairComponent', () => {
  let component: TrailerRepairComponent;
  let fixture: ComponentFixture<TrailerRepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerRepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
