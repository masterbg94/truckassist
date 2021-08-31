import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnd } from '@angular/cdk/drag-drop';
import { CustomWysiwygEditorComponent } from '../../../shared/custom-wysiwyg-editor/custom-wysiwyg-editor.component';
import { Wysiwig } from '../../model/wysiwig';
@Component({
  selector: 'app-note-sidebar',
  templateUrl: './note-sidebar.component.html',
  styleUrls: ['./note-sidebar.component.scss']
})
export class NoteSidebarComponent implements OnInit {

  constructor() { }

  get randomGroupId(): number {
    return parseInt(`${Math.floor((Math.random() * 1000000) + 1)}${new Date().getTime()}`);
  }
  @ViewChild(CustomWysiwygEditorComponent) cystomWysywygEditor: CustomWysiwygEditorComponent;
  tooltip: any;
  colorPalete: any[] = ['#7040A1', '#009E61', '#FF5C50', '#00ACF0', '#FFAA00', '#919191', '#9842D8', '#00C76E', '#FF7B1D', '#49CBFF', '#50DC96', '#D1D1D1', '#FFD400', '#31E5DD'];
  noteGroups: any[] = localStorage.getItem('noteSavedList') ? JSON.parse(localStorage.getItem('noteSavedList')) : [{ id: (new Date().getTime()), name: `Group 1`, notes: [] } ];
  noteGroupsTransfered: any = localStorage.getItem('noteSavedListOutside') ? JSON.parse(localStorage.getItem('noteSavedListOutside')) : [];
  editedTextModel: string;
  noteGroupEditIndex = -1;
  isDraggableStarted: any;

  activeGroup = 0;
  sidebarWidth: number = localStorage.getItem('sidebarWidth') ? parseInt(localStorage.getItem('sidebarWidth')) : 528;
  canResize: any;
  outsideResize: any;
  showScrollButtons = false;
  onOpenedDropdown = false;
  confirmDelete = false;
  openedItem = false;
  selectedEditor: HTMLAnchorElement;
  range: any;
  wysiwigSettings: Wysiwig = {
    fontFamily: true,
    fontSize: true,
    colorPicker: true,
    textTransform: true,
    textAligment: true,
    textIndent: true,
    textLists: true
  };

  outsideTooltip = false;

