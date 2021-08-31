import { AppLoadService } from 'src/app/core/services/app-load.service';
import { SharedService } from './../../core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-app-comments',
  templateUrl: './app-comments.component.html',
  styleUrls: ['./app-comments.component.scss'],
})
export class AppCommentsComponent implements OnInit {
  @Input() isExpanded: boolean;
  @Input() truckLoadId: any;
  @Input() showNewMessageOnStart: any;
  todoTaskComments: any = [];
  constructor(
              private commentService: AppLoadService,
              private notification: NotificationService,
              private shared: SharedService,
            ) { }

  uId = JSON.parse(localStorage.getItem('currentUser')).id;
  uAvatar = JSON.parse(localStorage.getItem('currentUser')).doc.avatar.src;

  toggledEditComment: any[] = [];
  updateCommentControl = new FormControl();
  startNewMessage = false;
  newDate: any = new Date();
  ngOnInit(): void {
    this.refreshCommentList();
  }

  toggleEditComment(id, index) {
    this.toggledEditComment[index] = !this.toggledEditComment[index];
  }

  removeNewMessageAdding() {
    if ( this.startNewMessage ) {
      this.todoTaskComments.splice(0, 1);
      this.startNewMessage = false;
    }
  }

  addNewComment(indx) {
    if (!this.updateCommentControl.value) { return; }
    const commentData = {
      commentText: this.updateCommentControl.value,
      entityId: this.truckLoadId,
      // entityName: 'Todo',
      parentId: 0,
      userId: this.uId,
    };

    this.todoTaskComments[indx].new_comment = undefined;
    this.startNewMessage = false;

    this.commentService.createLoadComment(commentData).subscribe(
      (res: any) => {
        this.notification.success('Comment added successfully.', 'Success:');
        this.updateCommentControl.reset('');
        this.refreshCommentList();
      },
      (error: any) => {
        this.shared.handleServerError();
      });
  }
  startNewMessages() {
    if ( this.startNewMessage ) { return; }
    this.startNewMessage = true;
    this.todoTaskComments.unshift(
      {
        commentText: '',
        createdAt: this.newDate,
        new_comment: true,
        userAvatar: this.uAvatar
      }
    );
  }

  public get todoTaskCommentsLength() {
    return this.todoTaskComments.filter(item => !item.new_comment).length;
  }

  refreshCommentList() {
    if ( !this.truckLoadId ) { return; }
    this.commentService.getLoadComments(this.truckLoadId).subscribe((res: any[]) => {
      this.todoTaskComments = res.reverse();
      if( this.showNewMessageOnStart && !this.todoTaskComments[0]?.new_comment ){
        this.startNewMessages();
      }
    });
  }

  updateComment(comment, indx) {
    const commentData = {
      commentText: this.updateCommentControl.value,
      entityId: this.truckLoadId,
      // entityName: 'Todo',
      parentId: 0,
      userId: this.uId,
    };
    this.todoTaskComments[indx].commentText = this.updateCommentControl.value;
    this.commentService.updateLoadComment(comment.id, commentData).subscribe(
      (res: any) => {
        this.toggleEditComment(1, indx);
        this.notification.success('Comment update successfully.', 'Success:');
        this.refreshCommentList();
      },
      (error) => {
        this.shared.handleServerError();
      }
    );
  }

  returnUid(x) {
    return x.userId === this.uId;
  }

  deleteComment(id, indx) {
    this.todoTaskComments.splice(indx, 1);
    this.commentService.deleteLoadComment(id).subscribe(
      (res: any) => {
        this.notification.success('Comment deleted successfully.', 'Success:');
        this.refreshCommentList();
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

}
