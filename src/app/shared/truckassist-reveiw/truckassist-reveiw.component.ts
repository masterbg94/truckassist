import { takeUntil } from 'rxjs/operators';
import { UserProfileDoc } from './../../core/model/user-profile';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject } from 'rxjs';
import { Comments } from 'src/app/core/model/comment';
import { AppCustomerService } from 'src/app/core/services/app-customer.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { BrokerReviewService } from 'src/app/core/services/broker-review.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ShipperReviewService } from 'src/app/core/services/shipper-review.service';
import { ShopReviewService } from 'src/app/core/services/shop-review.service';

@Component({
  selector: 'app-truckassist-reveiw',
  templateUrl: './truckassist-reveiw.component.html',
  styleUrls: ['./truckassist-reveiw.component.scss'],
})
export class TruckassistReveiwComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @Input() componentName: string;
  @Input() reveiwData: any;
  @Input() shopMapPadding: boolean;
  @Input() tabelStyle: boolean;
  @Input() shopMapSpecialStyle: boolean;
  @Input() shopMapResultStyle: boolean;
  @Input() tableRowSelected: boolean;
  @Input() repairDetails: boolean;
  @Input() id: number;
  /*  @Output() shopListExpend: EventEmitter<any> = new EventEmitter(); */
  isLike: boolean;
  reveiwCliked: boolean;
  liked: boolean;
  disliked: boolean;
  hasUserComment: boolean;
  reveiwComments: any[] = [];
  currentUser: any;
  timeOnCommentsClick: Date;
  clickOnResult: boolean;
  showComments: boolean;
  showDeleteDialog: number;
  editedComment: string;
  comment: string;
  showEditArea = -1;
  showCreateComment: boolean;
  showWriteReveiwQuestion: boolean;
  hoverOverComment: number;
  hoverOverWriteReveiwQuestion: boolean;
  hoverOverCreateComment: boolean;
  closeExdendedList: boolean;
  commentPopUp: any;
  popUpClick: boolean;

  constructor(
    private sharedService: AppSharedService,
    private toastr: ToastrService,
    private shared: SharedService,
    private elementRef: ElementRef,
    private customerService: AppCustomerService,
    private shopServise: ShopReviewService,
    private brokerReveiwService: BrokerReviewService,
    private shipperReviewService: ShipperReviewService
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnChanges() {}

  /* NEW */
  // @HostListener('document:click', ['$event.target'])
  // onClick(target) {
  //   const clickedInside = this.elementRef.nativeElement.contains(target);

  //   /* Fokus out */
  //   if (!clickedInside) {
  //     if(!this.popUpClick){
  //       this.closeAll();
  //       this.commentPopUp.close();
  //       this.comment = '';
  //       this.showCreateComment = false;
  //       this.showWriteReveiwQuestion = true;
  //       this.showEditArea = -1;
  //     }

  //     this.popUpClick = false;
  //   }
  // }

  /* CLose All Open Drop Downs */
  closeAll() {
    this.reveiwComments = [];
    this.clickOnResult = false;
    this.hasUserComment = false;
    this.showWriteReveiwQuestion = false;
    this.showCreateComment = false;
    this.showComments = false;
    this.showDeleteDialog = -1;
  }

  hideDialog(event: any) {
    if (!this.popUpClick && !event.target.classList.contains('description-panel')) {
      this.closeAll();
      this.commentPopUp.close();
      this.comment = '';
      this.showCreateComment = false;
      this.showWriteReveiwQuestion = true;
      this.showEditArea = -1;
    }

    this.popUpClick = false;
  }

  /* REATING */
  /* Like And Dislike */
  onLikeDislike(reveiwData: any, isLike: boolean) {
    let like = 0,
      disLike = 0;
    this.closeAll();

    isLike ? (like = 1) : (disLike = 1);
    isLike ? (this.liked = true) : (this.disliked = true);

    if (isLike) {
      if (reveiwData.thumbUp === null) {
        this.setReating(reveiwData, like, disLike, isLike);
      } else {
        this.componentName === 'Shop'
          ? this.onDeleteShopRating(reveiwData, isLike)
          : this.onDeleteShipperOrBrokerRating(this.componentName, isLike, reveiwData);
      }
    } else {
      if (reveiwData.thumbDown === null) {
        this.setReating(reveiwData, like, disLike, isLike);
      } else {
        this.componentName === 'Shop'
          ? this.onDeleteShopRating(reveiwData, isLike)
          : this.onDeleteShipperOrBrokerRating(this.componentName, isLike, reveiwData);
      }
    }

    let count = 0;
    const interval = setInterval(() => {
      this.liked = false;
      this.disliked = false;
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 180);
  }

  /* Set Create Reating For The Right Component */
  setReating(reveiwData: any, like: any, disLike: any, isLike: boolean) {
    switch (this.componentName) {
      case 'Shop':
        this.createShopReating(reveiwData, like, disLike, isLike);
        break;
      case 'Broker':
        this.createBrokerReating(reveiwData, like, disLike, isLike);
        break;
      case 'Shipper':
        this.createShipperReating(reveiwData, like, disLike, isLike);
        break;
      default:
        break;
    }
  }

  /* Delete Shop Reiting */
  onDeleteShopRating(reveiwData: any, isLike?: boolean) {
    this.deleteShopRating(this.setObjectLikeAndDislike(isLike, reveiwData));
  }

  /* Delete Shipper Or Broker Reiting */
  onDeleteShipperOrBrokerRating(componetn: string, isLike: boolean, reveiwData: any) {
    componetn === 'Broker'
      ? this.deleteBrokerReiting(this.setObjectLikeAndDislike(isLike, reveiwData))
      : this.deleteShipperReiting(this.setObjectLikeAndDislike(isLike, reveiwData));
  }

  /* Set Object Like And Dislike, Return Id Of Object */
  setObjectLikeAndDislike(isLike: boolean, reveiwData: any) {
    let id = 0;
    if (isLike) {
      id = reveiwData.thumbUp;
      reveiwData.thumbUp = null;
      reveiwData.upCount -= 1;
    } else {
      id = reveiwData.thumbDown;
      reveiwData.thumbDown = null;
      reveiwData.downCount -= 1;
    }
    return id;
  }

  /* Update Object Data Of Reiting */
  updateReitingData(id: number, isLike: boolean, reveiwData: any) {
    if (isLike) {
      reveiwData.thumbUp = id;
      reveiwData.upCount += 1;
      if (reveiwData.thumbDown !== null) {
        reveiwData.thumbDown = null;
        reveiwData.downCount -= 1;
      }
    } else {
      reveiwData.thumbDown = id;
      reveiwData.downCount += 1;
      if (reveiwData.thumbUp !== null) {
        reveiwData.thumbUp = null;
        reveiwData.upCount -= 1;
      }
    }
  }

  /* API */
  createShopReating(reveiwData: any, like: any, disLike: any, isLike: boolean) {
    const shopReiting$ = this.sharedService.createRepairShopRating({
      repairShopId: reveiwData.id,
      thumbUp: like,
      thumbDown: disLike,
    });

    forkJoin([shopReiting$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([shopReiting]: [any]) => {
          this.updateReitingData(shopReiting.id, isLike, reveiwData);
          if (like === 1) {
            this.toastr.success('Repair Shop liked', ' ');
          } else {
            this.toastr.success('Repair Shop Disliked', ' ');
          }
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  createBrokerReating(reveiwData: any, like: any, disLike: any, isLike: boolean) {
    const brokerReiting$ = this.customerService.createCustomerReiting({
      brokerId: reveiwData.id,
      thumbUp: like,
      thumbDown: disLike,
      givenRating: 0,
      calculatedRating: 0,
    });

    forkJoin([brokerReiting$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([brokerReiting]: [any]) => {
          this.updateReitingData(brokerReiting.id, isLike, reveiwData);
          if (like === 1) {
            this.toastr.success('Broker liked', ' ');
          } else {
            this.toastr.success('Broker Disliked', ' ');
          }
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  createShipperReating(reveiwData: any, like: any, disLike: any, isLike: boolean) {
    const shipperReiting$ = this.customerService.createShipperReiting({
      shipperId: reveiwData.id,
      thumbUp: like,
      thumbDown: disLike,
    });

    forkJoin([shipperReiting$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([shipperReiting]: [any]) => {
          this.updateReitingData(shipperReiting.id, isLike, reveiwData);
          if (like === 1) {
            this.toastr.success('Shipper liked', ' ');
          } else {
            this.toastr.success('Shipper Disliked', ' ');
          }
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  deleteShopRating(shopRatingID: number) {
    const deleteShopRating$ = this.sharedService.deleteRepairShopRating(shopRatingID);
    forkJoin([deleteShopRating$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        () => {
          this.shared.handleServerError();
        }
      );
  }

  deleteBrokerReiting(brokerRatingID: number) {
    const deleteCustomerRating$ = this.customerService.deleteCustomerReiting(brokerRatingID);
    forkJoin([deleteCustomerRating$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        () => {
          this.shared.handleServerError();
        }
      );
  }

  deleteShipperReiting(shipperReitingId) {
    const deleteShipperRating$ = this.customerService.deleteShipperReiting(shipperReitingId);
    forkJoin([deleteShipperRating$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* COMMENTS */
  /* Create Comment */
  createComment(reveiwData: any, comment: string) {
    this.setCreateComment(reveiwData, comment);
  }

  /* On Enter Create Comment */
  onEnterCreate(key: any, reveiwData: any, comment: string) {
    if (key.keyCode === 13 && key.path[3].className !== 'ng-select-container ng-has-value') {
      key.preventDefault();
      this.setCreateComment(reveiwData, comment);
    }
  }

  /* Cancel Create New */
  onCancelCreateComment() {
    this.showCreateComment = false;
    this.showWriteReveiwQuestion = true;
    this.comment = '';
    this.commentPopUp.close();
    this.closeAll();
  }

  /* Set Create Comment For The Right Component */
  setCreateComment(reveiwData: any, comment: string) {
    switch (this.componentName) {
      case 'Shop':
        this.createShopReview({
          repairShopId: reveiwData.id,
          text: comment,
        });
        break;
      case 'Broker':
        this.createBrokerReview({
          brokerId: reveiwData.id,
          text: comment,
        });
        break;
      case 'Shipper':
        this.createShipperComment({
          shipperId: reveiwData.id,
          text: comment,
        });
        break;
      default:
        break;
    }
  }

  /* Set Update Comment For The Right Component */
  setUpdateComment(comment: any, textNew: string) {
    switch (this.componentName) {
      case 'Shop':
        this.callUpdateShopComment(comment, textNew);
        break;
      case 'Broker':
        this.callUpdateBrokerComment(comment, textNew);
        break;
      case 'Shipper':
        this.callUpdateShipperComment(comment, textNew);
        break;

      default:
        break;
    }
  }

  /* Set Delete Comment For The Right Component */
  setDeleteComment(comment: any) {
    switch (this.componentName) {
      case 'Shop':
        this.deleteShopComment(comment);
        break;
      case 'Broker':
        this.deleteBrokerComment(comment);
        break;
      case 'Shipper':
        this.deleteShipperComment(comment);
        break;

      default:
        break;
    }
  }

  /* Put Data Of Comment In reveiwComments Object When Create */
  handelNewComment(comment: string) {
    this.reveiwComments.splice(0, 0, {
      comment,
      createdAt: new Date(),
      userAvatar: this.currentUser.doc.avatar,
      userEmail: this.currentUser.email,
      userFullName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      userId: this.currentUser.id,
    });
    this.showCreateComment = false;
    this.toastr.success('Created comment', ' ');
  }

  toggleCommentsDialog(popover: any, reveiwData: any) {
    if (popover.isOpen()) {
      popover.close();
      this.comment = '';
      this.showCreateComment = false;
      this.showWriteReveiwQuestion = true;
      this.showEditArea = -1;
    } else {
      popover.open({ reveiwData });
    }

    this.commentPopUp = popover;
    this.onShowComments(reveiwData);
  }

  /* Show Comments */
  onShowComments(reveiwData: any) {
    if (!this.repairDetails) {
      if (this.clickOnResult) {
        this.closeAll();
      } else {
        if (this.componentName === 'Shop') {
          const comments$ = this.sharedService.getRepairShopReviewList(reveiwData.id);
          forkJoin([comments$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              ([comments]: [Comments[]]) => {
                this.commentRegulate(comments, reveiwData);
              },
              () => {
                this.shared.handleServerError();
              }
            );
        } else {
          if (this.componentName === 'Broker') {
            const comments$ = this.brokerReveiwService.getBrokerReviewList(reveiwData.id);
            forkJoin([comments$])
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                ([comments]: [Comments[]]) => {
                  this.commentRegulate(comments, reveiwData);
                },
                () => {
                  this.shared.handleServerError();
                }
              );
          } else {
            const comments$ = this.shipperReviewService.getShipperReviewList(reveiwData.id);
            forkJoin([comments$])
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                ([comments]: [Comments[]]) => {
                  this.commentRegulate(comments, reveiwData);
                },
                () => {
                  this.shared.handleServerError();
                }
              );
          }
        }
      }
    }
  }

  /* Get And Check Comment */
  commentRegulate(comments: Comments[], reveiwData: any) {
    console.log('Komentari');
    console.log(comments);
    /* Pre sta je bilo */
    /* this.reveiwComments = comments; */

    for (let i = 0; i < comments.length; i++) {
      this.reveiwComments.push(this.getCommentObject(comments[i]));
    }

    /* Check If One OF The Comments Is A Comment Of Current User */
    for (const comment of this.reveiwComments) {
      if (comment) {
        if (
          this.currentUser.id === comment.userId &&
          comment.comment !== '' &&
          comment.comment !== null
        ) {
          this.hasUserComment = true;
          break;
        }
      }
    }

    /* Check If User Has Liked Or Disliked And Did Not Comment */
    if (!this.hasUserComment) {
      this.showWriteReveiwQuestion = true;
    } else {
      this.showWriteReveiwQuestion = false;
    }

    /* To Remove Blank Comments */
    const copyReveiwComments = [];
    for (let i = 0; i < this.reveiwComments.length; i++) {
      if (this.reveiwComments[i].comment) {
        copyReveiwComments.push(this.reveiwComments[i]);
      }
    }

    this.reveiwComments = copyReveiwComments;

    this.sortCommentsByDate();

    /* Check If To Show Comments */
    if (this.reveiwComments.length || this.showWriteReveiwQuestion) {
      this.showComments = true;
      this.clickOnResult = true;
      /*  this.shopListExpend.emit({ expend: true, item: reveiwData }); */
    }
  }

  /* Edit Current User Comment*/
  onEditComment(event: any, comment: any, textNew: string) {
    if (event.keyCode === 13 && event.path[3].className !== 'ng-select-container ng-has-value') {
      event.preventDefault();
      this.updateComment(comment, textNew);
    }
  }

  /* Update Comment */
  updateComment(comment: any, textNew: string) {
    const userID = JSON.parse(localStorage.getItem('currentUser')).id;

    this.setUpdateComment(comment, textNew);

    for (const comment of this.reveiwComments) {
      if (comment.userId === userID) {
        comment.comment = textNew;
        comment.createdAt = new Date();
      }
    }

    this.sortCommentsByDate();
    this.showEditArea = -1;
    this.editedComment = '';
  }

  /* Delete Current User Comment */
  onDeleteUserComment(event: boolean, comment: any) {
    this.showDeleteDialog = -1;
    if (event) {
      this.setDeleteComment(comment);

      for (let i = 0; i < this.reveiwComments.length; i++) {
        if (this.reveiwComments[i].id === comment.id) {
          this.reveiwComments.splice(i, 1);
        }
      }

      if (!this.reveiwComments.length) {
        this.closeAll();
      } else {
        this.showWriteReveiwQuestion = true;
      }
    }
  }

  /* Get Spec Data From Comment Object */
  getCommentObject(comment: any) {
    const createdAt = new Date(comment.createdAt);
    const updateAt = new Date(comment.updatedAt);
    return {
      comment: comment.comment,
      createdAt: createdAt.getTime() > updateAt.getTime() ? comment.createdAt : comment.updatedAt,
      id: comment.id,
      updatedAt: comment.updatedAt,
      userAvatar: comment.userAvatar,
      userEmail: comment.userEmail,
      userFullName: comment.userFullName,
      userId: comment.userId,
    };
  }

  /* Sort Comments By Date */
  sortCommentsByDate() {
    this.reveiwComments.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  /* Show Create Comment */
  onShowCreateComment() {
    this.showCreateComment = true;
    this.timeOnCommentsClick = new Date();
    this.showWriteReveiwQuestion = false;
    this.fokusOnInput('createComment');
  }

  /* Show Input For Edit */
  showEditCommentArea(comment: any, index: number) {
    this.showEditArea = index;
    this.editedComment = comment.comment;
    this.fokusOnInput('editComment');
  }

  /* Hover Action On Comments */
  onHoverActionOnComment(index: number) {
    if (this.showCreateComment) {
      this.hoverOverComment = -1;
    } else {
      this.hoverOverComment = index;
    }
  }

  /* For Fokus On Input Method */
  fokusOnInput(inputName: string) {
    const interval = setInterval(() => {
      document.getElementById(inputName).focus();
      clearInterval(interval);
    }, 200);
  }

  /* API  */
  createShopReview(data: any) {
    this.shopServise
      .createShopReview(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.handelNewComment(res.text);
          this.comment = '';
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  createBrokerReview(data: any) {
    this.brokerReveiwService
      .createBrokerReview(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.handelNewComment(res.text);
          this.comment = '';
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  createShipperComment(data: any) {
    this.shipperReviewService
      .createShipperReview(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.handelNewComment(this.comment);
          this.comment = '';
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Update Database For Shop Comment */
  callUpdateShopComment(comment: any, newComment: any) {
    this.shopServise
      .updateShopReview({ text: newComment }, comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.toastr.success('Updated comment', ' ');
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Update Database For Broker Comment */
  callUpdateBrokerComment(comment: any, newComment: any) {
    this.brokerReveiwService
      .updateBrokerReview({ text: newComment }, comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.toastr.success('Updated comment', ' ');
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Update Database For Shippe Comment */
  callUpdateShipperComment(comment: any, newComment: any) {
    this.shipperReviewService
      .updateShipperReview({ text: newComment }, comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.toastr.success('Updated comment', ' ');
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Update Datebase To Delete Shop Comment */
  deleteShopComment(comment: any) {
    this.shopServise
      .deleteShopReview(comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Update Datebase To Delete Shop Comment */
  deleteBrokerComment(comment: any) {
    this.brokerReveiwService
      .deleteBrokerReview(comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Update Datebase To Delete Shop Comment */
  deleteShipperComment(comment: any) {
    this.shipperReviewService
      .deleteShipperReview(comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        () => {
          this.shared.handleServerError();
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
