import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from '../../core/services/shared.service';
import { Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-ta-note',
  templateUrl: './ta-note.component.html',
  styleUrls: ['./ta-note.component.scss'],
  animations: [
    trigger('pickupAnimation', [
      transition(':enter', [
        style({ height: 10 }),
        animate('100ms', style({ height: '*' })),
      ]),
      transition(':leave', [
        animate('50ms', style({ height: 0 })),
      ]),
    ]),
    trigger('noteLongAnimation', [
      transition(':enter', [
        style({ width: 10 }),
        animate('100ms', style({ width: '*' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ width: 0 })),
      ]),
    ])
  ]
})
export class TaNoteComponent implements OnInit, OnDestroy {
  constructor(private sharedService: SharedService) {}
  private destroy$: Subject<void> = new Subject<void>();
  @Input() note: any;
  @Input() openAllNotesText: any;
  @ViewChild('t2') t2: any;
  tooltip: any;
  showCollorPattern: boolean;
  buttonsExpanded = false;
  isExpanded = false;
  editorDoc: any;
  value = '';
  selectedPaternColor = '#FFFFFFF';
  activeOptions: any = {
    bold: false,
    italic: false,
    foreColor: false,
    underline: false
  };


  @Output() saveNoteValue = new EventEmitter();
  openedAll: boolean;
  leaveThisOpened: boolean;

  selectionTaken: any;
  range: any;

  ngOnInit(): void {
    this.sharedService.emitCloseNote
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      if ( !window.getSelection().toString() ) {
        if (this.tooltip !== undefined && res && !this.openedAll) {
          if (this.tooltip.isOpen() && this.isExpanded) {
            this.value = this.value == '' ? this.note : this.value;
            this.saveNote();
          }
          this.tooltip.close();
          this.isExpanded = false;
          this.showCollorPattern = false;
          setTimeout(() => {
            this.buttonsExpanded = false;
          }, 200);
        }
      }
    });

    this.sharedService.emitAllNoteOpened
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      if ( res ) {
        if ( this.note ) {
          this.openedAll = true;
          this.isExpanded = false;
          this.buttonsExpanded = false;
          this.t2.open();
        }
      } else if (!this.leaveThisOpened) {
        this.openedAll = false;
        this.t2.close();
        this.isExpanded = false;
        this.buttonsExpanded = false;
      } else { this.leaveThisOpened = false; }
    });
  }

  checkFocus(e) {
    if (!this.isExpanded) {
      this.openedAll = false;
      this.leaveThisOpened = true;
      this.sharedService.emitAllNoteOpened.next(false);
      this.isExpanded = true;
      setTimeout(() => {
        this.buttonsExpanded = true;
        this.checkActiveItems();
      }, 150);
    }
  }

  toggleNote(tooltip: any, data: any) {
    this.tooltip = tooltip;
    if (tooltip.isOpen()) {
      if ( this.openedAll ) {
        this.leaveThisOpened = true;
        this.openedAll = false;
        this.sharedService.emitAllNoteOpened.next(false);
      } else if (!this.isExpanded) {
        this.leaveThisOpened = false;
        this.checkActiveItems();
        this.isExpanded = true;
        this.buttonsExpanded = true;
      } else {
        this.isExpanded = false;
        this.buttonsExpanded = false;
        this.leaveThisOpened = false;
        tooltip.close();
      }
      this.showCollorPattern = false;
    } else {
      if ( !data || data == '' ) {
        this.buttonsExpanded = true;
        this.isExpanded = true;
      }
      this.leaveThisOpened = true;
      this.sharedService.emitAllNoteOpened.next(false);
      tooltip.open({ data });
    }
  }

  editorClick(event) {
    if (event.target.innerText === 'Take a note...') {
      event.target.innerText = '';
    }
  }

  prepareForTextRange() {
    this.selectionTaken = window.getSelection();
    if (this.selectionTaken.rangeCount && this.selectionTaken.getRangeAt) {
      this.range = this.selectionTaken.getRangeAt(0);
    }
  }

  preventMouseDown(ev) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  valueChange(event) {
    this.value = event;
    this.checkActiveItems();
  }

  checkActiveItems() {
    this.sharedService.emitUpdateNoteActiveList.next();
  }

  saveNote() {
    this.leaveThisOpened = false;
    this.showCollorPattern = false;
    this.isExpanded = false;
    this.buttonsExpanded = false;
    if ( this.t2 ) { this.t2.close(); }
    if (this.value == '<br>') { this.value = this.value.replace('<br>', ''); }
    this.saveNoteValue.emit(this.value);
  }

  closeNote() {
    this.leaveThisOpened = false;
    this.showCollorPattern = false;
    this.isExpanded = false;
    this.buttonsExpanded = false;
    if ( this.t2 ) { this.t2.close(); }
  }

  public ngOnDestroy(): void {
    this.leaveThisOpened = false;
    this.showCollorPattern = false;
    this.destroy$.next();
    this.destroy$.complete();
  }
}
