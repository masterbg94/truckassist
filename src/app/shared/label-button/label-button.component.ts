import { takeUntil } from 'rxjs/operators';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NewLabel } from 'src/app/core/model/label';
import { ContactAccountService } from 'src/app/core/services/contactaccount.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { LabelsFilterService } from '../../core/services/labels-filter.service';
import { enterLeave } from '../../core/helpers/animations';
import { tar } from 'ionic/lib/utils/archive';

@Component({
  selector: 'app-label-button',
  templateUrl: './label-button.component.html',
  styleUrls: ['./label-button.component.scss'],
  animations: [enterLeave]
})
export class LabelButtonComponent implements OnInit, OnDestroy {

  constructor(
    private contactAccountService: ContactAccountService,
    private notification: NotificationService,
    private shared: SharedService,
    private elementRef: ElementRef,
    private labelService: LabelsFilterService
  ) {
    this.innerWidth = window.innerWidth;
  }
  @Output() tagClickedEmit = new EventEmitter<any>();

  @Input() createdLabels: NewLabel[];
  @Input() type: any;
  @Input() availableColors: any;
  @Input() noLabelCount: any;
  @ViewChild('ddLabels') ddLabels: ElementRef;

  public selectedTab = 'active';
  public createLabelVisible: boolean;
  public createLabelName = '';
  public createLabelColor = '';
  labelType: string;
  innerWidth: number;
  selectedOwners = 'active';
  private destroy$: Subject<void> = new Subject<void>();
  storedFilters: NewLabel[] = [];

  public colorPalette: any = [
    '#005CD4',
    '#0080FF',
    '#50A8FF',
    '#0093CE',
    '#00ACF0',
    '#49CBFF',
    '#008C8F',
    '#00C4BB',
    '#31E5DD',
    '#009E61',
    '#00C76E',
    '#50DC96',
    '#FFE567',
    '#FFD400',
    '#FFAA00',
    '#FF7B1D',
    '#FF5C50',
    '#E61D0D',
    '#873565',
    '#CF3991',
    '#F84D9F',
    '#442265',
    '#7040A1',
    '#9842D8',
  ];
  public editableLabel: any;
  public isEdit = false;
  public allowSave = false;

