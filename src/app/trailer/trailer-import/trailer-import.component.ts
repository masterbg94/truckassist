import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-trailer-import',
  templateUrl: './trailer-import.component.html',
  styleUrls: ['./trailer-import.component.scss'],
})
export class TrailerImportComponent implements OnInit {
  clearFiles = false;
  files: File[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private trailerService: AppTrailerService,
    private shared: SharedService
  ) {}

  ngOnInit(): void {}

  receiveMessage($event: any) {
    this.files = $event;
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }

  public trailersImport() {
    const files = {
      'files[]': this.files,
    };
    const trailers = JSON.stringify({ ...files });
    // this.trailerService.trailersImport(trailers).subscribe(
    //   (resp: any) => {},
    //   (error: any) => {
    //     this.shared.handleServerError();
    //   }
    // );
  }

  public getTemplate(): void {
    window.open('/assets/files/trailers-import-template.xlsx', '_blank');
  }
}
