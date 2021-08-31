import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import { ClonerService } from 'src/app/core/services/cloner-service';
import {
  TableColumnDefinition,
  TableData,
  TableOptions,
} from '../truckassist-table/models/truckassist-table';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-truckassist-action-stack',
  templateUrl: './truckassist-action-stack.component.html',
  styleUrls: ['./truckassist-action-stack.component.scss'],
})
export class TruckassistActionStackComponent implements OnInit, OnDestroy {
  public showMenu = false;
  public subMenu = '';
  @Output() actionEvent: EventEmitter<string> = new EventEmitter();
  @Output() resetColumnEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() hideColumnsEvent: EventEmitter<string> = new EventEmitter();
  @Input() options: TableOptions;
  @Input() columns: TableColumnDefinition[];
  @Input() mySelection: DeletedItem[];
  @Input() selectedTab: string;
  @Input() loadingItems: boolean;
  @Input() truckassistTable: ElementRef;
  @Input() tableData: TableData[] = [];
  @Input() locked: boolean;
  @Input() touched: boolean;
  @Input() showResetConfirmation: boolean;
  @Input() extendedTableTouched: boolean;
  @Input() viewData: Array<any>;
  @Input() stateName: string;
  @Input() viewMode: string;
  @Input() expanded: string;
  public exportData: Array<any> = [];

  public exportColumns: TableColumnDefinition[] = [];

  public printerFriendly = false;
  public exportFormGroup: FormGroup;
  public submitted = false;

  public export = false;
  public tablePrinting = false;

  // public exportMenu = 'stack-dropdown';

  get exportMode(): any {
    return this.exportFormGroup.get('exportMode');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setDropdownOrientation();
  }

  constructor(
    private fb: FormBuilder,
    private cloner: ClonerService,
    private exportAsService: ExportAsService,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.exportFormGroup = this.fb.group({
      exportMode: ['Visible'],
    });
  }

  openMenu() {
    this.showMenu = !this.showMenu;
    this.setDropdownOrientation();
  }

  setDropdownOrientation() {
    if (this.showMenu) {
      let element = document.querySelector('.super-dropdown-container') as HTMLElement;

      let w = window.innerWidth - element.offsetLeft;

      let menu = document.getElementsByClassName('extra-menu') as HTMLCollectionOf<HTMLElement>;

      if (w > 1050) {
        menu[0].style.left = '0';
        let submenu = document.getElementsByClassName('super-dropdown-submenu') as HTMLCollectionOf<
          HTMLElement
        >;
        for (const key in submenu) {
          if (Object.prototype.hasOwnProperty.call(submenu, key)) {
            const element = submenu[key];
            element.style.left = '130px';
            element.style.right = 'unset';
          }
        }

        let arrow = document.querySelector('.super-dropdown-menu-item .left-arrow') as HTMLElement;
        arrow.style.left = 'unset';
        arrow.style.right = '0px';

        let arrows = document.getElementsByClassName('left-arrow') as HTMLCollectionOf<HTMLElement>;
        for (const key in arrows) {
          if (Object.prototype.hasOwnProperty.call(arrows, key)) {
            const arrow = arrows[key];
            arrow.style.left = 'unset';
            arrow.style.right = '0px';
            arrow.style.marginLeft = '6px';
            arrow.style.transform = 'rotate(0deg)';
          }
        }

        let openedSubMenu = document.getElementsByClassName(
          'opened-submenu-item'
        ) as HTMLCollectionOf<HTMLElement>;

        for (const key in openedSubMenu) {
          if (Object.prototype.hasOwnProperty.call(openedSubMenu, key)) {
            const element = openedSubMenu[key];
            element.style.paddingLeft = '6px';
          }
        }
      } else {
        menu[0].style.left = 'unset';
        let submenu = document.getElementsByClassName('super-dropdown-submenu') as HTMLCollectionOf<
          HTMLElement
        >;
        for (const key in submenu) {
          if (Object.prototype.hasOwnProperty.call(submenu, key)) {
            const element = submenu[key];
            element.style.right = '130px';
            element.style.left = 'unset';
          }
        }

        let arrows = document.getElementsByClassName('left-arrow') as HTMLCollectionOf<HTMLElement>;
        for (const key in arrows) {
          if (Object.prototype.hasOwnProperty.call(arrows, key)) {
            const arrow = arrows[key];
            arrow.style.right = 'unset';
            arrow.style.left = '0px';
            arrow.style.marginLeft = '6px';
            arrow.style.transform = 'rotate(180deg)';
          }
        }

        let openedSubMenu = document.getElementsByClassName(
          'opened-submenu-item'
        ) as HTMLCollectionOf<HTMLElement>;

        for (const key in openedSubMenu) {
          if (Object.prototype.hasOwnProperty.call(openedSubMenu, key)) {
            const element = openedSubMenu[key];
            element.style.paddingLeft = '16px';
          }
        }
      }
    }
  }

  callAction(action: string) {
    this.actionEvent.emit(action);
  }

