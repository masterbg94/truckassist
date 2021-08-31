import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableActions } from '../truckassist-table/models/truckassist-table';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-truckassist-dropdown',
  templateUrl: './truckassist-dropdown.component.html',
  styleUrls: ['./truckassist-dropdown.component.scss'],
  providers: [NgbDropdownConfig],
})
export class TruckassistDropdownComponent implements OnInit {
  @Output() actionEvent: EventEmitter<any> = new EventEmitter();
  @Input() identificator: string;
  @Input() mainActions: TableActions[];
  @Input() otherActions: TableActions[];
  @Input() activateAction: TableActions;
  @Input() printAction: TableActions;
  @Input() deleteAction: TableActions;
  @Input() customerActions: TableActions;
  @Input() specialStyle: TableActions;
  @Input() dontShowDeleteDialog: TableActions;
  @Input() status: boolean;
  @Input() category: string;
  @Input() customerData: any;
  @Input() customerBan: any;
  @Input() rowData: any;
  @Input() remuveAction: any;
  private destroy$: Subject<void> = new Subject<void>();
  hideDropDown: boolean;


  editHovered = false;
  deleteHovered = false;
  openDropDeleteDialog = false;

  constructor(
    private config: NgbDropdownConfig,
    private customModalService: CustomModalService
  ) {
    // config.placement = 'top';
    // config.autoClose = false;
  }

  ngOnInit(): void {
    this.customModalService.changedIndetifier
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      this.identificator = res;
    });
    
    /* Remuve Action If Flag True */
    if(this.remuveAction && this.rowData.api){
      this.hideDropDown = true
    }
  }

  public openAction(action: any): void {
    this.actionEvent.emit(action);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDeleteDialog(params: any) {
    const data = {
      name: 'delete',
      type: params.type,
      text: null,
      category: params.category,
      id: (params.category === 'account' || params.category === 'contact') ? params.id.id : params.id
    };
    this.customModalService.openModal(DeleteDialogComponent, { data }, null, { size: 'small' });
  }

  onDropDialog(event: boolean, action: any) {
    this.openDropDeleteDialog = false;
    if (event) {
      this.actionEvent.emit(action);
    }
  }
}
