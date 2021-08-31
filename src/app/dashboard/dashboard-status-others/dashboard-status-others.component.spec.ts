import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatusOthersComponent } from './dashboard-status-others.component';

describe('DashboardStatusOthersComponent', () => {
  let component: DashboardStatusOthersComponent;
  let fixture: ComponentFixture<DashboardStatusOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardStatusOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardStatusOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
