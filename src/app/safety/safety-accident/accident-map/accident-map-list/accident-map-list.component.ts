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
import { AccidentManageComponent } from '../../accident-manage/accident-manage.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { SharedService } from 'src/app/core/services/shared.service';
@Component({
  selector: 'app-accident-map-list',
  templateUrl: './accident-map-list.component.html',
  styleUrls: ['./accident-map-list.component.scss'],
})
export class AccidentMapListComponent implements OnInit, OnChanges, OnDestroy {
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
    if (this.expendShop === index) {
      this.expendShop = -1;
    } else {
      this.expendShop = index;
    }
  }

  /* Delete Shop */
  onDeleteShop(id) {
    this.onShowShopList();
    const data = {
      name: 'delete',
      type: 'delete-accident',
      text: null,
      category: 'accident',
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
    };
    this.customModalService.openModal(AccidentManageComponent, { data }, null, {
      size: 'small',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
