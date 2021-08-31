import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account-import',
  templateUrl: './account-import.component.html',
  styleUrls: ['./account-import.component.scss']
})
export class AccountImportComponent implements OnInit {
  public clearFiles = false;
  public files: File[] = [];

  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * Receive message function
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
    window.open('/assets/files/accounts-import-template.xlsx', '_blank');
  }
}
