import { Component, OnInit, Output, Input, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-app-upload-excel',
  templateUrl: './app-upload-excel.component.html',
  styleUrls: ['./app-upload-excel.component.scss'],
})
export class AppUploadExcelComponent implements OnInit, OnChanges {
  files: File[] = [];
  @Output() filesEvent = new EventEmitter<File[]>();
  @Input() clearFiles: boolean;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.clearFiles) {
      this.files = [];
    }
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    this.filesEvent.emit(this.files);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
