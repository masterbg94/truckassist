import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { RepairShopManageComponent } from 'src/app/shared/app-repair-shop/repair-shop-manage/repair-shop-manage.component';
import { ManageRepairShop } from 'src/app/core/model/shared/repairShop';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { formatPhoneNumber } from 'src/app/core/helpers/formating';
import { SearchDataService } from 'src/app/core/services/search-data.service';
import { SearchFilterEvent } from 'src/app/core/model/shared/searchFilter';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-shop-lists',
  templateUrl: './shop-lists.component.html',
  styleUrls: ['./shop-lists.component.scss'],
})
export class ShopListsComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @Input() shopList: any[];
  @Input() titleOfList: string;
  @Output() shopPin: EventEmitter<ManageRepairShop> = new EventEmitter();
  @Output() shopDelete: EventEmitter<ManageRepairShop> = new EventEmitter();
  changeStyleList = false;
  rotateSVG = false;
  expendShop = -1;
  emptyList: boolean;
  highlightingWords = [];
  reveiwFListActive: boolean;
  countOfShops = 0;
  shopUnPinned = -1;
  copyPhone = false;
  copyMail = false;
  copyAddress = false;

  constructor(
    private searchDateService: SearchDataService,
    private sharedService: AppSharedService,
    private toastr: ToastrService,
    private shared: SharedService,
    private customModalService: CustomModalService,
    private maintenanceServise: MaintenanceService
  ) {}

  ngOnInit(): void {
    this.countOfShops = this.shopList.length;
    let isFirstLoad = true;
    this.maintenanceServise.currentShop.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (!isFirstLoad) {
        let isEdit: boolean;
        for (const shop of this.shopList) {
          if (shop.id === res.id) {
            shop.doc = res.doc;
            shop.name = res.name;
            isEdit = true;
            break;
          }
        }
        if (!isEdit) {
          this.shopList.push({
            id: res.id,
            companyID: res.companyID,
            name: res.name,
            status: res.status,
            pinned: res.pinned,
            latitude: res.latitude,
            longitude: res.longitude,
            upCount: res.upCount,
            downCount: res.downCount,
            thumbUp: res.thumbUp,
            thumbDown: res.thumbDown,
            latestComment: res.latestComment,
            repairCount: res.repairCount,
            total: res.total,
            doc: res.doc,
            show: true,
          });
        }
      }

      isFirstLoad = false;
      this.countOfShops = this.shopList.length;
    });

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.shopList.currentValue) {
      this.countOfShops = this.shopList.length;
    }
  }

  /* onReveiwClick(receivedData: any, list: string) {
    if (receivedData.expend) {
      this.reveiwFListActive = true;
    } else {
      this.reveiwFListActive = false;
    }
  } */

  /* onSearch() {
    this.shopList = this.shopList.filter((shop) => {
      shop.show = true;
      return shop;
    });
    this.countOfShops = this.shopList.length;

    this.searchDateService.dataSource.subscribe((event: SearchFilterEvent) => {
      if (event && event.check) {
        this.highlightingWords =
          event.searchFilter && event.searchFilter.chipsFilter
            ? event.searchFilter.chipsFilter.words
            : [];

        if (this.highlightingWords[0]?.text !== '') {
          this.countOfShops = 0;
          this.shopList = this.shopList.filter((shop) => {
            if (
              shop.name
                .trim()
                .toLowerCase()
                .includes(this.highlightingWords[0]?.text.toLowerCase().trim())
            ) {
              shop.show = true;
              this.countOfShops++;
            } else {
              shop.show = false;
            }
            return shop;
          });
        }
      }
    });
  } */

  onShowShopList() {
    this.rotateSVG = !this.rotateSVG;
    this.emptyList = !this.rotateSVG && this.shopList.length === 0;
  }

  onShopExpend(index: number) {
    if (this.expendShop === index) {
      this.expendShop = -1;
    } else {
      this.expendShop = index;
    }
  }

  onCopy(val: string, isPhone: boolean, isMail: boolean, isAddres: boolean) {
    if (isPhone) {
      this.copyPhone = true;
    }
    if (isMail) {
      this.copyMail = true;
    }
    if (isAddres) {
      this.copyAddress = true;
    }

    let count = 0;
    const interval = setInterval(() => {
      this.copyPhone = false;
      this.copyMail = false;
      this.copyAddress = false;
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 600);

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    if (isPhone) {
      selBox.value = formatPhoneNumber(val);
    } else {
      selBox.value = val;
    }
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  /* Delete Shop */
  onDeleteShop(shop: ManageRepairShop) {
    if (!shop.repairCount) {
      this.sharedService.deleteRepairShop(shop.id).subscribe(() => {
        this.toastr.success(`Repair Shop successfully deleted.`, ' ');
      });
      this.shopDelete.emit(shop);
      this.maintenanceServise.sendDeletedShop(shop);
      for (let i = 0; i < this.shopList.length; i++) {
        if (shop.id === this.shopList[i].id) {
          this.shopList.splice(i, 1);
        }
      }
      this.expendShop = -1;
      this.countOfShops--;
    } else {
      this.toastr.warning(`${shop.name} has orders, it can't be deleted.`, 'Warning: ');
    }
  }

  /* Edit Shop */
  onEditShop(id: number) {
    this.sharedService.getRepairShop(id).subscribe(
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

  /* Pin Shop */
  onPin(shop: ManageRepairShop) {
    if (shop) {
      this.pinShop(
        shop.id,
        {
          pinned: shop.pinned === 1 ? 0 : 1,
        },
        shop
      );
    }
  }

  pinShop(id: number, data: any, shop: ManageRepairShop) {
    this.sharedService
      .pinRepairShop(id, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((shopRes: ManageRepairShop) => {
        this.shopUnPinned = shop.id;

        this.shopPin.emit(shop);
        shop.pinned = shopRes.pinned;

        const interval = setInterval(() => {
          this.shopUnPinned = -1;

          this.shopList.sort(function (a, b) {
            if (a.pinned > b.pinned) {
              return -1;
            }
            if (a.pinned < b.pinned) {
              return 1;
            }
            return 0;
          });

          clearInterval(interval);
        }, 300);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
