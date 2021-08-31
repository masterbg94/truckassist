import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-successful-subscibing-modal',
  templateUrl: './successful-subscibing-modal.component.html',
  styleUrls: ['./successful-subscibing-modal.component.scss']
})
export class SuccessfulSubscibingModalComponent {

  constructor(private activeModal: NgbActiveModal, private router: Router) {
  }

  closeModal() {
    this.activeModal.close();
  }

  backToHome() {
    this.closeModal();
    this.router.navigate(['/']);
  }
}
