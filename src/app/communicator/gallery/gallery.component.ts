import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { CommunicatorService } from 'src/app/core/services/communicator.service';
import { GalleryService } from 'src/app/core/services/gallery.service';
import moment from 'moment';
import { animate, style, transition, trigger, keyframes } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { StorageService } from 'src/app/core/services/storage.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SharedService } from 'src/app/core/services/shared.service';

enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ESC = 27,
}
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition('out => in', [
        animate(
          '0.3s cubic-bezier(.35,0,.25,1)',
          keyframes([
            style({ transform: 'translateX(100%) translateY(-50%)', opacity: '0' }),
            style({ transform: 'translateX(-50%) translateY(-50%)', opacity: '1' }),
          ])
        ),
      ]),
    ]),
    trigger('outInAnimation', [
      transition('out => in', [
        animate(
          '0.3s cubic-bezier(.35,0,.25,1)',
          keyframes([
            style({ transform: 'translateX(-100%) translateY(-50%)', opacity: '0' }),
            style({ transform: 'translateX(-50%) translateY(-50%)', opacity: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class GalleryComponent implements OnInit, OnDestroy {
  moment = moment;

  @Input() visible = false;

  @ViewChild('contentContainer') contentContainerRef: ElementRef;
  @ViewChild('topImageDescription') topImageDescriptionRef: ElementRef;
  @ViewChild('bottomImageDescription') bottomImageDescriptionRef: ElementRef;

  data: any[] = null;
  selectedIndex = 0;
  currentVideoTime: number = 0.02;
  hoverData = null;
  totalPages = new Array();
  pages = new Array();

  stateAnimation: string = 'out';
  nameOfStateAnimatioN: string = '';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private galleryService: GalleryService,
    private communicatorService: CommunicatorService,
    private notification: NotificationService,
    private storageService: StorageService,
    private sharedService: SharedService,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target === this.contentContainerRef?.nativeElement ||
        e.target === this.topImageDescriptionRef?.nativeElement ||
        e.target === this.bottomImageDescriptionRef?.nativeElement
      ) {
        this.closeGallery();
      }
    });
  }

  ngOnInit() {
    this.galleryService.galleryData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { galleryItems: any[]; selectedItemIndex: number }) => {
        this.data = data.galleryItems;
        this.selectedIndex = data.selectedItemIndex;
        data.galleryItems.forEach(item => {
          if (item.extension == 'pdf') {
            this.totalPages[item.guid] = 1;
            this.pages[item.guid] = 1;
          }
        });
        if (this.galleryService.saveCurrentVideo && (this.galleryService.saveCurrentVideo.id === this.getSelectedAttachmentContent().guid)) {
          // console.log('Uspesno'); //--- do not touch this log; don't touch prekidach 'oce struja kill kill
          this.currentVideoTime = this.galleryService.saveCurrentVideo.currentTime;
          //  console.log(this.currentVideoTime + 'vreme videa iz chata'); //--- do not touch this log
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  nextIndex() {
    if (this.data?.length > 0) {
      const newIndex = this.selectedIndex + 1;
      if (newIndex === this.data?.length) {
        this.selectedIndex = 0;
        document.getElementById('boxContentContainer').scrollLeft = 0;
      } else {
        this.selectedIndex = newIndex;
        document.getElementById('boxContentContainer').scrollLeft += 120;
      }

      this.stateAnimation = 'in';
      this.nameOfStateAnimatioN = 'forward';
      this.currentVideoTime = 0.02;


    }
  }

  previousIndex() {
    if (this.data?.length > 0) {
      const newIndex = this.selectedIndex - 1;
      if (newIndex === -1) {
        this.selectedIndex = this.data.length - 1;
        document.getElementById('boxContentContainer').scrollLeft = 120 * this.data.length - 1;
      } else {
        this.selectedIndex = newIndex;
        document.getElementById('boxContentContainer').scrollLeft -= 120;
      }

      this.stateAnimation = 'in';
      this.nameOfStateAnimatioN = 'backward';
      this.currentVideoTime = 0.02;

    }
  }

  closeGallery() {
    this.galleryService.changeVisibility(false);
    this.galleryService.onCloseGallery(true);
    this.data = null;
    this.selectedIndex = 0;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == KEY_CODE.LEFT_ARROW) {
      this.previousIndex();
    } else if (event.keyCode == KEY_CODE.RIGHT_ARROW) {
      this.nextIndex();
    } else if (event.keyCode == KEY_CODE.ESC) {
      this.closeGallery();
    }
  }

  getSelectedAttachmentContent() {
    return this.data[this.selectedIndex];
  }

  getAttachmentSize(attachment: any, attachmentDivide: any) {
    return (attachment.size / attachmentDivide).toFixed(2);
  }

  deleteMedia() {
    const currentItem = this.data[this.selectedIndex];
    if (currentItem.message) {
      this.communicatorService.editMessage(
        currentItem.message.chat,
        currentItem.message.id,
        currentItem.message.content,
        [],
        [currentItem]
      );
      this.data.splice(this.selectedIndex, 1);
      if (this.selectedIndex !== 0 && this.data.length === this.selectedIndex) {
        this.selectedIndex--;
      }
      if (this.data.length === 0) {
        this.closeGallery();
      }
    } else {
      if (currentItem.url && currentItem.guid) {
        const removedFile = [
          {
            url: currentItem.url,
            guid: currentItem.guid
          }
        ];
        this.storageService.deleteFiles(removedFile).subscribe(
          (resp: any) => {
            this.notification.success('File ' + currentItem.name + ' removed.', 'Success:');
            this.sharedService.emitGalleryDelete.emit(removedFile);
          }
        ),
        (error: HttpErrorResponse) => {
          this.sharedService.handleError(error);
        };
        this.data.splice(this.data.indexOf(currentItem), 1);
      }
    }
  }

  downloadMedia() {
    const currentItem = this.data[this.selectedIndex];
    this.download(currentItem.url, currentItem.name);
  }

  isVideo(item: any) {
    let isVideo = true;
    if (!['mp4', 'wav', 'wmv', 'mov', 'flv', 'mkv', 'avi'].includes(item.extension)) {
      isVideo = false;
    }
    return isVideo;
  }

  onDoneAnimation(event) {
    if (!event.disabled && this.stateAnimation == 'in') {
      this.toggleState();
    }
  }

  toggleState() {
    this.stateAnimation === 'in' ? (this.stateAnimation = 'out') : (this.stateAnimation = 'in');
  }

  changeCurrentIndexMedia(i: number, item: any) {
    this.selectedIndex = i;
    this.currentVideoTime = 0.02;
  }

  nextPage(item: any) {
    this.pages[item.guid] = (this.pages[item.guid] == this.totalPages[item.guid]) ? this.totalPages[item.guid] : (this.pages[item.guid] + 1);
  }

  previousPage(item: any) {
    this.pages[item.guid] = (this.pages[item.guid] == 1) ? 1 : (this.pages[item.guid] - 1);
  }

  afterLoadComplete(pdfData: any, item: any) {
    this.totalPages[item.guid] = pdfData.numPages;
  }

  navigateToPage(file: any, index: number) {
    this.pages[file.guid] = index;
  }

  download(url: string, filename: string) {
    fetch(url).then(function (t) {
      return t.blob().then((b) => {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", filename);
        a.click();
      }
      );
    });
  }

}
