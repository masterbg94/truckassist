import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTodoComponent } from './dashboard-todo.component';

describe('DashboardTodoComponent', () => {
  let component: DashboardTodoComponent;
  let fixture: ComponentFixture<DashboardTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
