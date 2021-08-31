import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private visibleGallerySubject = new BehaviorSubject<boolean>(false);
  private galleryDataSubject = new Subject<{ galleryItems: any[]; selectedItemIndex: number }>();
  private currentVideoSubject = new BehaviorSubject<{ id: string; currentTime: number }>(null);
  private closingGallery = new Subject<boolean>();

  saveCurrentVideo: any;

  get galleryVisibility() {
    return this.visibleGallerySubject.asObservable();
  }

  get galleryData() {
    return this.galleryDataSubject.asObservable();
  }

  get currentVideo() {
    return this.currentVideoSubject.asObservable();
  }

  get closeGallery() {
    return this.closingGallery.asObservable();
  }

  changeVisibility(visibility: boolean) {
    this.visibleGallerySubject.next(visibility);
  }

  pushGalleryData(data: { galleryItems: any[]; selectedItemIndex: number }) {
    this.galleryDataSubject.next(data);
  }

  setCurrentVideoPlayer(data: { id: string; currentTime: number }) {
   // console.log('FROM SERVICE GALLERY'); //-- do not touch this log
   // console.log(data); //-- do not touch this log
    this.saveCurrentVideo = data;
    this.currentVideoSubject.next(data);
  }

  onCloseGallery(type: boolean) {
    this.closingGallery.next(type);
  }
}
