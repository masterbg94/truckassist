import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-close',
  templateUrl: './modal-close.component.html',
  styleUrls: ['./modal-close.component.scss']
})
export class ModalCloseComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.activeModal.close();
  }

}
