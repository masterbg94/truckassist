import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-expired-second-modal',
  templateUrl: './expired-second-modal.component.html',
  styleUrls: ['./expired-second-modal.component.scss']
})
export class ExpiredSecondModalComponent {

  constructor(private activeModal: NgbActiveModal) {
  }

  closeModal() {
    this.activeModal.close();
  }
}
