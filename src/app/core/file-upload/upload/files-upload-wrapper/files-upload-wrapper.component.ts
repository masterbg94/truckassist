import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-files-upload-wrapper',
  templateUrl: './files-upload-wrapper.component.html',
  styleUrls: ['./files-upload-wrapper.component.scss']
})
export class FilesUploadWrapperComponent implements OnInit, OnChanges {
  @Input() clearFiles: boolean;
  @Input() file: any;
  @Input() slideIndex: number;
  @Output() fileRemoved = new EventEmitter();
  @Output() removeFile: EventEmitter<File>;
    public files: File[] = [];
  public extension: string;
  fileBase64 = '';
  totalPages: number;
  page: number = 1;

  constructor(
    private shared: SharedService,
    private storageService: StorageService,
    private notification: NotificationService
  ) {
    this.removeFile = new EventEmitter();
  }

  getBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      const a = document.createElement('a');
      a.href = reader.result.toString();
      a.download = file.name; // File name Here
      a.click();
    };
    reader.onerror = function(error) {
      console.log('Error: ', error);
    };
 }

 toBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  _base64ToArrayBuffer(base64) {
	  var binary_string = base64.replace(/\\n/g, '');
    binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  ngOnInit(): void {
    if (this.file.fileType == 'pdf') {
    this.toBase64(this.file).then((base64: any) => {
      this.fileBase64 = base64;
    });
    }
    this.extension = this.file.name.split('.').pop();

  }

  ngOnChanges() {
    if (this.clearFiles) {
      this.files = [];
    }
  }

  /**
   * On remove function
   * @param file Any
   */
  public onRemove(file: any) {
    if (file.url && file.fileItemGuid) {
      const removedFile = [
        {
          url: file.url,
          guid: file.fileItemGuid
        }
      ];
      this.storageService.deleteFiles(removedFile).subscribe(
        (resp: any) => {
          this.notification.success('File ' + file.name + ' removed.', 'Success:');
          this.shared.emitDeleteFiles.emit(resp);
        }
      ),
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      };
    }
    this.fileRemoved.emit(file);
  }

  /**
   * Remove pdf function
   *
   * @param file File
   */
  public removePdf(file: File) {
    this.removeFile.emit(file);
  }

  public downloadPdf(file: any) {
    this.getBase64(file);
  }

  nextPage() {
    this.page = (this.page == this.totalPages) ? this.totalPages : (this.page + 1);
  }

  previousPage() {
    this.page = (this.page == 1) ? 1 : (this.page - 1);
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
  }
}
