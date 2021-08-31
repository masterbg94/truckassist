import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
import { FILE_TABLES } from 'src/app/const';
import { v4 as uuidv4 } from 'uuid';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {

  attachments: any = [];
  documentsForm: FormGroup;
  subscriptions: Subscription[] = [];
  files: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private spinner: SpinnerService,
    private activeModal: NgbActiveModal,
    private shared: SharedService,
    private notification: NotificationService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
  }

  setFiles(files: any) {
    this.files = files;
  }

  closeModal() {
    this.activeModal.close();
  }

  saveDocs() {
    const companyGuid = JSON.parse(localStorage.getItem('userCompany'));
    this.storageService.uploadFiles(
      companyGuid.guid,
      FILE_TABLES.DOCUMENT,
      companyGuid.id,
      this.files
    )
    .subscribe(
      (resp: any) => {
        this.notification.success(`Attachments successfully uploaded.`, ' ');
        this.closeModal();
        this.shared.emitGetDocuments.emit();
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }
}