  showSubMenu(subMenu: string, event: any) {
    event.stopPropagation();
    if (this.subMenu === subMenu) {
      this.subMenu = '';
    } else {
      this.subMenu = subMenu;
    }

    let element = document.querySelector('.super-dropdown-container') as HTMLElement;

    let w = window.innerWidth - element.offsetLeft;

    if (w > 1050 || !this.subMenu) {
      let openedSubMenu = document.getElementsByClassName(
        'opened-submenu-item'
      ) as HTMLCollectionOf<HTMLElement>;

      for (const key in openedSubMenu) {
        if (Object.prototype.hasOwnProperty.call(openedSubMenu, key)) {
          const element = openedSubMenu[key];
          element.style.paddingLeft = '6px';
        }
      }
      this.changeRef.detectChanges();
    } else {
      this.changeRef.detectChanges();
      let openedSubMenu = document.getElementsByClassName(
        'opened-submenu-item'
      ) as HTMLCollectionOf<HTMLElement>;

      for (const key in openedSubMenu) {
        if (Object.prototype.hasOwnProperty.call(openedSubMenu, key)) {
          const element = openedSubMenu[key];
          element.style.paddingLeft = '16px';
        }
      }
    }
  }

  public onSubmitExportForm(mode: string): void {
    this.loadingItems = true;
    this.tablePrinting = true;
    this.submitted = true;
    setTimeout(() => {
      if (this.exportFormGroup.invalid) {
        return;
      }
      const exportMode = this.exportFormGroup.controls.exportMode.value;
      if (mode === 'EXCEL') {
        this.exportToExcel(exportMode);
      } else {
        this.exportToPdf(exportMode);
      }
    }, 200);
  }

  private exportToExcel(exportMode: string): void {
    this.exportColumns = this.columns.filter((c) => c.export && !c.hidden);

    let index = this.exportColumns.findIndex((c) => c.field === 'fullName');

    if (index !== -1) {
      const column = this.cloner.deepClone<TableColumnDefinition>(this.exportColumns[index]);
      column.title = 'Last Name';
      column.field = 'lastName';
      column.name = 'Last Name';
      this.exportColumns.unshift(this.cloner.deepClone<TableColumnDefinition>(column));
      column.title = 'First Name';
      column.field = 'firstName';
      column.name = 'First Name';
      this.exportColumns.unshift(this.cloner.deepClone<TableColumnDefinition>(column));
      index = this.exportColumns.findIndex((c) => c.field === 'fullName');
      this.exportColumns.splice(index, 1);
    }

    this.checkDataForExport(exportMode);
    const exportAsConfig: ExportAsConfig = {
      type: 'xlsx', // the type you want to download
      elementIdOrContent: 'exportExscel',
    };
    this.loadingItems = true;
    this.exportAsService.save(exportAsConfig, exportMode + `-${this.stateName}`).subscribe(() => {
      this.loadingItems = false;
      this.tablePrinting = false;
    });
  }

  private exportToPdf(exportMode: string): void {
    if (this.printerFriendly) {
      const data = document.getElementById('exportTruckassistTable');
      html2canvas(data, { scale: 2, backgroundColor: '#eeeeee' }).then((canvas) => {
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'px', 'letter');
        pdf.addImage(
          contentDataURL,
          'PNG',
          20,
          20,
          this.truckassistTable.nativeElement.clientWidth,
          this.truckassistTable.nativeElement.clientHeight
        );
        pdf.save(exportMode + `-${this.stateName}`);
        this.loadingItems = false;
        this.tablePrinting = false;
      });
    } else {
      const data = document.getElementById('exportTruckassistTable');
      html2canvas(data, { scale: 2, backgroundColor: '#eeeeee' }).then((canvas) => {
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'px', [
          this.truckassistTable.nativeElement.clientHeight + 40,
          this.truckassistTable.nativeElement.clientWidth + 40,
        ]);
        pdf.addImage(
          contentDataURL,
          'PNG',
          20,
          20,
          this.truckassistTable.nativeElement.clientWidth,
          this.truckassistTable.nativeElement.clientHeight
        );
        pdf.save(exportMode + `-${this.stateName}`); // Generated PDF
        this.loadingItems = false;
        this.tablePrinting = false;
      });
    }
  }

  private checkDataForExport(exportMode: string): void {
    this.export = false;
    this.exportData = [];
    this.changeRef.detectChanges();
    if (exportMode === 'Selected') {
      if (this.mySelection.length) {
        this.exportData = this.tableData
          .find((t) => t.field === this.selectedTab)
          .data.filter((d) => this.mySelection.filter((e) => e.id === d.id).length);
      } else {
        this.exportData = [];
      }
    } else if (exportMode === 'Visible') {
      this.exportData = this.viewData;
    } else {
      this.exportData = this.tableData.find((t) => t.field === this.selectedTab).data;
    }
    this.export = true;
    this.changeRef.detectChanges();
  }

  public setExportMode(exportMode: string) {
    this.exportFormGroup.controls.exportMode.setValue(exportMode);
  }

  public resetColumnState(event: any): void {
    setTimeout(() => {
      this.showResetConfirmation = false;
      this.resetColumnEvent.emit(event);
    }, 0);
  }

  public hideColumn(field: string) {
    this.hideColumnsEvent.emit(field);
  }

  public hideSubMenu(event: any) {
    this.subMenu = '';
  }

  ngOnDestroy(): void {}
}
