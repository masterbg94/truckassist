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
import { ManageRepairShop } from 'src/app/core/model/shared/repairShop';
import { SearchDataService } from 'src/app/core/services/search-data.service';
import { SearchFilterEvent } from 'src/app/core/model/shared/searchFilter';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ViolationManageComponent } from '../../violation-manage/violation-manage.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-violation-map-list',
  templateUrl: './violation-map-list.component.html',
  styleUrls: ['./violation-map-list.component.scss'],
})
export class ViolationMapListComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @Input() shopList: any[];
  @Input() titleOfList: string;
  @Output() shopDelete: EventEmitter<ManageRepairShop> = new EventEmitter();
  changeStyleList = false;
  rotateSVG = false;
  expendShop = -1;
  emptyList: boolean;
  highlightingWords = [];
  reveiwFListActive: boolean;
  countOfShops = 0;
  copyPhone = false;
  copyMail = false;
  copyAddress = false;
  violationIconData = [
    {
      iconUrl: 'vl1',
      weight: 0,
    },
    {
      iconUrl: 'vl2',
      weight: 0,
    },
    {
      iconUrl: 'vl3',
      weight: 0,
    },
    {
      iconUrl: 'vl4',
      weight: 0,
    },
    {
      iconUrl: 'vl5',
      weight: 0,
    },
    {
      iconUrl: 'vl6',
      weight: 0,
    },
    {
      iconUrl: 'vl7',
      weight: 0,
    },
  ];
  constructor(
    private searchDateService: SearchDataService,
    private customModalService: CustomModalService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.countOfShops = this.shopList.length;
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

  onShowShopList() {
    this.rotateSVG = !this.rotateSVG;
    this.emptyList = !this.rotateSVG && this.shopList.length === 0;
    this.expendShop = -1;
  }

  onShopExpend(index: number, data?) {
    this.violationIconData = [];
    if (this.expendShop === index) {
      this.expendShop = -1;
    } else {
      this.violationIconData = [
        {
          iconUrl: 'vl1',
          weight: data.vl1,
        },
        {
          iconUrl: 'vl2',
          weight: data.vl2,
        },
        {
          iconUrl: 'vl3',
          weight: data.vl3,
        },
        {
          iconUrl: 'vl4',
          weight: data.vl4,
        },
        {
          iconUrl: 'vl5',
          weight: data.vl5,
        },
        {
          iconUrl: 'vl6',
          weight: data.vl6,
        },
        {
          iconUrl: 'vl7',
          weight: data.vl7,
        },
      ];
      this.expendShop = index;
    }
  }

  /* Delete Shop */
  onDeleteShop(id) {
    this.onShowShopList();
    const data = {
      name: 'delete',
      type: 'delete-violation',
      text: null,
      category: 'violation',
      id,
    };
    this.customModalService.openModal(DeleteDialogComponent, { data }, null, { size: 'small' });
    this.sharedService.emitDeleteAction.pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        this.onShowShopList();
      }, 1000);
    });
  }

  /* Edit Shop */
  onEditShop(id: number) {
    this.onShowShopList();
    const data = {
      type: 'edit',
      id,
      violation: this.shopList,
    };
    this.customModalService.openModal(ViolationManageComponent, { data }, null, {
      modalDialogClass: 'violation-modal',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
