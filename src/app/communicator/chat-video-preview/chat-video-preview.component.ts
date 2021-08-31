import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GalleryService } from 'src/app/core/services/gallery.service';
@Component({
  selector: 'app-chat-video-preview',
  templateUrl: './chat-video-preview.component.html',
  styleUrls: ['./chat-video-preview.component.scss'],
})
export class ChatVideoPreviewComponent implements OnInit {
  @ViewChild('media') public media: ElementRef;

  @Input() video_id: any;

  @Input() displayVideo = false;
  // Video settings
  @Input() attachUrl = '';
  @Input() overlayPlay = true;
  @Input() bufferPlay = true;
  @Input() scrubBar = true;
  // Video Controls
  @Input() play = true;
  @Input() timeDisplay = true;
  @Input() mute = true;
  @Input() volume = true;
  @Input() insideScrubBar = true;
  @Input() fullScreen = true;

  // Required field
  @Input() videoTime: number = 0.02;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    this.setCurrentVideo(this.videoTime);
    this.galleryService.galleryVisibility.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.media?.nativeElement.pause();
    });

    this.galleryService.closeGallery.pipe(takeUntil(this.destroy$)).subscribe((type) => {
      if (type) {
        // console.log('GALLERY WAS CLOSED, NEW VIDEO TIME'); // --- do not touch this log
        if (
          this.galleryService.saveCurrentVideo.currentTime !== 0.02 &&
          this.galleryService.saveCurrentVideo.id === this.video_id
        ) {
          this.videoTime = this.galleryService.saveCurrentVideo.currentTime;
          this.galleryService.setCurrentVideoPlayer({
            id: this.video_id,
            currentTime: this.videoTime,
          });
          // console.log(this.videoTime); //--- do not touch this log
          this.setCurrentVideo(this.videoTime);
          this.media?.nativeElement.load();
          this.media?.nativeElement.play();
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.media) {
      return;
    }
    if (this.videoTime === 0.02) {
      this.media.nativeElement.src = changes.attachUrl.currentValue;
      this.media?.nativeElement.load();
      this.media?.nativeElement.play();
    }
  }

  setCurrentVideo(videoTime) {
    return `${this.attachUrl}#t=${videoTime}`;
  }

  getCurrentTime(event) {
    const currentTime = parseFloat(event.target.currentTime);
    this.galleryService.setCurrentVideoPlayer({
      id: this.video_id,
      currentTime: currentTime,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
