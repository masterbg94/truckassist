import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-app-company-side-nav',
  templateUrl: './app-company-side-nav.component.html',
  styleUrls: ['./app-company-side-nav.component.scss'],
})
export class AppCompanySideNavComponent implements OnInit {
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  public rotateArrow = false;
  page = '';
  constructor() {}

  ngOnInit() {}

  onSwitchPage(page: string) {
    this.page = page;
    this.pageChange.emit(page);
  }
}
