import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-import',
  templateUrl: './contact-import.component.html',
  styleUrls: ['./contact-import.component.scss']
})
export class ContactImportComponent {
  public clearFiles = false;
  private files: any;

  constructor(private activeModal: NgbActiveModal) {
  }

  /**
   * Receive messages function
   *
   * @param $event Any
   */
  public receiveMessage($event: any) {
    this.files = $event;
  }

  /**
   * Close modal function
   */
  public closeModal(): void {
    this.activeModal.dismiss();
  }

  /**
   * Get template function
   */
  public getTemplate(): void {
    window.open('/assets/files/contacts-import-template.xlsx', '_blank');
  }
}
