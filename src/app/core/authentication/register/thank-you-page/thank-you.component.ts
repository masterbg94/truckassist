import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-thank-you-component',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  email = null;

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    localStorage.removeItem('thankYouEmail');
  }

  ngOnInit() {
    this.email = localStorage.getItem('thankYouEmail');
  }
}
