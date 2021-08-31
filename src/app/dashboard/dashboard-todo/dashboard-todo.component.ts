import { takeUntil } from 'rxjs/operators';
import { AppTodoService } from 'src/app/core/services/app-todo.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-dashboard-todo',
  templateUrl: './dashboard-todo.component.html',
  styleUrls: ['./dashboard-todo.component.scss']
})
export class DashboardTodoComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  selectedTodoId = 2;
  allToDoTasks: any = {
    toDoTasks: [],
    inProgressTasks: [],
    doneTasks: [],
  };
  public todoList: any = [
    {
      id: 1,
      name: 'In Progress',
      item: 'inProgressTasks'
    },
    {
      id: 2,
      name: 'To-Do',
      item: 'toDoTasks'
    },
    {
      id: 2,
      name: 'Done',
      item: 'doneTasks'
    }
  ];

  public selectedTodoItem = 'toDoTasks';
  constructor(private todoService: AppTodoService) { }

  ngOnInit(): void {
    this.getTasks();
  }


  public selectTodos(event) {
    this.selectedTodoItem = event.item;
    this.selectedTodoId = event.id;
  }

  getTasks() {
      this.todoService.listTodoTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          this.allToDoTasks.toDoTasks = resp.filter(x => x.status === -1);
          this.allToDoTasks.inProgressTasks = resp.filter(x => x.status === 0);
          this.allToDoTasks.doneTasks = resp.filter(x => x.status === 1);
        }
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
