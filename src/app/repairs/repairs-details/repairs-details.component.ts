import { takeUntil } from 'rxjs/operators';
import { RepairShops } from 'src/app/core/model/shared/repairShop';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { SharedService } from 'src/app/core/services/shared.service';
import * as AppConst from '../../const';
import { numberWithCommas } from 'src/app/core/helpers/formating';
import { ToastrService } from 'ngx-toastr';
import { TruckTrailerMaintenance } from 'src/app/core/model/shared/maintenance';
import { ShopReviewService } from 'src/app/core/services/shop-review.service';
import { RepairShopManageComponent } from 'src/app/shared/app-repair-shop/repair-shop-manage/repair-shop-manage.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SearchDataService } from 'src/app/core/services/search-data.service';
import { SearchFilterEvent } from 'src/app/core/model/shared/searchFilter';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-repairs-details',
  templateUrl: './repairs-details.component.html',
  styleUrls: ['./repairs-details.component.scss'],
})
export class RepairsDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private maintenanceServise: MaintenanceService,
    private sharedRepairService: AppSharedService,
    private shared: SharedService,
    private maintenanceService: MaintenanceService,
    private shopServise: ShopReviewService,
    private customModalService: CustomModalService,
    private searchDateService: SearchDataService,
    private clipboard: Clipboard
  ) {}
  
  private destroy$: Subject<void> = new Subject<void>();

  /* Switch Variables */
  optionsSwitch: any = [];

  /* Shop Variables */
  shopId: number;
  shop: any;
  types = [
    { name: 'Truck', active: false },
    { name: 'Trailer', active: false },
    { name: 'Mobile', active: false },
    { name: 'Shop', active: false },
    { name: 'Towing', active: false },
    { name: 'Parts', active: false },
    { name: 'Tire', active: false },
    { name: 'Dealer', active: false },
  ];
  amount: any;
  actions = [
    { icon: '../../../assets/img/svgs/repair/pin.svg', action: 'pin' },
    { icon: '../../../assets/img/svgs/repair/print.svg', action: 'print' },
    { icon: '../../../assets/img/svgs/repair/mail-send.svg', action: 'mail' },
  ];
  animatePin = 0;
  shopReview = [];
  comment: string;

  /* Truck And Trailer Variables */
  trucks: any[] = [];
  trailers: any[] = [];
  truckAndTrailerRepair = [];
  user: any;

  /* Map Variables */
  mapOptions = {
    latitude: 38.3357027,
    longitude: -99.8558299,
  };
  styles = AppConst.GOOGLE_MAP_STYLES;
  markerIcon: string;
  mostRepairedTrucks = [];
  mostRepairedTrailer = [];
  mostRepairedTruckAndTrailer = [];
  highlightingUnit = [];
  highlightingTruckTrailer = [];
  searchId = 0;
  editActive: boolean;
  createCommentActive: boolean;
  userWroteComment: boolean;
  focusedMostRepaired = [];
  mostRepairedFocusActive: boolean;
  copyPhone: boolean;
  copyMail: boolean;
  copyAddress: boolean;
  map: any;
  address: any;

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    /* Get Shop Id From Route */
    this.route.params
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      this.shopId = parseInt(params.id);
    });

    /* Get All Shops */
    this.maintenanceServise.currentShop
    .pipe(takeUntil(this.destroy$))
    .subscribe((repairShops) => {
      if (repairShops.length && this.shopId) {
        this.findSelectedShop(repairShops);
      } else {
        this.getRepairShops();
      }
    });

    /* Highlighting Searched Words */
      this.searchDateService.dataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: SearchFilterEvent) => {
        if (event && event.check) {
          switch (this.searchId) {
            case 1:
              this.highlightingUnit =
                event.searchFilter && event.searchFilter.chipsFilter
                  ? event.searchFilter.chipsFilter.words
                  : [];
              this.filterMostRepairedTruckAndTrailer();
              break;
            case 2:
              this.highlightingTruckTrailer =
                event.searchFilter && event.searchFilter.chipsFilter
                  ? event.searchFilter.chipsFilter.words
                  : [];
              this.filterTruckAndTrailer();
              break;
            default:
              break;
          }
        }
      });
  }

  /* Get Selected Search */
  searchSeleced(idSearch: number) {
    this.searchId = idSearch;
  }

  /* Filter Most Repaired */
  filterMostRepairedTruckAndTrailer() {
    if (this.highlightingUnit.length) {
      this.mostRepairedTruckAndTrailer.filter((most) => {
        let flag = false;
        if (
          most.unit
            .trim()
            .toLowerCase()
            .includes(this.highlightingUnit[0].text.toLowerCase().trim())
        ) {
          flag = true;
        }
        if (flag) {
          most.show = true;
          return most;
        } else {
          most.show = false;
          return most;
        }
      });
    } else {
      this.mostRepairedTruckAndTrailer.filter((most) => {
        most.show = true;
        return most;
      });
    }
  }

  /* Filter Truck And Trailer */
  filterTruckAndTrailer() {
    if (!this.mostRepairedFocusActive) {
      if (this.highlightingTruckTrailer.length) {
        this.truckAndTrailerRepair.filter((truckTrailer) => {
          let flag = false;
          if (
            truckTrailer.truckTrailerUnit
              .trim()
              .toLowerCase()
              .includes(this.highlightingTruckTrailer[0].text.toLowerCase().trim())
          ) {
            flag = true;
          }
          if (flag) {
            truckTrailer.show = true;
            return truckTrailer;
          } else {
            truckTrailer.show = false;
            return truckTrailer;
          }
        });
      } else {
        this.truckAndTrailerRepair.filter((most) => {
          most.show = true;
          return most;
        });
      }
    } else {
      this.highlightingTruckTrailer = [];
    }
  }

  /* KeyEvents */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    /* Esc */
    if (event.keyCode === 27) {
      if (this.editActive) {
        this.cancelEditComment();
      }

      if (this.createCommentActive) {
        this.cancelCreateComment();
      }
    }
  }

  /* Copy Shop Info */
  onCopy(value: string, info: string) {
    this.clipboard.copy(value);

    switch (info) {
      case 'phone':
        this.copyPhone = true;
        break;
      case 'email':
        this.copyMail = true;
        break;
      case 'address':
        this.copyAddress = true;
        break;
    }

    const interval = setInterval(() => {
      this.copyPhone = false;
      this.copyMail = false;
      this.copyAddress = false;
      clearInterval(interval);
    }, 500);
  }
  
  /* Find Selected Shop */
  findSelectedShop(repairShops: any) {
    /* Get Data For Switch */
    this.optionsSwitch = repairShops;

    /* Find Selected Shop */
    for (const shop of repairShops) {
      if (shop.id === this.shopId) {
        this.shop = shop;
        this.amount = this.formatDollar(shop.total);
        this.findShopTypes(shop);
        break;
      }
    }

    console.log('Shop')
    console.log(this.shop)

    this.address = this.convertAddress(this.shop.doc.address.address);

    this.getTruckAndTrailers();
    this.getShopComments(this.shopId);
  }

  /* Convert Address */
  convertAddress(address: string) {
    let count = 0;
    let street = '';
    let state = '';
    let zip = '';
    let country = '';
    for (const c of address) {
      if (c === ',') {
        count++;
      }
      if (c !== ',' && count === 0) {
        street += c;
      } else if (c !== ',' && count === 1) {
        state += c;
      } else if (c !== ',' && count === 2) {
        zip += c;
      } else if (c !== ',' && count === 3) {
        country += c;
      }
    }
    return {
      street,
      state,
      zip,
      country,
    };
  }

  /* Find Types Of Shops */
  findShopTypes(shop: any) {
    for (let i = 0; i < shop.doc.types.length; i++) {
      this.types[i].active = shop.doc.types[i].checked;
    }

    this.setMarkerIcon();
  }

  /* Set Icon For Marker */
  setMarkerIcon() {
    let countActive = 0;
    for (let i = 0; i < this.types.length; i++) {
      if (this.types[i].active) {
        countActive++;
      }
    }
    this.markerIcon = this.getMarkerIcon(this.shop.pinned, countActive);
  }

  /* Get Icon For Marker */
  getMarkerIcon(isPin: boolean, typeNumber: number) {
    if (typeNumber > 0 && typeNumber <= 5) {
      return isPin
        ? `../../../../assets/img/svgs/markers-map/${typeNumber}-fav.svg`
        : `../../../../assets/img/svgs/markers-map/${typeNumber}.svg`;
    } else if (!typeNumber) {
      return isPin
        ? `../../../../assets/img/svgs/markers-map/Marker-No-Types-Fav.svg`
        : `../../../../assets/img/svgs/markers-map/Marker-No-Types.svg`;
    } else {
      return isPin
        ? `../../../../assets/img/svgs/markers-map/5-plus-fav.svg`
        : `../../../../assets/img/svgs/markers-map/5-plus.svg`;
    }
  }

  /* Focus On Selected Most Repaired */
  onFocusMostRepaired(mostRepairedSelected: any) {
    let isSelected = false;
    for (let i = 0; i < this.focusedMostRepaired.length; i++) {
      if (this.focusedMostRepaired[i].unit === mostRepairedSelected.unit) {  
        mostRepairedSelected.focus = false;
        this.focusedMostRepaired.splice(i, 1);
        isSelected = true;
      }
    }

    if (!isSelected) {
      mostRepairedSelected.focus = true;
      this.focusedMostRepaired.push(mostRepairedSelected);
    }

    if (this.focusedMostRepaired.length) {
      this.mostRepairedFocusActive = true;
      for (let i = 0; i < this.truckAndTrailerRepair.length; i++) {
        this.truckAndTrailerRepair[i].show = false;
      }

      for (let i = 0; i < this.focusedMostRepaired.length; i++) {
        for (let j = 0; j < this.truckAndTrailerRepair.length; j++) {
          if (this.focusedMostRepaired[i].unit === this.truckAndTrailerRepair[j].truckTrailerUnit) {
            this.truckAndTrailerRepair[j].show = true;
          }
        }
      }
    } else {
      this.mostRepairedFocusActive = false;
      for (let i = 0; i < this.truckAndTrailerRepair.length; i++) {
        this.truckAndTrailerRepair[i].show = true;
      }
    }
  }

  /* Action On Shop */
  onAction(action: string) {
    switch (action) {
      case 'pin':
        this.pinShop(this.shop.id, {
          pinned: this.shop.pinned ? 0 : 1,
        });
        break;
      case 'print':
        console.log('Treba se printa');
        break;
      case 'mail':
        console.log('Treba se posalje mail');
        break;
      default:
        break;
    }
  }

  /* Edit Shop */
  onEditShop() {
    const id = this.shopId;
    this.sharedRepairService.getRepairShop(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (shop: any) => {
        const data = {
          type: 'edit',
          shop,
          id,
        };
        this.customModalService.openModal(RepairShopManageComponent, { data }, null, {
          size: 'small',
        });
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  /* Sort Most Repaired By Id */
  sortMostRepairedById() {
    this.mostRepairedTrucks.sort((a, b) => {
      return parseFloat(a.truckId) - parseFloat(b.truckId);
    });

    this.mostRepairedTrailer.sort((a, b) => {
      return parseFloat(a.trailerId) - parseFloat(b.trailerId);
    });
  }

  /* Get Most Repaird */
  getMostRepaired() {
    /* Connect And Calculate Data Of Same ID For Trucks */
    if (this.mostRepairedTrucks.length > 1) {
      for (let i = 0; i < this.mostRepairedTrucks.length; i++) {
        this.mostRepairedTrucks[i].active = true;
        for (let j = i + 1; j < this.mostRepairedTrucks.length; j++) {
          if (this.mostRepairedTrucks[i].truckId === this.mostRepairedTrucks[j].truckId) {
            this.mostRepairedTrucks[i].count++;
            this.mostRepairedTrucks[i].total += this.mostRepairedTrucks[j].total;
          } else {
            i = j - 1;
            break;
          }
        }
      }
    } else {
      if (this.mostRepairedTrucks[0]) {
        this.mostRepairedTrucks[0].active = true;
      }
    }

    /* Connect And Calculate Data Of Same ID For Trailers */
    if (this.mostRepairedTrailer.length > 1) {
      for (let i = 0; i < this.mostRepairedTrailer.length; i++) {
        this.mostRepairedTrailer[i].active = true;
        for (let j = i + 1; j < this.mostRepairedTrailer.length; j++) {
          if (this.mostRepairedTrailer[i].trailerId === this.mostRepairedTrailer[j].trailerId) {
            this.mostRepairedTrailer[i].active = true;
            this.mostRepairedTrailer[i].count++;
            this.mostRepairedTrailer[i].total += this.mostRepairedTrailer[j].total;
          } else {
            i = j - 1;
            break;
          }
        }
      }
    } else {
      if (this.mostRepairedTrailer[0]) {
        this.mostRepairedTrailer[0].active = true;
      }
    }

    /* Push Connected Data In One Object */
    for (let i = 0; i < this.mostRepairedTrucks.length; i++) {
      if (this.mostRepairedTrucks[i].active) {
        this.mostRepairedTruckAndTrailer.push(this.mostRepairedTrucks[i]);
      }
    }

    for (let i = 0; i < this.mostRepairedTrailer.length; i++) {
      if (this.mostRepairedTrailer[i].active) {
        this.mostRepairedTruckAndTrailer.push(this.mostRepairedTrailer[i]);
      }
    }
  }

  /* Format And Sort Most Repaird */
  formatAndSortMostRepaird() {
    this.mostRepairedTruckAndTrailer.sort((a, b) => {
      return parseFloat(b.count) - parseFloat(a.count);
    });

    for (let i = 0; i < this.mostRepairedTruckAndTrailer.length; i++) {
      this.mostRepairedTruckAndTrailer[i].total = this.checkTotal(this.mostRepairedTruckAndTrailer[i].total);

      this.mostRepairedTruckAndTrailer[i].total = this.formatDollar(
        this.mostRepairedTruckAndTrailer[i].total
      );
    }
  }

  /* Format To Dollar */
  formatDollar(dataToFormat: any) {
    return dataToFormat
      ? '$' + numberWithCommas(dataToFormat.toString().replace('$', ''), false)
      : '$0';
  }

  /* Api Calls */
  pinShop(id: number, data: any) {
    this.sharedRepairService.pinRepairShop(id, data)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.toastr.success(this.shop.pinned ? 'Shop UnPinned' : 'Shop Pinned', ' ');
        this.shop.pinned = this.shop.pinned ? 0 : 1;
        this.animatePin = 1;
        this.setMarkerIcon();
        const interval = setInterval(() => {
          this.animatePin = 0;
          clearInterval(interval);
        }, 300);
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  /* COMMENTS */

  /* Add New */
  addComment() {
    const hasUserComment = this.shopReview.filter((review) => {
      if (review.userId === this.user.id) {
        return true;
      }
    });

    if (!hasUserComment.length) {
      this.createCommentActive = true;
      this.shopReview.push({
        createdAt: new Date(),
        userId: this.user.id,
        userAvatar: this.user.doc.avatar.src,
        userFullName: this.user.firstName + ' ' + this.user.lastName,
        newComment: true,
        comment: '',
        canEditDelete: false,
        id: 0,
        editingExistingComment: false,
      });
    }

    this.focusOnTextArea();
  }

  /* On Enter Create Or Update Comment */
  onEnter(key: any, comment: any) {
    if (key.keyCode === 13 && key.path[3].className !== 'ng-select-container ng-has-value') {
      key.preventDefault();
      if (!comment.editingExistingComment) {
        this.saveComment();
      } else {
        this.updateShopComment(comment);
      }
    }else{
      let text = document.getElementById('createComment').innerHTML;

      if(text.length >= 120){
        key.preventDefault();
      }
    }
  }

  /* Call callCreateReviewApi Method  */
  saveComment() {
    this.comment = document.getElementById('createComment').innerHTML;
    for (let index = 0; index < this.shopReview.length; index++) {
      if (this.shopReview[index].newComment) {
        this.callCreateReviewApi(
          {
            repairShopId: this.shopId,
            text: this.comment,
          },
          index
        );
      }
    }
  }

  /* Cancel Create Comment */
  cancelCreateComment() {
    for (let i = 0; this.shopReview.length; i++) {
      console.log(this.shopReview[i]);
      if (this.shopReview[i].id === 0) {
        this.shopReview.splice(i, 1);
        break;
      }
    }
    this.comment = '';
    this.createCommentActive = false;
  }

  /* Cancle Edit */
  cancelEditComment() {
    for (let i = 0; i < this.shopReview.length; i++) {
      this.shopReview[i].newComment = false;
    }

    this.comment = '';
    this.editActive = false;
  }

  /* Api Call For Create Comment */
  callCreateReviewApi(data: any, index: number) {
    this.shopServise.createShopReview(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (comment: any) => {
        this.createCommentActive = false;
        this.shopReview[index].comment = this.comment;
        this.shopReview[index].newComment = false;
        this.shopReview[index].id = comment.id;
        this.shopReview[index].canEditDelete = this.user.id === comment.userId;
        this.comment = '';
        this.userWroteComment = true;
        this.sortCommentsByDate();
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  /* Open Edit Comment */
  editShopComment(comment: any) {
    for (let i = 0; i < this.shopReview.length; i++) {
      if (this.shopReview[i].userId === comment.userId) {
        this.editActive = true;
        this.shopReview[i].newComment = true;
        this.shopReview[i].editingExistingComment = true;
        this.comment = this.shopReview[i].comment;
        this.focusOnTextArea();
        break;
      }
    }
  }

  /* Update Comment */
  updateShopComment(comment: any) {
    this.comment = document.getElementById('createComment').innerHTML;
    this.shopServise.updateShopReview({ text: this.comment }, comment.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (comment: any) => {
        for (let i = 0; i < this.shopReview.length; i++) {
          if (this.shopReview[i].userId === comment.userId) {
            this.shopReview[i].newComment = false;
            this.shopReview[i].editingExistingComment = false;
            this.shopReview[i].comment = this.comment;
            this.shopReview[i].createdAt = comment.updatedAt;
            this.comment = '';
            break;
          }
        }

        this.sortCommentsByDate();
        this.toastr.success('Updated comment', ' ');
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  /* Get Comments */
  getShopComments(shopId: number) {
    const shopComments$ = this.sharedRepairService.getRepairShopReviewList(shopId);
    forkJoin([shopComments$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
    ([shopComments]: [any]) => {
      this.shopReview = [];
      for (let i = 0; i < shopComments.length; i++) {
        const createdAt = new Date(shopComments.createdAt);
        const updateAt = new Date(shopComments.updatedAt);
        this.shopReview.push({
          comment: shopComments[i].comment,
          createdAt:
            createdAt.getTime() > updateAt.getTime()
              ? shopComments[i].createdAt
              : shopComments[i].updatedAt,
          id: shopComments[i].id,
          thumbDown: shopComments[i].thumbDown,
          thumbUp: shopComments[i].thumbUp,
          updatedAt: shopComments[i].updatedAt,
          userAvatar: shopComments[i].userAvatar,
          userEmail: shopComments[i].userEmail,
          userFullName: shopComments[i].userFullName,
          userId: shopComments[i].userId,
          canEditDelete: this.user.id === shopComments[i].userId,
          newComment: false,
          editingExistingComment: false,
        });

        if (shopComments[i].userId === this.user.id) {
          this.userWroteComment = true;
        }
      }
      this.sortCommentsByDate();
    },
    () => {
      this.shared.handleServerError();
    }
  );
  }

  /* Delete Shop Comment */
  deleteShopComment(comment: any) {
    this.shopServise.deleteShopReview(comment.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        for (let i = 0; i < this.shopReview.length; i++) {
          if (this.shopReview[i].id === comment.id) {
            this.shopReview.splice(i, 1);
            this.userWroteComment = false;
          }
        }
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  /* Sort Comments By Date */
  sortCommentsByDate() {
    this.shopReview.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  /* Focus On Textarea */
  focusOnTextArea() {
    const interval = setInterval(() => {
      document.getElementById('createComment').focus();
      clearInterval(interval);
    }, 200);
  }

  getRepairShops() {
    const repairShops$ = this.sharedRepairService.getRepairShops();
    forkJoin([repairShops$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([repairShops]: [RepairShops]) => {
        this.findSelectedShop(repairShops.data);
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  getTruckAndTrailers() {
    const truckAndTrailers$ = this.maintenanceService.getMaintenance();
    forkJoin([truckAndTrailers$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([truckAndTrailers]: [TruckTrailerMaintenance]) => {

        this.trailers = truckAndTrailers.maintenanceTrailerList;
        this.trucks = truckAndTrailers.maintenanceTruckList;
        this.truckAndTrailerRepair = [];
        this.mostRepairedTrucks = [];
        this.mostRepairedTrailer = [];
        this.mostRepairedTruckAndTrailer = [];

        for (let i = 0; i < this.trucks.length; i++) {
          if (this.trucks[i].repairShopId === this.shopId) {
            this.truckAndTrailerRepair.push(this.getObjectForTruckTrailer(this.trucks[i]));

            this.mostRepairedTrucks.push({
              truckId: this.trucks[i].truckId,
              total:  this.trucks[i].doc.total,
              category: this.trucks[i].category,
              unit: this.trucks[i].truckNumber,
              count: 1,
              active: false,
              show: true,
              focus: false,
            });
          }
        }
        for (let i = 0; i < this.trailers.length; i++) {
          if (this.trailers[i].repairShopId === this.shopId) {
            this.truckAndTrailerRepair.push(this.getObjectForTruckTrailer(this.trailers[i]));

            this.mostRepairedTrailer.push({
              trailerId: this.trailers[i].trailerId,
              total: this.trailers[i].doc.total,
              category: this.trailers[i].category,
              unit: this.trailers[i].trailerNumber,
              count: 1,
              active: false,
              show: true,
              focus: false,
            });
          }
        }

        this.sortMostRepairedById();
        this.getMostRepaired();
        this.formatAndSortMostRepaird();

        this.truckAndTrailerRepair.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        console.log('this.truckAndTrailerRepair');
        console.log(this.truckAndTrailerRepair)

        /* Format Data */
        for (let i = 0; i < this.truckAndTrailerRepair.length; i++) {
          this.truckAndTrailerRepair[i].total = this.formatDollar(
            this.truckAndTrailerRepair[i].total
          );

          for (let j = 0; j < this.truckAndTrailerRepair[i].doc.items.length; j++) {
            this.truckAndTrailerRepair[i].doc.items[j].price = this.formatDollar(
              this.truckAndTrailerRepair[i].doc.items[j].price
            );
          }
        }
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  getObjectForTruckTrailer(data: any) {
    return {
      category: data.category,
      companyId: data.companyId,
      createdAt: data.createdAt,
      doc: data.doc,
      guid: data.guid,
      id: data.id,
      invoiceNo: data.invoiceNo,
      maintenanceDate: data.maintenanceDate,
      mileage: data.mileage,
      repairShopId: data.repairShopId,
      repairShopName: data.repairShopName,
      total: this.checkTotal(data.doc.total),
      trailerId: data.trailerId,
      truckTrailerUnit: data.trailerNumber ? data.trailerNumber : data.truckNumber,
      truckId: data.truckId,
      truckNumber: data.truckNumber,
      updatedAt: data.updatedAt,
      show: true,
    };
  }

  checkTotal(total: number){
    if(total % 1 !== 0){
      return total.toFixed(2)
    }else{
      return total
    }
  }

  /* Map Initialization */
  mapReady(event: any, marker: any) {
    this.map = event;

    const interval = setInterval(() => {
      this.zoomOnMarker(marker);
      clearInterval(interval);
    }, 1000);
  }

  /* Zoom On Marker */
  zoomOnMarker(marker: any) {
    const bounds = new google.maps.LatLngBounds();

    bounds.extend({
      lat: parseFloat(marker.latitude),
      lng: parseFloat(marker.longitude),
    });

    const myLatlng = new google.maps.LatLng(marker.latitude, marker.longitude);

    this.map.panToBounds(bounds);
    this.map.panTo(myLatlng);
    const interval = setInterval(() => {
      this.map.setZoom(8);
      clearInterval(interval);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
