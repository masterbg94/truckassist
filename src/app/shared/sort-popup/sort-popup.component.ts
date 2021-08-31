import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sort-popup',
  templateUrl: './sort-popup.component.html',
  styleUrls: ['./sort-popup.component.scss']
})
export class SortPopupComponent implements OnInit {
  @Input() sortType: number;
  @Input() left: string;

  constructor() { }

  ngOnInit(): void {
  }

}
