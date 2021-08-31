import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(
        ':enter',
        [
          style({ height: 0, opacity: 0 }),
          animate('0.1s ease-out',
                  style({ height: 188, opacity: 1 }))
        ]
      ),
      transition(
        ':leave',
        [
          style({ height: 188, opacity: 1 }),
          animate('0.1s ease-in',
            style({ height: 0, opacity: 0 }))
        ]
      )
    ])
  ]
})

export class AttachmentsComponent implements OnInit {

  @Input() page: string;
  @Input() attachments: any;
  @Output() filesChanged = new EventEmitter<any>();
  @Input() commentsVisible: boolean;

  uploadVisible = false;
  files: File[] = [];
  clearFiles = false;
  showUpload = false;

  sanitizedAttachments: any = [];

  constructor(
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.attachments.forEach(file => {
      if (this.sharedService.fileSanityCheck(file.url)) {
        this.sanitizedAttachments.push(file)
      }
    });

    if (this.sanitizedAttachments && this.sanitizedAttachments.length || this.page == 'load') {
      setTimeout(() => {
        this.showUpload = true;
      }, 1000);
    }

    if (this.page == 'document') {
      setTimeout(() => {
        this.showUpload = true;
      }, 250);
    }
  }

  ngOnChanges(): void {
  }

  receiveMessage($event: any) {
    this.files = $event;
    this.tobase64Handler($event).then(
      (files: any) => {
        this.filesChanged.emit(files);
      }
    );
  }

  toggleUpload() {
    this.uploadVisible = !this.uploadVisible;
    if (this.uploadVisible) {
      this.showUpload = true;
    } else {
      this.showUpload = false;
    }
  }

  toBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({
        fileName: file.name,
        base64Content: reader.result.toString().split(',')[1],
        url: file.url,
      });
      reader.onerror = error => reject(error);
    });
  }

  async tobase64Handler(files: any) {
    const filePromises = [];
    files.forEach((file: File) => {
      filePromises.push(this.toBase64(file));
    });
    const allFiles = await Promise.all(filePromises);
    return allFiles;
  }
}
