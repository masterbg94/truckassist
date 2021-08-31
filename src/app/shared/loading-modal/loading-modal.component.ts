import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html'
})
export class LoadingModalComponent implements OnInit {
  @Input() size: string;
  constructor() { }

  ngOnInit() {
  }

}
