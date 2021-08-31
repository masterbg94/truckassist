import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppLoadService } from 'src/app/core/services/app-load.service';

@Component({
  selector: 'app-load-import',
  templateUrl: './load-import.component.html',
  styleUrls: ['./load-import.component.scss'],
})
export class LoadImportComponent implements OnInit {
  clearFiles = false;
  files: File[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private loadService: AppLoadService,
    private shared: SharedService
  ) {}

  ngOnInit(): void {}

  receiveMessage($event: any) {
    this.files = $event;
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }

  public loadsImport() {
    const files = {
      'files[]': this.files,
    };
    const loads = JSON.stringify({ ...files });
    // this.loadService.loadsImport(loads).subscribe(
    //   (resp: any) => {},
    //   (error: any) => {
    //     this.shared.handleServerError();
    //   }
    // );
  }

  public getTemplate(): void {
    window.open('/assets/files/loads-import-template.xlsx', '_blank');
  }
}
