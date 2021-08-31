import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-driver-import',
  templateUrl: './driver-import.component.html',
  styleUrls: ['./driver-import.component.scss'],
})
export class DriverImportComponent implements OnInit {
  clearFiles = false;
  files: File[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private driverService: AppDriverService,
    private shared: SharedService
  ) {}

  ngOnInit(): void {}

  receiveMessage($event: any) {
    this.files = $event;
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }

  public driversImport() {
    const files = {
      'files[]': this.files,
    };
    const drivers = JSON.stringify({ ...files });
    // this.driverService.driversImport(drivers).subscribe(
    //   (resp: any) => {},
    //   (error: any) => {
    //     this.shared.handleServerError();
    //   }
    // );
  }

  public getTemplate(): void {
    window.open('/assets/files/drivers-import-template.xlsx', '_blank');
  }
}
