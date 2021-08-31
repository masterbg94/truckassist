import { Component, OnInit } from '@angular/core';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { AddDocumentComponent } from 'src/app/company/app-company-document/add-document/add-document.component';
import { SharedService } from 'src/app/core/services/shared.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-app-company-document',
  templateUrl: './app-company-document.component.html',
  styleUrls: ['./app-company-document.component.scss']
})
export class AppCompanyDocumentComponent implements OnInit {

  documents: any[] = [];
  files: any[] = [];

  constructor(
    private customModalService: CustomModalService,
    private sharedService: SharedService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.getDocuments();
    this.sharedService.emitGetDocuments.subscribe(
      () => {
        this.getDocuments();
      }
    );
  }

  handleFiles() {
    this.documents && this.documents.forEach((element: any) => {
      const urlToObject = async () => {
        const response = await fetch(element.url);
        // here image is url/location of image
        const blob = await response.blob();
        const file: any = new File([blob], element.fileName, { type: blob.type });

        file.fileType = (file.type == 'application/pdf') ? 'pdf' : 'img';
        file.fileItemGuid = element.fileItemGuid ? element.fileItemGuid : null;
        file.url = element.url ? element.url : null;

        this.files.push(file);
        // emit frontend files
      };
      urlToObject();
    });
  }

  getDocuments() {
    this.storageService.getDocuments().subscribe(
      (resp: any) => {
        this.files = [];
        this.documents = [];
        this.documents = resp;
        if (resp.length > 0) {
          this.handleFiles();
        }
      },
      (error: HttpErrorResponse) => {
        this.sharedService.handleError(error);
      }
    );
  }

  addDocuments() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(AddDocumentComponent, { data }, null, { size: 'small' });
  }

  deleteDocument(index: number) {
  }

}
