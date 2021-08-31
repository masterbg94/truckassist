import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-company-settings',
  templateUrl: './app-company-settings.component.html',
  styleUrls: ['./app-company-settings.component.scss'],
})
export class AppCompanySettingsComponent implements OnInit {
  page = '';
  constructor() {}

  ngOnInit() {}

  onPageChange(event: any) {
    this.page = event;
  }
}
