import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLoadTableComponent } from './dashboard-load-table.component';

describe('DashboardLoadTableComponent', () => {
  let component: DashboardLoadTableComponent;
  let fixture: ComponentFixture<DashboardLoadTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardLoadTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLoadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
