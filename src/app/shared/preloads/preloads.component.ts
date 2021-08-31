import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as FILE_PRELOADS from 'src/assets/utils/files-to-preload';

@Component({
  selector: 'app-preloads',
  templateUrl: './preloads.component.html',
  styleUrls: ['./preloads.component.scss']
})
export class PreloadsComponent implements OnInit {
  @ViewChild('preloads') preloads: ElementRef;
  files = FILE_PRELOADS.FILES;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.preloads.nativeElement.remove();
    }, 5000);
  }

}
