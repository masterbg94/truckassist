import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs';
import { SharedService } from '../../../core/services/shared.service';
@Component({
  selector: 'app-ta-note-container',
  templateUrl: './ta-note-container.component.html',
  styleUrls: ['./ta-note-container.component.scss'],
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
  ]
})
export class TaNoteContainerComponent implements OnInit {
  @Input() value: any;
  @Input() range: any;
  @Input() selectionTaken: any;
  @Input() selectedEditor: any;
  @Input() isExpanded: boolean;
  selectedPaternColor = '#FFFFFFF';
  showCollorPattern: boolean;
  private destroy$: Subject<void> = new Subject<void>();
  activeOptions: any = {
    bold: false,
    italic: false,
    foreColor: false,
    underline: false
  };

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.emitUpdateNoteActiveList
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      this.checkActiveItems();
    });
  }

  executeEditor(action: string, color?: string) {
    document.execCommand('styleWithCSS', false, 'true');
    if (this.range) {
        this.selectionTaken.removeAllRanges();
        this.selectionTaken.addRange(this.range);
    }
    if ( action !== 'foreColor' ) {
      this.showCollorPattern = false;
      this.activeOptions[action] = !this.activeOptions[action];
      if ( !this.activeOptions[action] ) {
        if ( this.value.replace('<br>', '') == '' ) { this.selectionTaken.removeAllRanges(); }
        document.execCommand('styleWithCSS', false, 'false');
        document.execCommand(action, false, null);
      } else {
        this.focusElement();
        document.execCommand(action, false, null);
      }
    } else {
         setTimeout(() => {

           this.focusElement();
           setTimeout(() => {
            this.focusElement();
            this.selectedPaternColor = color;
            document.execCommand('foreColor', false, color);
          });
        });
    }
  }

  focusElement(): void {
    if ( this.selectedEditor ) { this.selectedEditor.focus(); } else { document.getElementById('main_editor').focus(); }
  }

  checkActiveItems() {
    for ( const act in this.activeOptions ) {
      this.activeOptions[act] = document.queryCommandState(act);
      this.selectedPaternColor = document.queryCommandValue('ForeColor');
    }
  }

  public ngOnDestroy(): void {
    this.showCollorPattern = false;
    this.destroy$.next();
    this.destroy$.complete();
  }

}
