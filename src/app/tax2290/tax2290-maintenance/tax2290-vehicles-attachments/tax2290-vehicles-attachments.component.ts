import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tax2290-vehicles-attachments',
  templateUrl: './tax2290-vehicles-attachments.component.html',
  styleUrls: ['./tax2290-vehicles-attachments.component.scss']
})
export class Tax2290VehiclesAttachmentsComponent implements OnInit {
  @Input() numberOfPreviousEnteredVehicles: number = 0;
  @Output() numberOfAttachments = new EventEmitter<number>()
  public showQuestionContainer: boolean = false;
  public attachments = [];
  constructor() { }

  ngOnInit(): void {
    this.numberOfAttachments.emit(this.attachments.length)
  }

  addAttachments() {
    alert('Add attachments')
  }

  replaceAttachments() {
    alert('Replace old attachments')
  }

  toggleQuestionDialog(popover) {
    if(this.numberOfPreviousEnteredVehicles === 0) {
      alert('Action')
      return
    }
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open();
    }
  }
}
