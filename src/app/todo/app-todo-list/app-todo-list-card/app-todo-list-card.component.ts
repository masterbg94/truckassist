import { take, takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TodoManageComponent } from '../../todo-manage/todo-manage.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { AppTodoService } from '../../../core/services/app-todo.service';
import { NotificationService } from '../../../services/notification-service.service';
import { SpinnerService } from '../../../core/services/spinner.service';
import { Subject } from 'rxjs';
import { SharedService } from '../../../core/services/shared.service';
import { FormControl } from '@angular/forms';
import { todoExpandAnimation } from '../../../core/helpers/animations';
import moment from 'moment';
import { AppUserService } from '../../../core/services/app-user.service';

@Component({
  selector: 'app-app-todo-list-card',
  templateUrl: './app-todo-list-card.component.html',
  styleUrls: ['./app-todo-list-card.component.scss'],
  animations: [todoExpandAnimation]
})
export class AppTodoListCardComponent implements OnInit, AfterViewInit {
  @ViewChild('commentar') commentar: ElementRef;
  @ViewChild('todoCard') todoCard;
  @Input() todo: any;
  @Input() isDone: any;
  @Input() highlightingWords = [];
  @Input() index: number;
  @Input() toDoTasks: any;
  public isCollapse = true;
  public isUrlToggled = false;
  public isAttachmentToggled = false;
  todoTaskComments: any[] = [];
  collapsed: boolean;
  toggledEditComment: any[] = [];
  uId = JSON.parse(localStorage.getItem('currentUser')).id;
  updateCommentControl = new FormControl();
  newCommentControl = new FormControl();
  startDate = new Date();
  addNewComment: boolean;
  starting;
  allUsers;
  attachmentsVisible: any = [];
  private destroy$: Subject<void> = new Subject<void>();
  card = 'todo';

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-driver'
      }
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-item',
      type: 'driver',
      text: 'Are you sure you want to delete driver?'
    }
  };
  public todVisina: any;

  constructor(
    private customModalService: CustomModalService,
    private todoService: AppTodoService,
    private notification: NotificationService,
    private spinner: SpinnerService,
    private shared: SharedService,
    private userService: AppUserService
  ) {
  }

  ngOnInit(): void {
    this.starting = moment(this.todo?.createdAt).format('DD-MM-YYYY');
    this.getCommentsForTodo();
    this.getUsersForComments();

    this.todoService.closeTodoTogglers
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (response) => {
        if (response) {
          this.isAttachmentToggled = false;
          this.isCollapse = true;
          this.isUrlToggled = false;
        }
      }
    );

    this.toDoTasks.forEach((element, key) => {
      this.attachmentsVisible[key] = false;
    });
  }

  isCollapsed() {
    this.collapsed = !this.collapsed;
  }

  /**
   * @params Event
   * @description Adding new task
   */
  newTask(event: any) {
    const data = {
      type: 'new',
      id: null
    };
    this.customModalService.openModal(TodoManageComponent, { data });
  }

  editTask(id: number) {
    const data = {
      type: 'edit',
      id
    };
    this.customModalService.openModal(TodoManageComponent, { data });
  }

  deleteTask(id: number) {
    // on delete
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  deleteTaskItem(x) {
    this.todoService.deleteTaskItem(x)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        this.notification.success('Task deleted successfully.', 'Success:');
        this.spinner.show(false);
        this.todoService.emitTodo.emit(true);
      },
      (error: any) => {
        this.notification.error('Something went wrong. Please try again.', 'Error:');
        this.spinner.show(false);
      }
    );
  }

  public editModal(id) {
    const data = {
      type: 'edit',
      id
    };
    this.customModalService.openModal(TodoManageComponent, { data }, null, { size: 'small' });
  }

  toggleUrl() {
    this.isUrlToggled = !this.isUrlToggled;
  }

  toggleAttachment() {
    this.isAttachmentToggled = !this.isAttachmentToggled;
  }

  getCommentsForTodo() {
    this.todoService.getSingleTodoCommentsList(this.todo?.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any[]) => {
        this.todoTaskComments = res;
      },
      (error) => {
        this.shared.handleServerError();
      }
    );
  }

  returnUid(x) {
    return x.userId === this.uId;
  }

  toggleEditComment(index) {
    this.toggledEditComment[index] = !this.toggledEditComment[index];
  }

  updateComment(comment) {
    const commentData = {
      parentId: 0,
      entityId: this.todo.id,
      commentText: this.updateCommentControl.value
    };
    this.todoService.updateComment(comment.id, commentData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        this.notification.success('Comment update successfully.', 'Success:');
        const commentIndex = this.todoTaskComments.findIndex(x => x.id === comment.id);
        this.todoTaskComments[commentIndex] = res;
        this.toggleEditComment(commentIndex);
        // this.todoService.emitTodo.emit(true);
      },
      (error) => {
        this.shared.handleServerError();
      }
    );
  }

  deleteComment(id) {
    this.todoService.deleteComment(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        this.notification.success('Comment deleted successfully.', 'Success:');
        this.todoService.emitTodo.emit(true);
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  createComment() {
    const commentData = {
      parentId: 0,
      entityId: this.todo.id,
      commentText: this.newCommentControl.value
    };
    this.todoService.createComment(commentData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        this.notification.success('Comment created successfully.', 'Success:');
        this.newCommentControl.reset();
        this.todoTaskComments.push(res);
        this.addNewComment = false;
        // this.todoService.emitTodo.emit(true);
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  createCommentToggle() {
    this.addNewComment = !this.addNewComment;
    setTimeout(() => {
      if (this.addNewComment) {
        this.commentar.nativeElement.focus();
      }
    });
  }

  public openAction(data: any): void {
    if (data.type === 'edit-driver') {
      this.editModal(data.id);
    } else if (data.type === 'delete-item') {
      this.deleteTaskItem(data.id);
    }
  }

  getUsersForComments() {
    this.userService.getUsersList()
    .pipe(take(1))
    .subscribe(
      (response: any) => {
        this.allUsers = response;
      }
    );
  }

  returnUserForComment(comment) {
    return this.allUsers.find( x => x.id === comment.userId);
  }

  ngAfterViewInit(): void {
    this.todVisina = this.todoCard?.nativeElement?.clientHeight;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