  hoveredLabel: any[] = [];
  labelsToggled = false;
  hoveredFilterColor;
  hoveredFilterIndex = -1;
  noLabel: NewLabel = {
    labelName: 'No Label',
    labelId: null,
    labelCount: null,
    labelColor: '#606060'
  };

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clIn = this.ddLabels.nativeElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clIn.contains(target)) {
      this.labelsToggled = false;
    }
  }

  ngOnInit(): void {
    this.decideLabelType();
    this.shared.emitOwnerStatus
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: any) => {
        switch (res) {
          case 'active':
            this.selectedOwners = 'active';
            break;
          case 'inactive':
            this.selectedOwners = 'inactive';
            break;
          case 'all':
            this.selectedOwners = 'all';
            break;
        }
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );

    this.contactAccountService.emitAccountLabel
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (response: any) => {
        if (response.type === 'edit-label') {
          this.replaceLabelData(response);
        }
      }
    );

    this.contactAccountService.emitContactLabel
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (response: any) => {
        if (response.type === 'edit-label') {
          this.replaceLabelData(response);
        }
      }
    );
    this.initFilters();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  crateLabelForm() {
    this.createLabelVisible = !this.createLabelVisible;
  }

  cancelCreating() {
    this.createLabelVisible = !this.createLabelVisible;
    this.createLabelName = '';
    this.createLabelColor = '';
    this.allowSave = false;
    this.isEdit = false;
  }

  public setSelectedTab(tab: string): void {
    this.selectedTab = tab;
  }

  createUpdateLabel() {
    const novi = new NewLabel();
    // Salje se key/value/domain a respons je :NewLabel
    novi.key = this.createLabelName;
    novi.value = this.createLabelColor || '#606060';
    novi.domain = this.labelType;
    if (!this.isEdit) {
      this.contactAccountService.createLabel(novi)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          const emitLabel = {
            resp,
            type: 'add-label',
          };
          this.notification.success('Label added successfully.', 'Success:');
          this.emitLabel(emitLabel);
          this.createLabelVisible = false;
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    } else {
      const updateData = {
        domain: this.labelType,
        labelName: this.createLabelName,
        labelColor: this.createLabelColor,
      };
      this.contactAccountService.updateLabel(updateData, this.editableLabel.labelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          const emitLabel = {
            resp,
            type: 'edit-label',
          };
          this.notification.success('Label updated successfully', 'Success');
          this.emitLabel(emitLabel);
          this.replaceLabelData(emitLabel);
          this.createLabelVisible = false;
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    }
    this.createLabelName = '';
    this.createLabelColor = '';
  }

  decideLabelType() {
    if (this.type === 'contact') {
      this.labelType = 'companyContactLabel';
    } else if (this.type === 'account') {
      this.labelType = 'companyAccountLabel';
    }
  }

  emitLabel(x) {
    if (this.type === 'account') {
      this.contactAccountService.emitAccountLabel.emit(x);
    } else if (this.type === 'contact') {
      this.contactAccountService.emitContactLabel.emit(x);
    }
  }

  setLabelColor(x) {
    this.createLabelColor = x;
    if (this.isEdit) {
      this.allowSave = true;
    } else {
      if (this.createLabelName.length >= 2) {
        this.allowSave = true;
      } else {
        this.allowSave = false;
      }
    }
  }

  public returnUsedColor(x) {
    return this.availableColors.includes(x);
  }

  editLabel(id) {
    this.isEdit = true;
    this.editableLabel = this.createdLabels.find((x) => x.labelId === id);
    this.createLabelVisible = !this.createLabelVisible;
    this.createLabelName = this.editableLabel.labelName;
    this.createLabelColor = this.editableLabel.labelColor;
  }

  public isAllowedSave(value) {
    if (this.isEdit === false) {
      if (value.length <= 1) {
        this.allowSave = false;
      } else if (value.length >= 2 && this.createLabelColor) {
        this.allowSave = true;
      }
    } else if (this.isEdit === true) {
      if (value !== this.editableLabel.labelName) {
        this.allowSave = true;
      } else {
        this.allowSave = false;
      }
    }
  }

  deleteLabel(id) {
    this.contactAccountService.deleteLabel(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.notification.success('Label deleted', 'Success');
        const customResponse = {
          resp,
          type: 'delete-label-' + this.type
        };
        this.emitLabel(customResponse);
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  hoverFirstLabel(i) {
    this.hoveredLabel[i] = !this.hoveredLabel[i];
    if (i === 0) {
      return true;
    }
  }

  toggleLabels() {
    this.labelsToggled = !this.labelsToggled;
  }

  public initFilters(): void {
    this.storedFilters = localStorage.getItem(this.type + '_filter') ? JSON.parse(localStorage.getItem(this.type + '_filter')) : [];
    this.labelService.sendLabelData(this.storedFilters);
  }

  addLabeltoFilter(event) {
    this.returnIsDisabled(event);
    this.storedFilters.push({
      labelId: event.labelId,
      labelName: event.labelName,
      labelColor: event.labelColor,
      labelCount: event.labelCount
    });
    localStorage.setItem(this.type + '_filter', JSON.stringify(this.storedFilters));
    this.labelService.sendLabelData(this.storedFilters);
  }

  removeLabelFilter(index) {
    this.storedFilters.splice(index, 1);
    localStorage.setItem(this.type + '_filter' , JSON.stringify(this.storedFilters));
    this.labelService.sendLabelData(this.storedFilters);
    this.hoveredFilterColor = '#B7B7B7';
  }

  returnIsDisabled(x) {
    for (const label of this.storedFilters) {
      if (label.labelId === x) {
        return true;
      }
    }
  }

  returnFilterColor(x, index) {
    if (index === -1) {
      this.hoveredFilterColor = null;
      this.hoveredFilterIndex = -1;
    } else {
      this.hoveredFilterIndex = index;
      this.hoveredFilterColor = x.labelColor;
    }
  }

  replaceLabelData(data) {
    if (this.storedFilters.length && data.type === 'edit-label') {
      this.storedFilters[this.storedFilters.indexOf(this.storedFilters.find(x => x.labelId === data.resp.labelId))] = data.resp;
    }
    localStorage.setItem(this.type + '_filter' , JSON.stringify(this.storedFilters));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
