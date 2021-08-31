import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsoldComponent } from './reportsold.component';

describe('ReportsoldComponent', () => {
  let component: ReportsoldComponent;
  let fixture: ComponentFixture<ReportsoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
