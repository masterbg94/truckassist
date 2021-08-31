import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './app-dropdown-menu.component.html',
  styleUrls: ['./app-dropdown-menu.component.scss']
})
export class AppDropdownMenuComponent implements OnInit {
  @Input() inputData: any;

  constructor() {
  }

  ngOnInit() {
  }
}
