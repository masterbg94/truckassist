import { takeUntil } from 'rxjs/operators';
import { WysiwygService } from './../../../services/app-wysiwyg.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-note-sidebar-contents',
  templateUrl: './note-sidebar-contents.component.html',
  styleUrls: ['./note-sidebar-contents.component.scss']
})
export class NoteSidebarContentsComponent implements OnInit, OnDestroy {
  @ViewChild('editContainer') editContainer: ElementRef;
  private destroy$: Subject<void> = new Subject<void>();
  @Input() note: any;
  @Output() updateNote = new EventEmitter<any>();
  @Output() onFocus = new EventEmitter<any>();
  @Output() onBlur = new EventEmitter<any>();
  @Output() onClick = new EventEmitter<any>();
  @Input() index: number;
  @Input() insideHeight: number;


  noteValue: any;
  constructor(
    public wysywygservice: WysiwygService
  ) { }

  ngOnInit(): void {
    this.noteValue = this.note;
    this.wysywygservice.updateField
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      const wisywygData = this.editContainer.nativeElement.innerHTML;
      this.updateNote.emit({ e: wisywygData , indx: this.index});
    });
  }

  focusElement(e): void {
    this.onFocus.emit(e);
  }

  blurElement(e): void {
    this.onBlur.emit(e);
  }

  updateNoteMain(e): void {
    this.updateNote.emit({ e, indx: this.index});
  }

  clickOnEvent(): void {
    this.onClick.emit();
  }

  triggeRelect(): void {
    alert(3);
  }

  @HostListener('document:select', ['$event'])
  public onSelect(target) {
    console.log('select');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
