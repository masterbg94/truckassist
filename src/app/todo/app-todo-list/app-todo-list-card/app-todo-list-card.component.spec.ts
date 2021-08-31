import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTodoListCardComponent } from './app-todo-list-card.component';

describe('AppTodoListCardComponent', () => {
  let component: AppTodoListCardComponent;
  let fixture: ComponentFixture<AppTodoListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTodoListCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTodoListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
