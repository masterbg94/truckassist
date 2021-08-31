import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppTodoService } from 'src/app/core/services/app-todo.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from '../../services/notification-service.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { TodoNew } from '../../core/model/todo';
import { AppUserService } from '../../core/services/app-user.service';
import { Comments } from '../../core/model/comment';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { StorageService } from 'src/app/core/services/storage.service';
import { FILE_TABLES } from 'src/app/const';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-todo-manage',
  templateUrl: './todo-manage.component.html',
  styleUrls: ['./todo-manage.component.scss'],
})
export class TodoManageComponent implements OnInit, OnDestroy {
  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private shared: SharedService,
    private storageService: StorageService,
    private todoService: AppTodoService,
    private notification: NotificationService,
    private spinner: SpinnerService,
    private userService: AppUserService
  ) {
    this.createForm();
  }

  @ViewChild('note') note: ElementRef;
  @ViewChild('comment') comment: ElementRef;
  @ViewChild('link') link: ElementRef;
  @ViewChild('autoComplete') autoComplete;
  taskForm: FormGroup;
  textareaValue = '';
  minDate = new Date(+new Date() + 3600000);

  modalTitle = 'New task';

  @Input() inputData: any; // example { id: 5 }
  private destroy$: Subject<void> = new Subject<void>();
  resetDate = '0001-01-01T00:00';

  todoSwitchData = [
    {
      id: 'accounting',
      name: 'Accounting',
      checked: true,
    },
    {
      id: 'dispatch',
      name: 'Dispatch',
      checked: false,
    },
    {
      id: 'safety',
      name: 'Safety',
      checked: false,
    },
  ];

  public comments: Comments[] = [];
  showNote: boolean;
  showComments: boolean;
  showAttach: boolean;
  keyword = 'firstName';

  ddUsers: any;
  allUsers: any;
  selectedUserChip = [];
  commentControl = new FormControl();
  uId = JSON.parse(localStorage.getItem('currentUser')).id;
  updateCommentControl = new FormControl();
  toggledEditComment: any[] = [];
  addNewComment: boolean;
  loaded = false;

  attachments: any = [];
  files = [];
  todo: TodoNew;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  public openNote() {
    if (this.showNote === true) {
      this.showNote = false;
    } else {
      this.showNote = true;
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }

  createForm() {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      note: [''],
      deadLine: new FormControl(null),
      // team_members: [''],
      url: [''],
      category: ['Accounting'],
      status: -1,
      deadLineTime: [''],
      assignData: [null],
      description: ['']
    });
  }

  public openComments() {
    if (this.showComments === true) {
      this.showComments = false;
    } else {
      this.showComments = true;
      // setTimeout(() => {
      //   this.notes.nativeElement.focus();
      // }, 250);
    }
  }

  ngOnInit(): void {
    this.getUsers();

    if (this.inputData.data.type === 'edit') {
      this.getTaskById(this.inputData.data.id);
      this.modalTitle = 'Edit task';
    } else {
      this.loaded = true;
    }

    this.todoService.getSingleTodoCommentsList(this.inputData.data.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (response: any) => {
        this.comments = response;
        if (this.comments.length > 0) {
          this.showComments = true;
        }
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );

    this.shared.emitDeleteFiles
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (files: any) => {
        if (files.success) {
          const removedFile = files.success[0];
          this.todo.doc.attachments = this.todo.doc.attachments.filter((file: any) => file.fileItemGuid !== removedFile.guid);
          this.manageTask(true);
        }
      }
    );
  }

  setFiles(files: any) {
    this.files = files;
  }

  /**
   * Update Task / Add new Task
   */
  manageTask(keepModal: boolean) {
    this.spinner.show(true);
    const task = this.taskForm.getRawValue();
    const taskManage = {
      parentId: 0,
      assigneeId: 0,
      category: task.category,
      name: task.name,
      url: task.url,
      startDate: new Date(),
      deadLine: task.deadLineTime ? task.deadLineTime : task.deadLine,
      note: task.note,
      priority: 0,
      status: task.status,
      userId: 2,
      doc: {
        // tags: this.selectedUserChip.map((x) => (x = { name: x.firstName, id: x.id })),
        tags: this.taskForm.controls.assignData.value,
        attachments: this.inputData.data.type == 'new' ? [] : ((this.todo.doc.attachments !== null && this.todo.doc.attachments.length > 0) ? this.todo.doc.attachments : []),
        description: task.description
      }
    };

    if (this.inputData.data.type === 'new') {
      this.todoService.createTodoTask(taskManage)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp1: any) => {
          this.notification.success('Task added successfully.', 'Success:');
          const newFiles = this.shared.getNewFiles(this.files);
          if (newFiles.length > 0) {
            this.storageService.uploadFiles(resp1.guid, FILE_TABLES.TODO, resp1.id, this.files)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (resp2: any) => {
                if (resp2.success.length > 0) {
                  resp2.success.forEach(element => {
                    taskManage.doc.attachments.push(element);
                  });
                  this.notification.success(`Attachments successfully uploaded.`, ' ');
                  this.todoService.updateTodo(resp1.id, taskManage)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe(
                    (resp3: any) => {
                      if (!keepModal) {
                        this.resetModalData();
                      }
                      this.spinner.show(false);
                      this.notification.success('Task updated successfully.', 'Success:');
                    },
                    (error: HttpErrorResponse) => {
                      this.shared.handleError(error);
                    }
                  );
                } else {
                  if (!keepModal) {
                    this.resetModalData();
                  }
                  this.spinner.show(false);
                }
              },
              (error: HttpErrorResponse) => {
                this.shared.handleError(error);
              }
            );
          } else {
            if (!keepModal) {
              this.resetModalData();
            }
            this.spinner.show(false);
          }
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
    } else if (this.inputData.data.type === 'edit') {
      const newFiles = this.shared.getNewFiles(this.files);
      if (newFiles.length > 0) {
        this.storageService.uploadFiles(this.todo.guid, FILE_TABLES.TODO, this.todo.id, this.files)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp2: any) => {
            if (resp2.success.length > 0) {
              resp2.success.forEach(element => {
                taskManage.doc.attachments.push(element);
              });
              this.notification.success(`Attachments successfully uploaded.`, ' ');
              this.todoService.updateTodo(this.todo.id, taskManage)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (resp3: any) => {
                  if (!keepModal) {
                    this.resetModalData();
                  }
                  this.spinner.show(false);
                  this.notification.success('Task updated successfully.', 'Success:');
                },
                (error: HttpErrorResponse) => {
                  this.shared.handleError(error);
                }
              );
            } else {
              if (!keepModal) {
                this.resetModalData();
              }
              this.spinner.show(false);
            }
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
      } else {
        this.todoService.updateTodo(this.inputData.data.id, taskManage)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp: any) => {
            this.notification.success('Task updated successfully.', 'Success:');
            if (!keepModal) {
              this.resetModalData();
            }
            this.spinner.show(false);
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
      }
    }
  }

  resetModalData() {
    this.activeModal.close();
    this.todoService.emitTodo.emit(true);
  }

  /**
   * Update task on ENTER key
   */
  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.manageTask(false);
    }
  }

  /**
   * Close Active Modal
   */
  closeTodoEdit() {
    // closing active modal
    this.activeModal.close();
  }

  categorySwitch(data: any) {
    const categoryName = data.find((x) => x.checked === true).name;
    console.log(categoryName);
    this.taskForm.controls.category.setValue(categoryName);
  }

  setTodoForm(formData) {
    this.taskForm.patchValue({
      // parentId: formData.parentId,
      name: formData.name,
      category: formData.category,
      // assigneeId: 0,
      url: formData.url,
      // startDate: formData.startDate,
      note: formData.note !== null ? formData.note.replace(/<\/?[^>]+(>|$)/g, '') : '',
      deadLine: new Date(formData.deadLine),
      // priority: formData.priority,
      status: formData.status,
      deadLineTime: new Date(formData.deadLine),
      description: formData.doc.description || ''
    });
    this.attachments = (formData.doc && formData.doc.attachments) ? formData.doc.attachments : [];
    if (formData?.doc?.tags?.length > 0) {
      this.taskForm.controls.assignData.setValue(formData.doc.tags);
    } else {
      this.taskForm.controls.assignData.setValue('');
    }
    if (formData.note.length > 0) {
      this.showNote = true;
    }
    this.shared.touchFormFields(this.taskForm);
  }

  getTaskById(id) {
    this.todoService.getTaskById(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: TodoNew) => {
        this.setTodoForm(resp);
        this.loaded = true;
        this.todo = resp;
        this.todoSwitchData.map((x) => (x.checked = false));
        const a = this.todoSwitchData.find((x) => x.name === resp.category);
        a.checked = true;
        // if (resp?.doc?.tags) {
        //   setTimeout(() => {
        //     this.setTags(resp.doc.tags);
        //   });
        // }
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  getUsers() {
    this.userService.getUsersList()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.ddUsers = resp;
        this.allUsers = resp;
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  focus(e: any, arrow: HTMLElement) {
    e.stopPropagation();
    if (arrow.classList.contains('focused') && this.autoComplete.isOpen) {
      this.autoComplete.close();
      arrow.classList.remove('focused');
    } else {
      this.autoComplete.open();
      arrow.classList.add('focused');
    }

    this.autoComplete.filteredList = this.ddUsers;
  }

  createComment() {
    const comment = {
      parentId: 0,
      entityId: this.inputData.data.id,
      commentText: this.commentControl.value,
    };
    this.todoService.createComment(comment)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        this.notification.success('Comment added successfully.', 'Success:');
        this.spinner.show(false);
        this.comments.push(res);
        // this.activeModal.close();
        // this.todoService.emitTodo.emit(true);
        this.addNewComment = false;
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  deletePresed() {
    this.taskForm.get('deadLineTime').setValue(null);
    this.taskForm.get('deadLine').setValue(this.resetDate);
  }

  returnUserId(x) {
    return x.userId === this.uId;
  }

  toggleEditComment(index) {
    this.toggledEditComment[index] = !this.toggledEditComment[index];
  }

  updateComment(comment, index) {
    const commentData = {
      parentId: 0,
      entityId: this.inputData.data.id,
      commentText: this.updateCommentControl.value
    };
    this.todoService.updateComment(comment.id, commentData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        this.notification.success('Comment update successfully.', 'Success:');
        // this.todoService.emitTodo.emit(true);
        this.toggledEditComment[index] = false;
      },
      (error) => {
        this.shared.handleServerError();
      }
    );
    this.toggleEditComment(index);
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

  toggleCreateComment() {
    this.addNewComment = !this.addNewComment;
    setTimeout(() => {
      if (this.addNewComment) {
        this.comment.nativeElement.focus();
      }
    });
  }

  datepickerValueChange(event) {
    this.taskForm.get('deadLineTime').setValue(event);
  }

  returnUserForComment(comment) {
    if (this.allUsers) {
      return this.allUsers.find(x => x.id === comment.userId);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
