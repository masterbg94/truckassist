import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-save',
  templateUrl: './modal-save.component.html',
  styleUrls: ['./modal-save.component.scss']
})
export class ModalSaveComponent implements OnInit {

  @Output() onSaveEmit = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  save() {
    this.onSaveEmit.emit();
  }
}
