import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSmallTablesComponent } from './dashboard-small-tables.component';

describe('DashboardSmallTablesComponent', () => {
  let component: DashboardSmallTablesComponent;
  let fixture: ComponentFixture<DashboardSmallTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSmallTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSmallTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
