import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent implements OnInit {
  public showLoading = false;

  constructor(
    private loaderService: SpinnerService
  ) {
  }

  ngOnInit() {
    this.loaderService.loaderStatus$.subscribe((val: boolean) => {
      this.showLoading = val;
    });
  }
}
