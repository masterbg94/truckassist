import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-truck-import',
  templateUrl: './truck-import.component.html',
  styleUrls: ['./truck-import.component.scss'],
})
export class TruckImportComponent implements OnInit {
  clearFiles = false;
  files: File[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private truckService: AppTruckService,
    private shared: SharedService
  ) {}

  ngOnInit(): void {}

  receiveMessage($event: any) {
    this.files = $event;
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }

  public trucksImport() {
    const files = {
      'files[]': this.files,
    };
    const trucks = JSON.stringify({ ...files });
    // this.truckService.trucksImport(trucks).subscribe(
    //   (resp: any) => {},
    //   (error: any) => {
    //     this.shared.handleServerError();
    //   }
    // );
  }

  public getTemplate(): void {
    window.open('/assets/files/trucks-import-template.xlsx', '_blank');
  }
}
