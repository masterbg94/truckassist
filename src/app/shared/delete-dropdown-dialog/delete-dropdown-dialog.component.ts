import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete-dropdown-dialog',
  templateUrl: './delete-dropdown-dialog.component.html',
  styleUrls: ['./delete-dropdown-dialog.component.scss']
})
export class DeleteDropdownDialogComponent implements OnInit {
  @Output() actionEvent: EventEmitter<boolean> = new EventEmitter();
  @Input() dialog: string;

  constructor() { }

  ngOnInit(): void {
  }


  onSelectOption(canDelete: boolean) {
    if (canDelete) {
      this.actionEvent.emit(true);
    } else {
      this.actionEvent.emit(false);
    }
  }
}
