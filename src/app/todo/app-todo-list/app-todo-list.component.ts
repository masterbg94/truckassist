import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TodoManageComponent } from '../todo-manage/todo-manage.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AppTodoService } from 'src/app/core/services/app-todo.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SharedService } from '../../core/services/shared.service';
import { NotificationService } from '../../services/notification-service.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { AppCommentService } from '../../core/services/app-comment.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { todoExpandAnimation } from '../../core/helpers/animations';
import { SearchFilterEvent } from 'src/app/core/model/shared/searchFilter';
import { SearchDataService } from 'src/app/core/services/search-data.service';
import { AppTodoListCardComponent } from './app-todo-list-card/app-todo-list-card.component';

@Component({
  selector: 'app-app-todo-list',
  templateUrl: './app-todo-list.component.html',
  styleUrls: ['./app-todo-list.component.scss'],
  animations: [
    trigger('heightAnim', [
      state(
        'in',
        style({
          overflow: 'hidden',
          height: '156px',
        })
      ),
      state(
        'out',
        style({
          opacity: '0',
          overflow: 'hidden',
          height: '0',
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),

    trigger('enterIn', [
      transition(':enter', [
        style({ height: '0px' }),
        animate('250ms linear', style({ height: '156px' })),
      ]),
      transition(':leave', [animate('250ms linear', style({ height: '0' }))]),
    ]),
    todoExpandAnimation,
  ],
})
export class AppTodoListComponent implements OnInit, OnDestroy {
  @ViewChild('todoListCard') todoListCard: AppTodoListCardComponent;
  private destroy$: Subject<void> = new Subject<void>();
  public taskData: any[] = [];
  public toDoTasks: any[] = [];
  public inProgressTasks: any[] = [];
  public doneTasks: any[] = [];
  public disabledToDoIndexes = [];
  public disabledInProgressIndexes = [];
  public disabledDoneTasksIndexes = [];
  public index = 0;

  private dragableTodoId: number;
  private taskNewStatus: number;
  private dragableTodoAssigneeId: number;
  private dragableTodoName: any;
  updatedStatusData: { name: any; assigneeId: number; status: number };
  searchVisible = false;
  stateTransition: boolean;
  stateExit;
  stateEnter;
  dragStarted = false;

  /* Search */
  highlightingWords = [];
  searchToDoTasks: boolean;
  searchInProgressTasks: boolean;
  searchDoneTasks: boolean;

  constructor(
    private todoService: AppTodoService,
    private customModalService: CustomModalService,
    private shared: SharedService,
    private notification: NotificationService,
    private spinner: SpinnerService,
    private commentService: AppCommentService,
    private searchDateService: SearchDataService
  ) {}

  ngOnInit(): void {
    // this.taskData = this.todoService.getTestData();
    // this.toDoTasks = this.taskData[0].data;
    // this.inProgressTasks = this.taskData[1].data;
    // this.doneTasks = this.taskData[2].data;
    this.todoService.emitTodo
    .pipe(takeUntil(this.destroy$))
    .subscribe((response) => {
      if (response) {
        this.getTasks();
      }
    });

    this.toDoTasks.map((item, index) => {
      this.disabledToDoIndexes.push(index);
    });
    this.inProgressTasks.map((item, index) => {
      this.disabledInProgressIndexes.push(index);
    });
    this.doneTasks.map((item, index) => {
      this.disabledDoneTasksIndexes.push(index);
    });

    this.getTasks();
/*
    this.commentService.getAllComments()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        console.log(resp);
      },
      (error) => {
        this.shared.handleServerError();
      }
    );
*/

    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp: any) => {
      if (resp) {
        this.removeTodo(resp.data.id);
      }
    });
  }

  getTasks() {
    this.todoService.listTodoTasks()
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp: any) => {
      this.taskData = resp;
      console.log(resp);
      this.toDoTasks = resp.filter((x) => x.status === -1);
      this.inProgressTasks = resp.filter((x) => x.status === 0);
      this.doneTasks = resp.filter((x) => x.status === 1);
    });
  }

  /**
   * @params Event
   * @description Adding new task
   */
  newTask(event) {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(TodoManageComponent, { data }, null, { size: 'small' });
  }

  editTask(id: number) {
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(TodoManageComponent, { data });
  }

  /**
   * Show / Hide Comments
   */
  preventOpenComments(comments) {
    if (comments.length === 0) {
      event.preventDefault();
    }
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Reorder list items on drag/drop function
   *
   * @param event CdkDragDrop<string[]>
   * @param data Any
   */
  public reorderList(event: CdkDragDrop<string[]>, data: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (event.container.id === 'todo') {
        this.taskNewStatus = -1;
      } else if (event.container.id === 'progress') {
        this.taskNewStatus = 0;
      } else if (event.container.id === 'done') {
        this.taskNewStatus = 1;
      }
      this.updatedStatusData = {
        assigneeId: this.dragableTodoAssigneeId,
        name: this.dragableTodoName,
        status: this.taskNewStatus,
      };
      console.log(this.updatedStatusData);
      this.updateStatus(this.dragableTodoId, this.updatedStatusData);
    }
    this.dragStarted = false;
    console.log('this.dragStarted', this.dragStarted);
  }

  cdkDropListEntered(event) {
    // const elHeight =
    //   event.container.element.nativeElement.children[event.currentIndex].offsetHeight;
    // event.container.element.nativeElement.children[event.currentIndex].style.height = '0px';
    // for (let i = 0; i < elHeight; i = i + 2) {
    //   setTimeout(() => {
    //     const height = i + 'px';
    //     event.container.element.nativeElement.children[event.currentIndex].style.height = height;
    //   });
    // }
    if (this.stateExit !== event.container.id) {
      this.stateTransition = true;
    }
    console.log('Entered:', event.container.id);
    console.log('stateTransition:', this.stateTransition);
  }

  cdkDropListExited(event) {
    // if (event.container.element.nativeElement.children.length > 0) {
    //   let elHeight = 0;
    //   if (this.index === 0) {
    //     elHeight = event.container.element.nativeElement.children[0].offsetHeight;
    //   } else {
    //     elHeight = event.container.element.nativeElement.children[this.index - 1].offsetHeight;
    //   }
    //   const el = document.createElement('div');
    //   const targetDiv = event.container.element.nativeElement;
    //   el.style.height = elHeight + 'px';
    //   el.style.opacity = '0';
    //   if (this.index === 0) {
    //     targetDiv.prepend(el);
    //     for (let i = elHeight; i >= 0; i = i - 2) {
    //       setTimeout(() => {
    //         const height = i + 'px';
    //         el.style.height = height;
    //       });
    //     }
    //     setTimeout(() => {
    //       targetDiv.removeChild(el);
    //     });
    //   } else {
    //     targetDiv.children[this.index - 1].appendChild(el);
    //     for (let i = elHeight; i >= 0; i = i - 2) {
    //       setTimeout(() => {
    //         const height = i + 'px';
    //         el.style.height = height;
    //       });
    //     }
    //   }
    // }
    this.stateExit = event.container.id;
    this.stateTransition = false;
    console.log('Leaved:', event.container.id);
    console.log('stateTransition:', this.stateTransition);
  }

  cdkDropListSorted(event) {
    this.index = event.currentIndex;
  }

  cdkDragStarted(event, index, task) {
    this.todoService.closeTodoTogglers.emit(true);
    this.index = index;
    this.setDragableTodo(task);
    this.dragStarted = true;
    console.log('this.dragStarted', this.dragStarted);
  }

  setDragableTodo(task) {
    this.dragableTodoId = task.id;
    this.dragableTodoAssigneeId = task.assigneeId;
    this.dragableTodoName = task.name;
  }

  updateStatus(id, status) {
    this.spinner.show(false);
    this.todoService.updateTodo(id, status)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        // this.notification.success('Task status updated successfully.', 'Success:');
        this.spinner.show(false);
      },
      (error) => {
        this.shared.handleServerError();
      }
    );
  }

  removeTodo(x) {
    this.todoService.deleteTaskItem(x)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        this.notification.success('Task deleted successfully.', 'Success:');
        this.spinner.show(false);
        this.getTasks();
      },
      (error: any) => {
        this.notification.error('Something went wrong. Please try again.', 'Error:');
        this.spinner.show(false);
      }
    );
  }

  /* Search */
  onSearch(nameOfSearch: string) {
    this.searchToDoTasks = nameOfSearch === 'todo';
    this.searchInProgressTasks = nameOfSearch === 'in progress';
    this.searchDoneTasks = nameOfSearch === 'done';

    if (nameOfSearch === 'todo') {
      this.checkIfReset(this.searchToDoTasks);
    } else if (nameOfSearch === 'in progress') {
      this.checkIfReset(this.searchInProgressTasks);
    } else {
      this.checkIfReset(this.searchDoneTasks);
    }

    this.searchDateService.dataSource
    .pipe(takeUntil(this.destroy$))
    .subscribe((event: SearchFilterEvent) => {
      if (event && event.check) {
        this.highlightingWords =
          event.searchFilter && event.searchFilter.chipsFilter
            ? event.searchFilter.chipsFilter.words
            : [];
      }
    });
  }

  checkIfReset(reset: boolean) {
    if (reset) {
      this.highlightingWords = [];
    }
  }
}
