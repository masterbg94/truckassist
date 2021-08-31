import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, Output } from '@angular/core';
import * as Croppie from 'croppie';
import { CroppieDirective } from 'angular-croppie-module';
import { Options } from 'ng5-slider';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss'],
})
export class EditImageComponent implements AfterViewInit {
  @Output()
  saveAvatar: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  cancel: EventEmitter<string> = new EventEmitter<string>();
  // croppie
  public croppedImage = '';
  @ViewChild('croppie')
  public croppieDirective: CroppieDirective | any;
  public croppieOptions: Croppie.CroppieOptions = {
    enableExif: true,
    viewport: {
      width: 62,
      height: 77,
      type: 'square',
    },
    boundary: {
      width: 300,
      height: 150,
    }
  };
  // dropzone
  public showDropzone = true;
  public uploadedImageFile: any = null;
  public files: File[] = [];
  // slider
  public slideInit = 0.75;
  public options: Options = {
    floor: 0,
    ceil: 1.5,
    step: 0.0001,
    animate: false,
    showSelectionBar: true,
    hideLimitLabels: true,
  };
  public scale = 0.75;

  public ngAfterViewInit() {}

  onSelect(event: any) {
    document.getElementById('image-upload-wrapper').classList.add('file-dropped');
    setTimeout(() => {
      this.files.push(...event.addedFiles);

      const file = this.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.croppieDirective.croppie.bind({
          url: reader.result as string,
          points: [188, 101, 260, 191],
          zoom: this.scale,
        });
        this.showDropzone = false;
        document.getElementById('image-upload-wrapper').classList.remove('file-dropped');
      };
    }, 1000);
  }

  public handleUpdate(event) {
    this.slideInit = event.zoom;
  }

  public zooming(event: any) {
    this.scale = event ? event : 0.1;
    this.croppieDirective.croppie.setZoom(this.scale);
  }

  public saveImage() {
    this.croppieDirective.croppie.result('base64').then((base64) => {
      this.croppedImage = base64;
      this.saveAvatar.emit(base64);
    });
  }

  public onRemove() {
    this.files = [];
    this.showDropzone = true;
    this.cancel.emit();
  }
}