  menuOpened: boolean;

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-medical',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-note-type',
      type: 'note',
      text: 'Are you sure you want to delete note?',
    },
  };

  outsideIndex: number;
  noteMainIndex: number;
  noteMainResize: any;

  scrollReisizeTimer: any;

  ngOnInit(): void {
    setTimeout(() => {
      this.checkScrollButtons();
    }, 1000);
  }

  onFocus(e): void {
    setTimeout(() => {
      this.cystomWysywygEditor.checkActiveItems();
    }, 100);

    this.selectedEditor = e.target;
  }

  clickInsideContainer(): void {
    setTimeout(() => {
      this.cystomWysywygEditor.checkActiveItems();
    }, 100);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.isDraggableStarted = false;
    this.saveNoteStorages();
  }

  prepareForTextRange() {
    const selectionTaken = window.getSelection();
    if ( selectionTaken.rangeCount && selectionTaken.getRangeAt) {
      this.range = selectionTaken.getRangeAt(0);
    }
  }

  openTooltip(tooltip: any, indx: number, isOutside: boolean = false): void {
    this.outsideTooltip = isOutside;
    this.tooltip = tooltip;
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ data: indx });
    }
  }

  onDrop(event: CdkDragDrop<string[]>, type?: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.isDraggableStarted = false;
    // moveItemInArray(this.noteGroups[this.activeGroup]['notes'], event.previousIndex, event.currentIndex);
    this.saveNoteStorages();
  }

  hidePopover(): void {
    this.confirmDelete = false;
  }

  openDeleteConfirm(): void {
    this.confirmDelete = true;
  }

  enterList = (e) => {
    this.isDraggableStarted = true;
    return true;
  }

  deleteItem(indx: number): void {
    this.noteGroups.splice(indx, 1);
    this.activeGroup = this.noteGroups.length - 1;
    this.confirmDelete = false;
    localStorage.setItem('noteSavedList', JSON.stringify(this.noteGroups));
  }

  deleteNoteItem(indx: number): void {
    if ( this.outsideTooltip ) {
      this.noteGroupsTransfered.splice(indx, 1);
    } else {
      this.noteGroups[this.activeGroup].notes.splice(indx, 1);
    }
    this.confirmDelete = false;
    this.saveNoteStorages();
  }

  rejectConfirm(): void {
    this.confirmDelete = false;
    if ( this.tooltip ) { this.tooltip.close(); }
  }

  openEdit(indx: any): void {
    this.editedTextModel = this.noteGroups[indx].name;
    this.noteGroupEditIndex = indx;
  }

  openEditNote(indx: any): void {
    if ( this.outsideTooltip ) {
      this.editedTextModel = this.noteGroupsTransfered[indx].name;
      this.noteGroupsTransfered[indx].edit = true;
    } else {
      this.editedTextModel = this.noteGroups[this.activeGroup].notes[indx].name;
      this.noteGroups[this.activeGroup].notes[indx].edit = true;
    }

  }

  saveEdit(indx: number): void {
    if ( !this.editedTextModel ) { return; }
    this.noteGroups[indx].name = this.editedTextModel;
    this.editedTextModel = '';
    this.noteGroupEditIndex = -1;
    localStorage.setItem('noteSavedList', JSON.stringify(this.noteGroups));
  }

  closeEdit(): void {
    this.editedTextModel = '';
    this.noteGroupEditIndex = -1;
  }

  closeNoteEdit(indx: number): void {
    if ( this.outsideTooltip ) {
      this.noteGroupsTransfered[indx].edit = false;
    } else {
    this.noteGroups[this.activeGroup].notes[indx].edit = false;
    }
  }

  saveNoteEdit(indx: number): void {
    if ( this.outsideTooltip ) {
      this.noteGroupsTransfered[indx].edit = false;
      this.noteGroupsTransfered[indx].name = this.editedTextModel;
    } else {
      this.noteGroups[this.activeGroup].notes[indx].edit = false;
      this.noteGroups[this.activeGroup].notes[indx].name = this.editedTextModel;
    }
    this.editedTextModel = '';
    this.saveNoteStorages();
  }

  addNoteToActiveFile(): void {
    if ( this.activeGroup > -1 ) {
      this.noteGroups[this.activeGroup].notes.push({
        name: `Note ${this.noteGroups[this.activeGroup].notes.length + 1}`,
        parentIndex: this.activeGroup,
        note: '',
        edit: false,
        dragPosition: { x: 550, y: 20 },
        outsideWidth: 400
      });

      localStorage.setItem('noteSavedList', JSON.stringify(this.noteGroups));
    }
  }

  dragEndedTest($event: CdkDragEnd): void {

  }

  dragEnded($event: CdkDragEnd, numb): void {
    this.noteGroupsTransfered[numb].dragPosition = $event.source.getFreeDragPosition();
    this.saveNoteStorages();
  }

  updateNote({e, indx}): void {
    this.cystomWysywygEditor.checkActiveItems();
    this.noteGroups[this.activeGroup].notes[indx].note = e.target ? e.target.innerHTML : e;
    localStorage.setItem('noteSavedList', JSON.stringify(this.noteGroups));
  }

  addNewGroup(): void {
    this.noteGroups.push({
      id: this.randomGroupId,
      name: `Group ${this.noteGroups.length + 1}`,
      notes: []
    });

    this.editedTextModel = '';
    localStorage.setItem('noteSavedList', JSON.stringify(this.noteGroups));
   // this.noteGroupEditIndex = this.noteGroups.length -1;
    this.activeGroup = this.noteGroups.length - 1;
    setTimeout(() => {
      this.checkScrollButtons(true);
    }, 400);
  }

  setActiveItem(indx: number): void {
    this.activeGroup = indx;
  }

  moveScroll(dir: string): void {
    const scrollItem = document.querySelector('.type-main-holder');
    if ( dir == 'next' ) { scrollItem.scrollLeft += 150; } else { scrollItem.scrollLeft -= 150; }
  }

  checkScrollButtons(afterAdd?: boolean): void {
    const noteHolder = document.querySelector('.type-main-holder');
    if ( afterAdd ) {noteHolder.scrollLeft = noteHolder.scrollWidth; } else {
      if (noteHolder.scrollLeft != 0) { noteHolder.scrollLeft = 0; }
    }
    setTimeout(() => {
      if ( noteHolder.scrollWidth > noteHolder.clientWidth ) { this.showScrollButtons = true; } else { this.showScrollButtons = false; }
    }, 0);
  }

  openSidebar(): void {
    this.menuOpened = !this.menuOpened;
    document.getElementById('noteSidebar').classList.toggle('opened');
  }



  // startMouseMove(e): void{
  //   if( this.canResize ){
  //     if( e.pageX > 386 && e.pageX < 701 )this.sidebarWidth = e.pageX;
  //     this.checkScrollButtons();
  //   }
  // }

  registerMouseMove(): void {
    this.canResize = true;
  }
  unregisterMouseMove(): void {
    this.canResize = false;
  }

  registerOutsideMouseMove(e, indx: number): void {
    e.stopPropagation();
    this.outsideIndex = indx;
    setTimeout(() => {
      this.outsideResize = e.target.parentNode;
    });

  }
  unregisterOutsideMouseMove(): void {
    this.outsideResize = false;
    this.removeWindowSelections();
  }

  registerNoteResize(e, indx: number): void {
    e.stopPropagation();
    this.noteMainIndex = indx;
    this.noteMainResize = e.target.parentNode;
  }

  removeWindowSelections() {
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    }
  }

  unregisterNoteResize(): void {
    this.noteMainResize = false;
  }

  @HostListener('document:mouseup', ['$event'])
  handleMouseUp(event: any) {
    if ( this.canResize
        || this.outsideResize
        || this.noteMainResize
      ) {
        this.removeWindowSelections();
      }

    this.canResize = false;
    this.outsideResize = false;
    this.noteMainResize = false;
  }
  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(e: any) {
    if ( this.canResize ) {
      e.preventDefault();
      if ( e.pageX > 386 && e.pageX < 701 ) {this.sidebarWidth = e.pageX; }
      localStorage.setItem('sidebarWidth', this.sidebarWidth.toString());

      clearInterval(this.scrollReisizeTimer);
      this.scrollReisizeTimer = setTimeout(() => {
        this.checkScrollButtons();
      }, 500);
    }
    if (this.outsideResize) {
      const outsideMainElement = this.outsideResize;
      const selectedElement = outsideMainElement.getBoundingClientRect();

      const outsideWidth = e.pageX - selectedElement.left;
      const outsideHeight = e.pageY - selectedElement.top - 35;

      this.noteGroupsTransfered[this.outsideIndex].outsideWidth = outsideWidth;
      this.noteGroupsTransfered[this.outsideIndex].outsideHeight = outsideHeight;
      this.saveNoteStorages();
    }


    if (this.noteMainResize) {
      const outsideMainElement = this.noteMainResize;
      const selectedElement = outsideMainElement.getBoundingClientRect();

      const outsideHeight = e.pageY - selectedElement.top - 10;
      this.noteGroups[this.activeGroup].notes[this.noteMainIndex].insideHeight = outsideHeight;
      this.saveNoteStorages();
    }
  }

  moveNoteToGroup(group: any, indx: number): void {
    const groupWithId = this.noteGroups.findIndex(item => item.id == group.id);
    const deletedNote = this.noteGroups[this.activeGroup].notes.splice(0, 1);
    deletedNote[0].parentIndex = groupWithId;
    this.noteGroups[groupWithId].notes.push(JSON.parse(JSON.stringify(deletedNote[0])));
    this.openedItem = false;
    this.saveNoteStorages();
  }

  removeFromOutside(item: any, indx: number): void {
    const deletedNote = this.noteGroupsTransfered.splice(indx, 1);
    deletedNote[0].dragPosition =  { x: 550, y: 20 };
    this.noteGroups[item.parentIndex].notes.push(deletedNote[0]);
    this.saveNoteStorages();
  }

  saveNoteStorages(): void {
    localStorage.setItem('noteSavedListOutside', JSON.stringify(this.noteGroupsTransfered));
    localStorage.setItem('noteSavedList', JSON.stringify(this.noteGroups));
  }

}
