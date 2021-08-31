import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoEmptyStatusComponent } from './no-empty-status.component';

describe('NoEmptyStatusComponent', () => {
  let component: NoEmptyStatusComponent;
  let fixture: ComponentFixture<NoEmptyStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoEmptyStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoEmptyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
