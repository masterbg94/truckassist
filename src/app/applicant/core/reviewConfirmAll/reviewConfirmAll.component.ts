import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reviewConfirmAll',
  templateUrl: './reviewConfirmAll.component.html',
  styleUrls: ['./reviewConfirmAll.component.scss'],
})
export class ReviewConfirmAllComponent implements OnInit {

  @Output() allCorrectly = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onFieldCorrectly() {
    this.allCorrectly.emit(true);
  }
}
