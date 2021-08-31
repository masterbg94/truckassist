import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-expired-modal',
  templateUrl: './expired-modal.component.html',
  styleUrls: ['./expired-modal.component.scss'],
})
export class ExpiredModalComponent implements OnInit {
  @Input() inputData: any;

  textAlert = '';
  textNote = '';
  showAllText = false;
  buttonText = '';

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.loadInitData();
  }
  loadInitData(): void {
    this.textAlert = this.inputData.data.textAlert;
    this.textNote = this.inputData.data.textNote;
    this.buttonText = this.inputData.data.buttonText;
  }

  closeModal() {
    this.activeModal.close();
  }
}
